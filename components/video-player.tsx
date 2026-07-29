'use client';

import React, { useState } from 'react';
import { VideoSourceType } from '@/lib/types';
import { normalizeVideoLink, SupportedVideoSource } from '@/lib/video-links';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  sourceType: VideoSourceType;
  title: string;
  onEnded?: () => void;
}

export function VideoPlayer({ videoUrl, sourceType, title, onEnded }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const result = sourceType === 'upload'
    ? { embedUrl: '', error: 'Vídeos MP4 diretos não são mais suportados.' }
    : normalizeVideoLink(videoUrl, sourceType as SupportedVideoSource);

  return (
    <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
      {sourceType === 'zdmplay' && result.embedUrl && !hasError ? (
        <video
          src={result.embedUrl}
          title={title}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
          onEnded={onEnded}
          onError={() => setHasError(true)}
        >
          Seu navegador não suporta a reprodução deste vídeo.
        </video>
      ) : result.embedUrl && !hasError ? (
        <iframe
          src={result.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-300">
          <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
          <h3 className="font-bold text-lg text-white">Origem do Vídeo Indisponível</h3>
          <p className="text-sm text-slate-400 max-w-md mt-1">
            {result.error || `Não foi possível carregar o vídeo informado (${sourceType}).`}
          </p>
          {videoUrl && (
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2 transition-colors">
              <span>Abrir Link em Nova Aba</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}

      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950/80 text-sky-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="uppercase">{sourceType}</span>
      </div>
    </div>
  );
}
