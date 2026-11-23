from django.db import models
from django.utils.text import slugify


class Profile(models.Model):
    full_name = models.CharField(max_length=120, default="Saad Ikram")
    brand_name = models.CharField(max_length=80, default="Crimson Nova")
    monogram = models.CharField(max_length=12, default="CN.")
    headline = models.CharField(max_length=160, default="AI & Cybersecurity Engineer")
    subheadline = models.CharField(
        max_length=320,
        default="Computer Science student building AI diagnostic engines, automated Django pipelines, and secure full-stack systems.",
    )
    bio = models.TextField(blank=True)
    status_text = models.CharField(max_length=60, default="Open to AI & Cybersecurity Roles")
    is_available = models.BooleanField(default=True)
    location = models.CharField(max_length=120, blank=True)
    email = models.EmailField(default="saadikramansari@gmail.com")
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    credly_url = models.URLField(blank=True, help_text="Public Credly URL (https://www.credly.com/users/...)")
    brand_logo = models.ImageField(upload_to="brand/", blank=True, null=True)
    brand_logo_url = models.CharField(max_length=300, blank=True, default="/assets/crimson-nova.png")
    avatar_image = models.ImageField(upload_to="profile/", blank=True, null=True)
    avatar_url = models.CharField(max_length=300, blank=True, default="/assets/saad-portrait.jpg")
    resume_file = models.FileField(upload_to="resume/", blank=True, null=True)
    resume_url = models.URLField(blank=True, help_text="Optional external PDF CV link")
    hero_stats = models.JSONField(
        default=list,
        blank=True,
        help_text='[{"value": "3.86", "label": "CS CGPA · 5th Sem"}]',
    )
    work_style_note = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profile"

    def __str__(self) -> str:
        return f"{self.full_name} ({self.brand_name})"


class Project(models.Model):
    DOMAIN_CHOICES = [
        ("ai_ml", "AI / ML"),
        ("full_stack", "Full-Stack"),
        ("systems", "Systems"),
        ("data", "Data & MLOps"),
        ("hardware", "Hardware"),
    ]

    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=140)
    domain = models.CharField(max_length=24, choices=DOMAIN_CHOICES, default="ai_ml")
    tagline = models.CharField(max_length=240)
    outcome = models.CharField(max_length=260, blank=True, default="")
    overview = models.TextField()
    architecture_notes = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="projects/", blank=True, null=True)
    cover_image_url = models.CharField(max_length=300, blank=True, default="")
    metrics = models.JSONField(default=list, blank=True)
    code_filename = models.CharField(max_length=80, blank=True, default="main.py")
    code_language = models.CharField(max_length=32, blank=True, default="python")
    code_snippet = models.TextField(blank=True)
    tech_stack = models.JSONField(default=list, blank=True)
    live_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    has_case_study = models.BooleanField(default=False)
    case_study_problem = models.TextField(blank=True, default="")
    case_study_solution = models.TextField(blank=True, default="")
    case_study_tradeoffs = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:50]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.title} ({self.get_domain_display()})"


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("languages", "Languages & Core"),
        ("backend_ai", "AI, Data & Backend"),
        ("frontend", "Frontend & Tooling"),
        ("hardware_sec", "Cybersecurity, Systems & Hardware"),
    ]

    TIER_CHOICES = [
        ("daily", "Daily"),
        ("comfortable", "Comfortable"),
        ("familiar", "Familiar"),
    ]

    name = models.CharField(max_length=80)
    category = models.CharField(max_length=24, choices=CATEGORY_CHOICES, default="languages")
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default="daily")
    used_in = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "order", "name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.get_tier_display()})"


class TimelineEntry(models.Model):
    CATEGORY_CHOICES = [
        ("experience", "Internship / Experience"),
        ("education", "Education"),
        ("leadership", "Leadership"),
        ("certification", "Security Track"),
    ]

    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=140)
    organization = models.CharField(max_length=140)
    category = models.CharField(max_length=24, choices=CATEGORY_CHOICES, default="experience")
    date_range = models.CharField(max_length=60)
    summary = models.TextField()
    highlights = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-id"]
        verbose_name = "Timeline Entry"
        verbose_name_plural = "Timeline Entries"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.organization}")[:50]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.title} @ {self.organization}"


class Certificate(models.Model):
    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=160)
    issuer = models.CharField(max_length=140)
    issued_date = models.CharField(max_length=60, help_text="e.g. Oct 2026")
    credential_id = models.CharField(max_length=120, blank=True, default="")
    verify_url = models.URLField(blank=True, default="")
    image = models.ImageField(upload_to="certificates/", blank=True, null=True)
    image_url = models.CharField(max_length=300, blank=True, default="")
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.issuer}")[:50]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.title} ({self.issuer})"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}> ({self.created_at:%Y-%m-%d})"