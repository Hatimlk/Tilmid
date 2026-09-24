import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, CalendarDays, Zap, BookOpen, GraduationCap, PlayCircle, ChevronDown } from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState } from '../../components/student/primitives';
import { CourseModule } from '../../types';
import { dataManager } from '../../utils/dataManager';
import { resolveFileUrl } from '../../lib/api';

const ICONS: Record<string, React.ElementType> = {
  'diagnostic-objectifs': Target,
  'planning-efficace': CalendarDays,
  procrastination: Zap,
  'revisions-efficaces': BookOpen,
  'preparation-examens': GraduationCap,
};

// Recognized embed hosts (YouTube/Vimeo) get turned into their iframe embed
// URL; anything else (a direct .mp4 link, an uploaded file) is played with a
// plain <video> tag.
const toEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith('/embed/')) return url;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    // not a valid absolute URL — fall through to direct <video> playback
  }
  return null;
};

export const MesContenus: React.FC<{ entitlements: Entitlements }> = ({ entitlements }) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (!entitlements.learningContent) return;
    let cancelled = false;
    (async () => {
      try {
        const raw = await dataManager.getCourseModules();
        if (!cancelled) {
          setModules(raw.map((r: any) => ({
            id: r.id, slug: r.slug, title: r.title, description: r.description,
            position: r.position, videoUrl: r.video_url, videoSource: r.video_source,
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [entitlements.learningContent]);

  if (!entitlements.learningContent) {
    return (
      <div>
        <PageHeader title="Mes contenus" />
        <LockedState
          title="Aucun contenu actif"
          description="Les contenus Mouwakaba sont inclus avec les formules Essentiel, Boost et Premium."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Mes contenus" subtitle="Votre programme est organisé en modules, dans l'ordre recommandé." />
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-[76px] rounded-2xl bg-slate-50 animate-pulse" />)
        ) : (
          modules.map((m, i) => {
            const Icon = ICONS[m.slug] || PlayCircle;
            const isOpen = openId === m.id;
            const embedUrl = m.videoUrl && m.videoSource === 'link' ? toEmbedUrl(m.videoUrl) : null;
            return (
              <Card key={m.id} className="overflow-hidden">
                <button
                  onClick={() => m.videoUrl && setOpenId(isOpen ? null : m.id)}
                  disabled={!m.videoUrl}
                  className="w-full p-5 flex items-center gap-4 text-start disabled:cursor-default"
                >
                  <span className="w-11 h-11 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-black text-[13px]">
                    0{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-[14.5px]">{m.title}</p>
                    <p className="text-slate-400 text-[12.5px] font-medium">{m.description}</p>
                  </div>
                  {m.videoUrl ? (
                    <span className="shrink-0 flex items-center gap-1.5">
                      <Icon size={16} className="text-primary" />
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  ) : (
                    <span className="shrink-0 text-[11.5px] font-bold text-slate-300 flex items-center gap-1.5">
                      <PlayCircle size={14} /> Contenu à venir
                    </span>
                  )}
                </button>
                {isOpen && m.videoUrl && (
                  <div className="px-5 pb-5">
                    {m.videoSource === 'upload' ? (
                      <video controls className="w-full rounded-xl bg-black" src={resolveFileUrl(m.videoUrl)} />
                    ) : embedUrl ? (
                      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={embedUrl}
                          title={m.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video controls className="w-full rounded-xl bg-black" src={m.videoUrl} />
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
      <p className="text-slate-400 text-[12.5px] font-medium mt-6 text-center">
        Découvrez le programme complet sur{' '}
        <Link to="/coaching-offer" className="text-primary font-bold hover:underline">la page Mouwakaba</Link>.
      </p>
    </div>
  );
};
