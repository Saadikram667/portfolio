export interface MetricItem {
  value: string;
  label: string;
}

export interface ProfileData {
  full_name: string;
  brand_name: string;
  monogram: string;
  headline: string;
  subheadline: string;
  bio: string;
  status_text: string;
  is_available: boolean;
  location: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  credly_url: string;
  brand_logo: string;
  avatar_image: string;
  resume_url: string;
  hero_stats: MetricItem[];
  work_style_note: string;
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  domain: string;
  domain_label: string;
  tagline: string;
  outcome: string;
  overview: string;
  architecture_notes: string;
  cover_image: string;
  metrics: MetricItem[];
  code_filename: string;
  code_language: string;
  code_snippet: string;
  tech_stack: string[];
  live_url: string;
  github_url: string;
  has_case_study: boolean;
  case_study_problem: string;
  case_study_solution: string;
  case_study_tradeoffs: ListString;
  is_featured: boolean;
}

type ListString = string[];

export interface SkillItem {
  id: number;
  name: string;
  tier: 'daily' | 'comfortable' | 'familiar';
  tier_label: string;
  used_in: string[];
}

export interface SkillGroup {
  key: string;
  label: string;
  skills: SkillItem[];
}

export interface TimelineItem {
  id: string;
  slug: string;
  title: string;
  organization: string;
  category: string;
  category_label: string;
  date_range: string;
  summary: string;
  highlights: string[];
}

export interface CertificateData {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  issued_date: string;
  credential_id: string;
  verify_url: string;
  image: string;
}

export interface DomainFilter {
  key: string;
  label: string;
}

export interface PortfolioPayload {
  profile: ProfileData;
  projects: ProjectData[];
  project_filters: DomainFilter[];
  skill_groups: SkillGroup[];
  timeline: TimelineItem[];
  certificates: CertificateData[];
}

export type InspectorSelection =
  | { kind: 'about'; profile: ProfileData; timeline: TimelineItem[] }
  | { kind: 'project'; project: ProjectData }
  | { kind: 'skills'; groups: SkillGroup[]; activeKey?: string }
  | { kind: 'timeline'; entry: TimelineItem }
  | { kind: 'contact'; profile: ProfileData };