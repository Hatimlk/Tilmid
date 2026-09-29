import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

interface Props { moduleId: number; src: string; embedUrl?: string | null; initialPercent: number; initialSeconds: number; initialDuration: number; onProgress: (percent: number) => void; }

export const RestrictedVideo: React.FC<Props> = ({ moduleId, src, embedUrl, initialPercent, initialSeconds, initialDuration, onProgress }) => {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const watched = useRef(initialSeconds);
  const duration = useRef(initialDuration);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.5>(1);

  const provider = embedUrl?.includes('youtube') ? 'youtube' : embedUrl?.includes('vimeo') ? 'vimeo' : null;
  const frameSrc = useMemo(() => {
    if (!embedUrl || !started) return '';
    const separator = embedUrl.includes('?') ? '&' : '?';
    return `${embedUrl}${separator}${provider === 'youtube' ? 'enablejsapi=1&controls=0&disablekb=1&autoplay=1&playsinline=1' : 'api=1&controls=0&autoplay=1'}`;
  }, [embedUrl, provider, started]);

  const save = () => {
    if (watched.current <= 0 || duration.current <= 0) return;
    const pct = Math.min(100, watched.current / duration.current * 100);
    onProgress(Math.max(initialPercent, pct));
    void dataManager.saveCourseModuleProgress(moduleId, watched.current, duration.current).catch(console.error);
  };

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => {
      if (video.current && !video.current.paused) {
        watched.current = Math.max(watched.current, Math.floor(video.current.currentTime));
        duration.current = Math.floor(video.current.duration || 0);
        save();
      } else if (frame.current) {
        frame.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'getCurrentTime', args: [] }), '*');
        frame.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'getDuration', args: [] }), '*');
        frame.current.contentWindow?.postMessage({ method: 'getCurrentTime' }, '*');
        frame.current.contentWindow?.postMessage({ method: 'getDuration' }, '*');
      }
    }, 5000);
    return () => { window.clearInterval(timer); save(); };
  }, [started]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      let data: any = event.data;
      try { if (typeof data === 'string') data = JSON.parse(data); } catch { return; }
      const info = data?.info;
      const current = data?.method === 'getCurrentTime' ? data.value : info?.currentTime;
      const total = data?.method === 'getDuration' ? data.value : info?.duration;
      if (Number.isFinite(total)) duration.current = Math.floor(total);
      if (Number.isFinite(current)) {
        watched.current = Math.max(watched.current, Math.floor(current));
        save();
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [initialPercent]);

  const start = () => {
    setStarted(true);
    requestAnimationFrame(() => {
      if (video.current && initialSeconds > 0) video.current.currentTime = initialSeconds;
      void video.current?.play();
    });
  };
  const changeSpeed = (value: 1 | 1.5) => {
    setSpeed(value);
    if (video.current) video.current.playbackRate = value;
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [value] }), '*');
    frame.current?.contentWindow?.postMessage({ method: 'setPlaybackRate', value }, '*');
  };
  const prepareFrame = () => {
    window.setTimeout(() => {
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: moduleId, channel: 'tilmid' }), '*');
      if (initialSeconds > 0) {
        frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [initialSeconds, true] }), '*');
        frame.current?.contentWindow?.postMessage({ method: 'setCurrentTime', value: initialSeconds }, '*');
      }
      changeSpeed(speed);
    }, 700);
  };

  return <div>
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      {embedUrl ? (started && <iframe ref={frame} src={frameSrc} onLoad={prepareFrame} className="absolute inset-0 w-full h-full pointer-events-none" title="Vidéo du module" allow="autoplay; encrypted-media; picture-in-picture" />) :
        <video ref={video} src={src} playsInline controls={false} disablePictureInPicture controlsList="nodownload noplaybackrate nofullscreen" onContextMenu={(e) => e.preventDefault()} className="absolute inset-0 w-full h-full pointer-events-none" />}
      {!started && <button onClick={start} className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center shadow-xl" aria-label="Démarrer la vidéo"><Play fill="currentColor" /></button>}
    </div>
    <div className="mt-3 flex items-center justify-end gap-2">
      <span className="text-xs font-bold text-slate-400 me-1">Vitesse</span>
      {([1, 1.5] as const).map((v) => <button key={v} onClick={() => changeSpeed(v)} className={`px-3 py-1.5 rounded-lg text-xs font-black ${speed === v ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>×{v}</button>)}
    </div>
  </div>;
};
