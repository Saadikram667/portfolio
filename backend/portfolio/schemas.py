from typing import List
from ninja import Schema
from pydantic import EmailStr, Field


class MetricSchema(Schema):
    value: str
    label: str


class ProfileSchema(Schema):
    full_name: str
    brand_name: str
    monogram: str
    headline: str
    subheadline: str
    bio: str
    status_text: str
    is_available: bool
    location: str
    email: str
    github_url: str
    linkedin_url: str
    credly_url: str
    brand_logo: str
    avatar_image: str
    resume_url: str
    hero_stats: List[MetricSchema]
    work_style_note: str


class ProjectSchema(Schema):
    id: str
    slug: str
    title: str
    domain: str
    domain_label: str
    tagline: str
    outcome: str
    overview: str
    architecture_notes: str
    cover_image: str
    metrics: List[MetricSchema]
    code_filename: str
    code_language: str
    code_snippet: str
    tech_stack: List[str]
    live_url: str
    github_url: str
    has_case_study: bool
    case_study_problem: str
    case_study_solution: str
    case_study_tradeoffs: List[str]
    is_featured: bool


class SkillItemSchema(Schema):
    id: int
    name: str
    tier: str
    tier_label: str
    used_in: List[str]


class SkillGroupSchema(Schema):
    key: str
    label: str
    skills: List[SkillItemSchema]


class TimelineSchema(Schema):
    id: str
    slug: str
    title: str
    organization: str
    category: str
    category_label: str
    date_range: str
    summary: str
    highlights: List[str]


class CertificateSchema(Schema):
    id: str
    slug: str
    title: str
    issuer: str
    issued_date: str
    credential_id: str
    verify_url: str
    image: str


class DomainFilterSchema(Schema):
    key: str
    label: str


class PortfolioResponseSchema(Schema):
    profile: ProfileSchema
    projects: List[ProjectSchema]
    project_filters: List[DomainFilterSchema]
    skill_groups: List[SkillGroupSchema]
    timeline: List[TimelineSchema]
    certificates: List[CertificateSchema]


class ContactInSchema(Schema):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    subject: str = Field(default="", max_length=160)
    message: str = Field(..., min_length=3, max_length=3000)
    website: str = Field(default="", max_length=200)


class ContactOutSchema(Schema):
    ok: bool
    message: str