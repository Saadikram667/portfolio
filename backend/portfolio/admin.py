from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Certificate, ContactMessage, Profile, Project, Skill, TimelineEntry


@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    list_display = ("full_name", "brand_name", "headline", "is_available", "updated_at")
    fieldsets = (
        ("Identity & Brand", {"fields": ("full_name", "brand_name", "monogram", "headline", "subheadline", "bio")}),
        ("Brand Logo & Portrait", {"fields": ("brand_logo", "brand_logo_url", "avatar_image", "avatar_url")}),
        ("Hero Proof & Working Style", {"fields": ("hero_stats", "work_style_note")}),
        ("Availability & Location", {"fields": ("status_text", "is_available", "location")}),
        ("Channels & CV", {"fields": ("email", "github_url", "linkedin_url", "credly_url", "resume_file", "resume_url")}),
    )


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ("title", "domain", "has_case_study", "is_featured", "is_published", "order")
    list_editable = ("order", "has_case_study", "is_featured", "is_published")
    list_filter = ("domain", "has_case_study", "is_featured", "is_published")
    search_fields = ("title", "tagline", "outcome", "overview")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        ("Overview & Outcome", {"fields": ("title", "slug", "domain", "tagline", "outcome", "overview", "architecture_notes")}),
        ("Visual & Metrics", {"fields": ("cover_image", "cover_image_url", "metrics", "tech_stack")}),
        ("Case Study", {"fields": ("has_case_study", "case_study_problem", "case_study_solution", "case_study_tradeoffs")}),
        ("Code Preview", {"fields": ("code_filename", "code_language", "code_snippet")}),
        ("Links & Visibility", {"fields": ("live_url", "github_url", "is_featured", "is_published", "order")}),
    )


@admin.register(Skill)
class SkillAdmin(ModelAdmin):
    list_display = ("name", "category", "tier", "order", "is_published")
    list_editable = ("tier", "order", "is_published")
    list_filter = ("category", "tier", "is_published")
    search_fields = ("name",)


@admin.register(TimelineEntry)
class TimelineEntryAdmin(ModelAdmin):
    list_display = ("title", "organization", "category", "date_range", "order", "is_published")
    list_editable = ("order", "is_published")
    list_filter = ("category", "is_published")
    search_fields = ("title", "organization")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Certificate)
class CertificateAdmin(ModelAdmin):
    list_display = ("title", "issuer", "issued_date", "credential_id", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "issuer", "credential_id")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ("name", "email", "created_at", "is_read")
    list_editable = ("is_read",)
    list_filter = ("is_read", "created_at")
    readonly_fields = ("name", "email", "message", "created_at")

    def has_add_permission(self, request):
        return False