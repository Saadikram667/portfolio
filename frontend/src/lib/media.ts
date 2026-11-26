export const STATIC_CV_FALLBACK = '/assets/Saad_Ikram_CV.pdf';

export function isDeadProductionMediaUrl(rawUrl: string): boolean {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) return false;

  try {
    const parsed = new URL(rawUrl, window.location.origin);
    return parsed.pathname.startsWith('/media/');
  } catch {
    return rawUrl.startsWith('/media/');
  }
}

export function getSafeMediaUrl(rawUrl?: string | null, fallback = ''): string {
  const url = (rawUrl || '').trim();
  if (!url || isDeadProductionMediaUrl(url)) return fallback;
  return url;
}

export function getResumeDownloadUrl(rawUrl?: string | null): string {
  const url = getSafeMediaUrl(rawUrl, STATIC_CV_FALLBACK);
  if (url === STATIC_CV_FALLBACK) return STATIC_CV_FALLBACK;

  try {
    const parsed = new URL(url, window.location.origin);
    if (
      parsed.hostname.includes('supabase.co') &&
      parsed.pathname.includes('/storage/v1/object/public/')
    ) {
      parsed.searchParams.set('download', 'Saad_Ikram_CV.pdf');
      return parsed.toString();
    }
    return parsed.toString();
  } catch {
    return STATIC_CV_FALLBACK;
  }
}

export function getAvatarCandidates(rawUrl?: string | null): string[] {
  const candidates: string[] = [];
  const safe = getSafeMediaUrl(rawUrl);

  if (safe) candidates.push(safe);

  candidates.push(
    '/assets/saad-portrait.jpg',
    '/assets/saad-photo.jpg',
    '/assets/saad-photo.jpeg',
    '/assets/saad-photo.png',
    '/assets/saad-photo.webp'
  );

  return Array.from(new Set(candidates));
}