from collections import OrderedDict
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.html import strip_tags
from django_ratelimit.decorators import ratelimit
from ninja import NinjaAPI

from .models import Certificate, ContactMessage, Profile, Project, Skill, TimelineEntry
from .schemas import ContactInSchema, ContactOutSchema, PortfolioResponseSchema

api = NinjaAPI(
    title="Saad Ikram · Crimson Nova API",
    version="2.2.0",
    docs_url="/docs" if settings.DEBUG else None,
)


def _client_ip(_group: str, request: HttpRequest) -> str:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


def _resolve_file_url(
    request: HttpRequest,
    file_field,
    fallback_url: str = "",
    default_static: str = "",
) -> str:
    if file_field and getattr(file_field, "name", ""):
        url = file_field.url
        if url.startswith("http"):
            return url
        # Local /media/ paths only work in local DEBUG mode, never on Vercel
        if settings.DEBUG:
            return request.build_absolute_uri(url)
    return (fallback_url or "").strip() or default_static


@api.get("/portfolio/", response=PortfolioResponseSchema)
def get_portfolio(request: HttpRequest, response: HttpResponse):
    # Cache at Vercel's Edge CDN for 60s and serve stale while revalidating for 5m
    response["Cache-Control"] = "public, s-maxage=60, stale-while-revalidate=300"

    profile_obj = Profile.objects.first()
    if profile_obj:
        profile = {
            "full_name": profile_obj.full_name,
            "brand_name": profile_obj.brand_name,
            "monogram": profile_obj.monogram,
            "headline": profile_obj.headline,
            "subheadline": profile_obj.subheadline,
            "bio": profile_obj.bio,
            "status_text": profile_obj.status_text,
            "is_available": profile_obj.is_available,
            "location": profile_obj.location,
            "email": profile_obj.email,
            "github_url": profile_obj.github_url,
            "linkedin_url": profile_obj.linkedin_url,
            "credly_url": profile_obj.credly_url,
            "brand_logo": _resolve_file_url(
                request,
                profile_obj.brand_logo,
                profile_obj.brand_logo_url,
                "/assets/crimson-nova.png",
            ),
            "avatar_image": _resolve_file_url(
                request,
                profile_obj.avatar_image,
                profile_obj.avatar_url,
                "/assets/saad-portrait.jpg",
            ),
            "resume_url": _resolve_file_url(
                request,
                profile_obj.resume_file,
                profile_obj.resume_url,
                "/assets/Saad_Ikram_CV.pdf",
            ),
            "hero_stats": profile_obj.hero_stats or [],
            "work_style_note": profile_obj.work_style_note or "",
        }
    else:
        profile = {
            "full_name": "Saad Ikram",
            "brand_name": "Crimson Nova",
            "monogram": "CN.",
            "headline": "AI & Cybersecurity Software Engineer",
            "subheadline": "Run `python manage.py seed_portfolio` to populate records.",
            "bio": "",
            "status_text": "Open to AI & Cybersecurity Roles",
            "is_available": True,
            "location": "Karachi, Pakistan",
            "email": "saadikramansari@gmail.com",
            "github_url": "https://github.com/Saadikram667",
            "linkedin_url": "",
            "credly_url": "",
            "brand_logo": "/assets/crimson-nova.png",
            "avatar_image": "/assets/saad-portrait.jpg",
            "resume_url": "/assets/Saad_Ikram_CV.pdf",
            "hero_stats": [],
            "work_style_note": "",
        }

    projects = []
    seen_domains: OrderedDict[str, str] = OrderedDict()

    for proj in Project.objects.filter(is_published=True):
        seen_domains[proj.domain] = proj.get_domain_display()
        projects.append(
            {
                "id": f"project-{proj.slug}",
                "slug": proj.slug,
                "title": proj.title,
                "domain": proj.domain,
                "domain_label": proj.get_domain_display(),
                "tagline": proj.tagline,
                "outcome": proj.outcome or "",
                "overview": proj.overview,
                "architecture_notes": proj.architecture_notes,
                "cover_image": _resolve_file_url(
                    request, proj.cover_image, proj.cover_image_url
                ),
                "metrics": proj.metrics or [],
                "code_filename": proj.code_filename,
                "code_language": proj.code_language,
                "code_snippet": proj.code_snippet,
                "tech_stack": proj.tech_stack or [],
                "live_url": proj.live_url,
                "github_url": proj.github_url,
                "has_case_study": proj.has_case_study,
                "case_study_problem": proj.case_study_problem or "",
                "case_study_solution": proj.case_study_solution or "",
                "case_study_tradeoffs": proj.case_study_tradeoffs or [],
                "is_featured": proj.is_featured,
            }
        )

    project_filters = [{"key": "all", "label": "All"}] + [
        {"key": k, "label": v} for k, v in seen_domains.items()
    ]

    grouped_skills: OrderedDict[str, dict] = OrderedDict()
    for skill in Skill.objects.filter(is_published=True):
        if skill.category not in grouped_skills:
            grouped_skills[skill.category] = {
                "key": skill.category,
                "label": skill.get_category_display(),
                "skills": [],
            }
        grouped_skills[skill.category]["skills"].append(
            {
                "id": skill.id,
                "name": skill.name,
                "tier": skill.tier,
                "tier_label": skill.get_tier_display(),
                "used_in": skill.used_in or [],
            }
        )

    timeline = [
        {
            "id": f"timeline-{entry.slug}",
            "slug": entry.slug,
            "title": entry.title,
            "organization": entry.organization,
            "category": entry.category,
            "category_label": entry.get_category_display(),
            "date_range": entry.date_range,
            "summary": entry.summary,
            "highlights": entry.highlights or [],
        }
        for entry in TimelineEntry.objects.filter(is_published=True)
    ]

    certificates = [
        {
            "id": f"cert-{cert.slug}",
            "slug": cert.slug,
            "title": cert.title,
            "issuer": cert.issuer,
            "issued_date": cert.issued_date,
            "credential_id": cert.credential_id,
            "verify_url": cert.verify_url,
            "image": _resolve_file_url(request, cert.image, cert.image_url),
        }
        for cert in Certificate.objects.filter(is_published=True)
    ]

    return {
        "profile": profile,
        "projects": projects,
        "project_filters": project_filters,
        "skill_groups": list(grouped_skills.values()),
        "timeline": timeline,
        "certificates": certificates,
    }


@api.post("/contact/", response={200: ContactOutSchema, 400: ContactOutSchema, 429: ContactOutSchema})
@ratelimit(key=_client_ip, rate="5/m", method="POST", block=False)
def submit_contact(request: HttpRequest, payload: ContactInSchema):
    if getattr(request, "limited", False):
        return 429, {
            "ok": False,
            "message": "Rate limit exceeded. Please wait a minute before sending again.",
        }

    # Silent spam honeypot
    if payload.website.strip():
        return 200, {"ok": True, "message": "Transmission received."}

    clean_name = strip_tags(payload.name).strip()
    clean_subject = strip_tags(payload.subject).strip()
    clean_message = strip_tags(payload.message).strip()

    if not clean_name or not clean_message:
        return 400, {
            "ok": False,
            "message": "Please provide a valid name and message.",
        }

    stored_message = (
        f"[Subject: {clean_subject}]\n\n{clean_message}"
        if clean_subject
        else clean_message
    )

    ContactMessage.objects.create(
        name=clean_name,
        email=str(payload.email).strip(),
        message=stored_message,
    )

    return 200, {
        "ok": True,
        "message": f"Transmission logged in Crimson Nova inbox. Thanks, {clean_name}!",
    }