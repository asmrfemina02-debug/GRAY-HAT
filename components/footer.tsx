'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAdminAuth } from '@/lib/admin-auth';
import { Terminal, Shield, Github, Youtube, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  const { currentUser } = useApp();
  const { isAdmin } = useAdminAuth();

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-white/60 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Mission Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-lg font-serif italic tracking-tight text-white font-bold">GRAY <span className="font-sans font-extrabold not-italic text-white/90">HAT</span></span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Repositório aberto e colaborativo de conhecimento sobre negócios digitais, IA, marketing e programação. Cursos 100% gratuitos e abertos para a comunidade.
          </p>
          <div className="pt-1 text-[10px] uppercase font-mono tracking-widest text-white/40">
            &ldquo;tudo que os gurus ensinam no digital&rdquo;
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Categorias Populares</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/cursos?cat=cat-ia" className="hover:text-white transition-colors">Inteligência Artificial</Link></li>
            <li><Link href="/cursos?cat=cat-tiktok" className="hover:text-white transition-colors">TikTok Shop & Afiliados</Link></li>
            <li><Link href="/cursos?cat=cat-trafego" className="hover:text-white transition-colors">Tráfego Pago (Meta & Google)</Link></li>
            <li><Link href="/cursos?cat=cat-auto" className="hover:text-white transition-colors">Automação com n8n & Make</Link></li>
            <li><Link href="/cursos?cat=cat-prog" className="hover:text-white transition-colors">Programação & Dev Web</Link></li>
          </ul>
        </div>

        {/* Ecosystem Column */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Comunidade & Criadores</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/metodo" className="hover:text-white transition-colors">White, Gray e Black Hat</Link></li>
            {isAdmin && (
              <li><Link href="/criador" className="hover:text-white transition-colors">Publicar um Curso</Link></li>
            )}
            <li><Link href="/cursos?favorite=true" className="hover:text-white transition-colors">Minha Lista (Favoritos)</Link></li>
            <li><Link href={`/perfil/${currentUser.id}`} className="hover:text-white transition-colors">Meu Desempenho & Medalhas</Link></li>
            <li><Link href="/admin" className="hover:text-purple-300 transition-colors">Painel de Moderação</Link></li>
          </ul>
        </div>

        {/* Manifesto Note Column */}
        <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Sem Promessas Falsas</span>
          </div>
          <p className="text-[11px] text-white/50 leading-normal">
            Posicionamos a plataforma como um repositório aberto de conhecimento prático, sem promessas absurdas de enriquecimento fácil.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono gap-4">
        <p>© 2026 GRAY HAT PLATFORM • REPOSITÓRIO ABERTO</p>
        <p className="flex items-center gap-1">
          <span>Feito para a comunidade de criadores e alunos</span>
        </p>
      </div>
    </footer>
  );
}
