'use client';

import React from 'react';
import { Course, User } from '@/lib/types';
import { Award, Download, Printer, X, CheckCircle2, Shield, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  course: Course;
  user: User;
  onClose: () => void;
}

export function CertificateModal({ course, user, onClose }: CertificateModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Certificado de Conclusão</h2>
              <p className="text-xs text-slate-400">Gray Hat Open Knowledge Repository</p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div id="printable-certificate" className="relative bg-slate-950 border-4 border-amber-500/40 rounded-xl p-8 text-center space-y-6 shadow-inner overflow-hidden">
          {/* Subtle Background Badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Shield className="w-96 h-96 text-slate-400" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center gap-2 text-sky-400 font-mono tracking-widest text-sm uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Plataforma Gray Hat</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              CERTIFICADO DE CONCLUSÃO
            </h1>

            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Certificamos que para os devidos fins de conhecimento livre que
            </p>

            <div className="py-2 border-b-2 border-sky-500/50 max-w-md mx-auto">
              <span className="text-2xl sm:text-3xl font-bold text-sky-300 font-serif italic">
                {user.name}
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              concluiu com êxito e aproveitamento de 100% a carga horária de{' '}
              <strong className="text-white font-semibold">{course.durationMinutes} minutos</strong> do curso:
            </p>

            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl max-w-xl mx-auto shadow-md">
              <h3 className="text-lg font-extrabold text-amber-300">{course.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ministrado por <span className="text-slate-200 font-medium">{course.teacherName}</span>
              </p>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-4 text-xs text-slate-400 border-t border-slate-800/80 max-w-lg mx-auto">
              <div>
                <p className="text-slate-500">Data de Emissão</p>
                <p className="font-semibold text-slate-200">{todayStr}</p>
              </div>
              <div>
                <p className="text-slate-500">Código de Validação</p>
                <p className="font-mono text-sky-400">GH-{course.id.slice(0, 8).toUpperCase()}-2026</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
