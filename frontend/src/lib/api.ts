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
    linkedin_url: '',
    credly_url: '',
    brand_logo: '/assets/crimson-nova.png',
    avatar_image: '/assets/saad-portrait.jpg',
    resume_url: '',
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
  try {
    const res = await fetch(`${API_BASE}/portfolio/`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as PortfolioPayload;
    return { data, fromApi: true };
  } catch {
    return { data: FALLBACK_PORTFOLIO, fromApi: false };
  }
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  website?: string;
}): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { ok?: boolean; message?: string; detail?: string };
  if (!res.ok) {
    throw new Error(data.message || data.detail || 'Could not send message.');
  }
  return { ok: Boolean(data.ok), message: data.message || 'Transmission received.' };
}