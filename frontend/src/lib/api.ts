import type { PortfolioPayload } from '../types/portfolio';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export const FALLBACK_PORTFOLIO: PortfolioPayload = {
  profile: {
    full_name: 'Saad Ikram',
    brand_name: 'Crimson Nova',
    monogram: 'CN.',
    headline: 'AI & Cybersecurity Software Engineer',
    subheadline:
      '5th-semester CS student (3.86 CGPA) building deep-learning diagnostics, automated Django AI pipelines, and security-conscious full-stack systems.',
    bio: 'Computer Science student at DHA Suffa University and President of TVCSS, building under the studio identity Crimson Nova.',
    status_text: 'Open to AI & Cybersecurity Roles',
    is_available: true,
    location: 'Karachi, Pakistan · Remote Worldwide',
    email: 'saadikramansari@gmail.com',
    github_url: 'https://github.com/Saadikram667',
    linkedin_url: 'https://www.linkedin.com/in/saad-ikram-403712392/',
    credly_url: 'https://www.credly.com/users/saad-ikram.3a64e354/badges',
    brand_logo: '/assets/crimson-nova.png',
    avatar_image: '/assets/saad-portrait.jpg',
    resume_url: '/assets/Saad_Ikram_CV.pdf',
    hero_stats: [
      { value: '3.86', label: 'CS CGPA · 5th Sem' },
      { value: '3 yrs', label: 'Coding Experience' },
      { value: '2', label: 'Hackathon Builds' },
    ],
    work_style_note:
      'I validate data flows, system boundaries, and security assumptions before writing production code.',
  },
  projects: [],
  project_filters: [{ key: 'all', label: 'All' }],
  skill_groups: [],
  timeline: [],
  certificates: [],
};

export async function fetchPortfolio(): Promise<{ data: PortfolioPayload; fromApi: boolean }> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_BASE}/portfolio/`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as PortfolioPayload;
    return { data, fromApi: true };
  } catch {
    return { data: FALLBACK_PORTFOLIO, fromApi: false };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string;
}): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    message?: string;
    detail?: string | Array<{ msg?: string; loc?: Array<string | number> }>;
  };

  if (!res.ok) {
    let errMsg = data.message || '';
    if (!errMsg && typeof data.detail === 'string') {
      errMsg = data.detail;
    } else if (!errMsg && Array.isArray(data.detail) && data.detail.length > 0) {
      const first = data.detail[0];
      const field = first.loc?.[first.loc.length - 1];
      errMsg = field ? `${String(field)}: ${first.msg || 'Invalid value'}` : first.msg || '';
    }
    throw new Error(errMsg || 'Could not send right now. Try emailing directly below.');
  }

  return { ok: Boolean(data.ok), message: data.message || 'Message delivered to inbox.' };
}