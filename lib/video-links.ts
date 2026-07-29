import { VideoSourceType } from '@/lib/types';

export type SupportedVideoSource = Exclude<VideoSourceType, 'upload'>;

export interface VideoLinkResult {
  embedUrl: string;
  error?: string;
}

const VIDEO_ID = /^[a-zA-Z0-9_-]{6,}$/;

export function normalizeVideoLink(rawUrl: string, sourceType: SupportedVideoSource): VideoLinkResult {
  const value = rawUrl.trim();
  if (!value) return { embedUrl: '', error: 'Informe o link do vídeo.' };

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { embedUrl: '', error: 'O link informado não é uma URL válida.' };
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return { embedUrl: '', error: 'Use um link HTTP ou HTTPS.' };
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const parts = url.pathname.split('/').filter(Boolean);

  if (sourceType === 'youtube') {
    let id = '';
    if (host === 'youtu.be') id = parts[0] || '';
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      id = url.searchParams.get('v') || '';
      if (['embed', 'shorts', 'live'].includes(parts[0])) id = parts[1] || '';
    }
    if (!VIDEO_ID.test(id)) return { embedUrl: '', error: 'Use um link válido do YouTube (vídeo, Shorts ou live).' };
    return { embedUrl: `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0` };
  }

  if (sourceType === 'gdrive') {
    if (!host.endsWith('drive.google.com')) return { embedUrl: '', error: 'Use um link de arquivo do Google Drive.' };
    const fileIndex = parts.indexOf('d');
    const id = fileIndex >= 0 ? parts[fileIndex + 1] : url.searchParams.get('id');
    if (!id) return { embedUrl: '', error: 'Não foi possível identificar o arquivo do Google Drive.' };
    return { embedUrl: `https://drive.google.com/file/d/${id}/preview` };
  }

  if (sourceType === 'vimeo') {
    if (!host.endsWith('vimeo.com')) return { embedUrl: '', error: 'Use um link válido do Vimeo.' };
    const idIndex = parts.findIndex(part => /^\d+$/.test(part));
    const id = idIndex >= 0 ? parts[idIndex] : '';
    const hash = url.searchParams.get('h') || (idIndex >= 0 && /^[a-f0-9]+$/i.test(parts[idIndex + 1] || '') ? parts[idIndex + 1] : '');
    if (!id) return { embedUrl: '', error: 'Não foi possível identificar o vídeo do Vimeo.' };
    return { embedUrl: `https://player.vimeo.com/video/${id}${hash ? `?h=${encodeURIComponent(hash)}` : ''}` };
  }

  if (sourceType === 'cloudflare') {
    const allowed = host === 'iframe.videodelivery.net'
      || host === 'watch.cloudflarestream.com'
      || host.endsWith('.cloudflarestream.com')
      || host.endsWith('.videodelivery.net');
    if (!allowed) return { embedUrl: '', error: 'Use um link do Cloudflare Stream ou do videodelivery.net.' };
    const embedIndex = parts.indexOf('iframe');
    const id = embedIndex >= 0 ? parts[embedIndex + 1] : parts[0];
    if (!id) return { embedUrl: '', error: 'Não foi possível identificar o vídeo do Cloudflare Stream.' };
    return { embedUrl: `https://iframe.videodelivery.net/${id}` };
  }

  if (sourceType === 'bunny') {
    if (host === 'iframe.mediadelivery.net' && parts[0] === 'embed' && parts[1] && parts[2]) {
      return { embedUrl: url.toString() };
    }
    if (host === 'video.bunnycdn.com' && parts[0] === 'play' && parts[1] && parts[2]) {
      return { embedUrl: `https://iframe.mediadelivery.net/embed/${parts[1]}/${parts[2]}` };
    }
    return { embedUrl: '', error: 'Use o link Embed do Bunny Stream ou um link video.bunnycdn.com/play.' };
  }

  if (sourceType === 'zdmplay') {
    const isCdnVideo = host === 'cdn.zdmplay.com' && url.pathname.startsWith('/videos/');
    const isApiStream = host === 'app.zdmplay.com' && url.pathname.startsWith('/api/stream/');
    if (url.protocol !== 'https:' || (!isCdnVideo && !isApiStream)) {
      return {
        embedUrl: '',
        error: 'Use um link HTTPS de cdn.zdmplay.com/videos/ ou app.zdmplay.com/api/stream/.'
      };
    }
    return { embedUrl: url.toString() };
  }

  if (sourceType === 'cakto') {
    if (
      url.protocol !== 'https:'
      || host !== 'stream.cakto.com.br'
      || !url.pathname.endsWith('/playlist.m3u8')
    ) {
      return {
        embedUrl: '',
        error: 'Use um link HTTPS no formato stream.cakto.com.br/.../playlist.m3u8.'
      };
    }
    return { embedUrl: url.toString() };
  }

  if (sourceType === 'telegram') {
    if (!['t.me', 'telegram.me'].includes(host)) {
      return { embedUrl: '', error: 'Use um link de mensagem t.me.' };
    }
    if (parts[0] === 'c' && /^\d+$/.test(parts[1] || '') && /^\d+$/.test(parts[2] || '')) {
      return { embedUrl: `https://t.me/c/${parts[1]}/${parts[2]}` };
    }
    if (parts[0] && parts[0] !== 'c' && /^\d+$/.test(parts[1] || '')) {
      return { embedUrl: `https://t.me/${parts[0]}/${parts[1]}?embed=1&mode=tme` };
    }
    return { embedUrl: '', error: 'Use o link direto de uma mensagem ou vídeo do Telegram.' };
  }

  return { embedUrl: '', error: 'Plataforma de vídeo não suportada.' };
}
