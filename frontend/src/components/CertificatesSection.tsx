import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, ExternalLink, X, ZoomIn } from 'lucide-react';
import type { CertificateData } from '../types/portfolio';
import { DURATION, MOTION_EASE } from '../lib/motion';

export function CertificatesSection({
  certificates,
  credlyUrl,
}: {
  certificates: CertificateData[];
  credlyUrl: string;
}) {
  const [activeCert, setActiveCert] = useState<CertificateData | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeCert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCert(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeCert]);

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-14 lg:py-16 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-crimson">
            05 / Credentials & Badges
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
            Certifications & Hackathons
          </h2>
        </div>

        {credlyUrl && (
          <a
            href={credlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full bg-surface hover:border-gold border border-edge text-xs font-mono text-ink transition-colors"
          >
            <Award className="w-4 h-4 text-gold" />
            <span>View Credly Badges</span>
            <ExternalLink className="w-3.5 h-3.5 text-crimson" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert) => {
          const hasImage = Boolean(cert.image) && !brokenImages[cert.id];
          return (
            <article
              key={cert.id}
              className="group rounded-3xl overflow-hidden bg-surface border border-edge hover:border-gold transition-colors shadow-sm flex flex-col justify-between"
            >
              <div>
                <button
                  type="button"
                  onClick={() => hasImage && setActiveCert(cert)}
                  disabled={!hasImage}
                  className="relative block w-full h-48 bg-surface-2/80 border-b border-edge overflow-hidden text-left"
                >
                  {hasImage ? (
                    <>
                      <img
                        src={cert.image}
                        alt={cert.title}
                        loading="lazy"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [cert.id]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-black/75 text-[#F4E8D8] border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5 text-[#D9B44A]" />
                        <span>View</span>
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-6 text-center">
                      <Award className="w-8 h-8 text-gold" />
                      <span className="text-xs font-mono text-muted">
                        Verified Credential · {cert.issued_date}
                      </span>
                    </div>
                  )}
                </button>

                <div className="p-5 space-y-2">
                  <span className="text-xs font-mono text-burgundy dark:text-gold">
                    {cert.issued_date}
                  </span>
                  <h3 className="font-display text-lg font-bold text-ink leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-muted">{cert.issuer}</p>
                </div>
              </div>

              {(cert.credential_id || cert.verify_url) && (
                <div className="px-5 py-3.5 border-t border-edge flex items-center justify-between gap-2 bg-surface-2/40">
                  {cert.credential_id ? (
                    <span className="text-xs font-mono text-muted truncate">
                      ID: {cert.credential_id}
                    </span>
                  ) : (
                    <span />
                  )}
                  {cert.verify_url && (
                    <a
                      href={cert.verify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 text-xs font-mono text-crimson hover:underline"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Certificate Zoom Lightbox */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: DURATION.base, ease: MOTION_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-3xl overflow-hidden bg-surface border border-edge shadow-2xl"
            >
              <div className="px-5 py-3.5 border-b border-edge flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-ink text-base">
                    {activeCert.title}
                  </h3>
                  <p className="text-xs font-mono text-muted">
                    {activeCert.issuer} · {activeCert.issued_date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-2 border border-edge text-muted hover:text-ink"
                >
                  <span>ESC</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 bg-black/90 flex justify-center">
                <img
                  src={activeCert.image}
                  alt={activeCert.title}
                  className="max-h-[75vh] w-auto object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}