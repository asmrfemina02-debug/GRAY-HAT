'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { ShieldCheck, Video, GraduationCap, Sparkles } from 'lucide-react';

export function RoleSwitcherBanner() {
  const { currentUser, switchRole, courses } = useApp();

  const pendingCount = courses.filter(c => c.status === 'pending').length;

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'aluno',
      label: 'Visão do Aluno',
      icon: <GraduationCap className="w-4 h-4" />,
      desc: 'Navegue, assista aulas e acumule XP',
    },
    {
      role: 'criador',
      label: 'Painel do Criador',
      icon: <Video className="w-4 h-4" />,
      desc: 'Crie cursos, módulos e envie para revisão',
    },
    {
      role: 'admin',
      label: 'Painel do Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      desc: `Aprove/rejeite cursos e modere conteúdos ${pendingCount > 0 ? `(${pendingCount} pendente)` : ''}`,
    },
  ];

  return (
    <div className="bg-[#0a0a0a] border-b border-white/10 px-4 py-2 text-xs text-white/70">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/40 uppercase tracking-widest text-[10px] font-mono">Modo de Perfil:</span>
          <span className="text-white font-semibold uppercase tracking-wider">{currentUser.role}</span>
          <span className="hidden sm:inline text-white/40">• {currentUser.name}</span>
        </div>

        <div className="flex items-center gap-1 bg-[#050505] p-1 rounded-lg border border-white/10">
          <span className="text-white/40 text-[10px] uppercase tracking-widest px-2 hidden md:inline-flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Alternar Visão:
          </span>
          {roles.map(r => {
            const isActive = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                title={r.desc}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
                {r.role === 'admin' && pendingCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
