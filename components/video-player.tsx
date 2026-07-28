'use client';

import React, { useState } from 'react';
import { VideoSourceType } from '@/lib/types';
import { Play, AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  sourceType: VideoSourceType;
  title: string;
  onEnded?: () => void;
}

export function VideoPlayer({ videoUrl, sourceType, title, onEnded }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  // Helper to extract clean embed URL
  const getEmbedUrl = () => {
    if (!videoUrl) return '';

    try {
      if (sourceType === 'youtube' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        let videoId = '';
        if (videoUrl.includes('youtu.be/')) {
          videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        } else if (videoUrl.includes('watch?v=')) {
          videoId = videoUrl.split('watch?v=')[1]?.split('&')[0];
        } else if (videoUrl.includes('embed/')) {
          return videoUrl;
        }
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0` : videoUrl;
      }

      if (sourceType === 'gdrive' || videoUrl.includes('drive.google.com')) {
        if (videoUrl.includes('/view') || videoUrl.includes('/edit')) {
          return videoUrl.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
        }
        if (!videoUrl.endsWith('/preview')) {
          return `${videoUrl}/preview`;
        }
        return videoUrl;
      }

      if (sourceType === 'vimeo' || videoUrl.includes('vimeo.com')) {
        const vimeoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
        return vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1` : videoUrl;
      }

      return videoUrl;
    } catch (e) {
      console.error('Video URL parse error:', e);
      return videoUrl;
    }
  };

  const embedUrl = getEmbedUrl();
  const isDirectVideo = sourceType === 'upload' || videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm');

  return (
    <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
      {isDirectVideo ? (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full object-contain"
          onEnded={onEnded}
          onError={() => setHasError(true)}
        >
          Seu navegador não suporta reprodução direta deste arquivo.
        </video>
      ) : embedUrl ? (
        <iframe
          src={embedUrl}
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
            Não foi possível carregar o player diretamente para o link fornecido ({sourceType}).
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>Abrir Link em Nova Aba</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Video Source Indicator Tag */}
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950/80 text-sky-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="uppercase">{sourceType}</span>
      </div>
    </div>
  );
}
