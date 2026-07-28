'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoleSwitcherBanner } from '@/components/role-switcher-banner';
import { Course } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Star,
  Users,
  MessageSquare,
  FileCheck,
  Search,
  Filter,
  Sparkles,
  Shield,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function AdminPanelPage() {
  const { courses, approveCourse, rejectCourse, toggleFeatureCourse, deleteCourse, comments, moderateComment, reports, resolveReport } = useApp();

  const [activeTab, setActiveTab] = useState<'submissions' | 'courses' | 'comments' | 'reports'>('submissions');
  const [rejectingCourseId, setRejectingCourseId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingSubmissions = courses.filter(c => c.status === 'pending');
  const publishedCourses = courses.filter(c => c.status === 'published');
  const pendingReports = reports.filter(r => r.status === 'pending');

  const handleApprove = (courseId: string) => {
    approveCourse(courseId, 'Aprovado pelo administrador após revisão das videoaulas e diretrizes.');
    alert('Curso APROVADO e publicado com sucesso no repositório!');
  };

  const handleReject = (courseId: string) => {
    if (!rejectReason.trim()) {
      alert('Por favor, digite o motivo da rejeição.');
      return;
    }
    rejectCourse(courseId, rejectReason.trim());
    setRejectingCourseId(null);
    setRejectReason('');
    alert('Curso rejeitado. O criador foi notificado dos ajustes necessários.');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans">
      <RoleSwitcherBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15 text-[10px] font-mono uppercase tracking-wider font-semibold">
                Área de Curadoria
              </span>
            </div>
            <h1 className="text-3xl font-serif italic text-white flex items-center gap-3 mt-1">
              <ShieldCheck className="w-8 h-8 text-white/80" />
              <span>Painel de Moderação</span>
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Guardião do repositório livre. Garanta a qualidade e a segurança do conhecimento compartilhado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0d0d0d] border border-white/10 rounded-xl text-xs text-center font-mono">
              <span className="text-white/40 block uppercase text-[10px] tracking-wider">Pendentes de Revisão</span>
              <span className="text-lg font-bold text-amber-300">{pendingSubmissions.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 text-xs font-mono uppercase tracking-wider overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'submissions' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Fila de Aprovação ({pendingSubmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'courses' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Todos os Cursos ({publishedCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'reports' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Denúncias & Relatórios ({pendingReports.length})</span>
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS QUEUE */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {pendingSubmissions.length > 0 ? (
              pendingSubmissions.map(submission => (
                <div key={submission.id} className="p-6 bg-[#0d0d0d] border border-white/10 rounded-2xl space-y-6 shadow-2xl">
                  
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                      <img src={submission.coverUrl} alt={submission.title} className="w-20 h-14 object-cover rounded-xl border border-white/10" />
                      <div>
                        <span className="px-2 py-0.5 bg-amber-400/10 text-amber-300 text-[9px] font-mono uppercase tracking-wider font-bold rounded border border-amber-400/20">
                          Enviado para Análise
                        </span>
                        <h3 className="text-lg font-serif italic text-white mt-1">{submission.title}</h3>
                        <p className="text-xs text-white/50 font-mono">
                          Professor: <strong className="text-white">{submission.teacherName}</strong> • {submission.durationMinutes} min • {submission.modules?.length || 0} módulos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto font-mono text-xs">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprovar e Publicar</span>
                      </button>

                      <button
                        onClick={() => setRejectingCourseId(submission.id)}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  </div>

                  {/* Submission Details Preview */}
                  <div className="space-y-3 text-xs text-white/80 font-sans">
                    <p className="font-mono uppercase text-[10px] tracking-wider text-white/50">Descrição enviada pelo criador:</p>
                    <div className="p-3 bg-[#050505] rounded-xl border border-white/10 leading-relaxed text-white/70">
                      {submission.description}
                    </div>

                    <p className="font-mono uppercase text-[10px] tracking-wider text-white/50 pt-2">Módulos & Fontes de Vídeo:</p>
                    <div className="space-y-2">
                      {submission.modules?.map((m, idx) => (
                        <div key={m.id} className="p-3 bg-[#050505] rounded-xl border border-white/10 flex items-center justify-between">
                          <span className="font-semibold text-white">Módulo {idx + 1}: {m.title}</span>
                          <span className="text-white/40 font-mono text-xs">{m.lessons.length} videoaulas</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reject Modal / Reason Box */}
                  {rejectingCourseId === submission.id && (
                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-3">
                      <p className="font-mono text-rose-300 text-xs">Informe o motivo dos ajustes ou da rejeição:</p>
                      <textarea
                        rows={2}
                        placeholder="Exemplo: O vídeo da aula 2 apresenta problemas de áudio / link quebrado."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/30 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2 font-mono text-xs">
                        <button
                          onClick={() => setRejectingCourseId(null)}
                          className="px-3 py-1.5 bg-[#050505] text-white/60 text-xs rounded-lg font-semibold border border-white/10"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleReject(submission.id)}
                          className="px-3 py-1.5 bg-rose-500 text-black text-xs font-bold rounded-lg"
                        >
                          Confirmar Rejeição
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className="p-12 bg-[#0d0d0d] border border-white/10 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-serif italic text-white text-lg">Nenhum curso pendente de revisão</h3>
                <p className="text-xs text-white/50">Todas as submissões enviadas por criadores foram processadas.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PUBLISHED COURSES MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {publishedCourses.map(course => (
              <div key={course.id} className="p-4 bg-[#0d0d0d] border border-white/10 rounded-xl flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={course.coverUrl} alt={course.title} className="w-12 h-10 object-cover rounded-lg border border-white/10" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{course.title}</h4>
                    <p className="text-white/50 font-mono mt-0.5">{course.teacherName} • {course.totalStudents} alunos</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => toggleFeatureCourse(course.id)}
                    className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center gap-1 ${
                      course.isFeatured
                        ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                        : 'bg-[#050505] text-white/50 border-white/10'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{course.isFeatured ? 'Em Destaque' : 'Destacar'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Remover este curso da plataforma?')) deleteCourse(course.id);
                    }}
                    className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.map(rep => (
              <div key={rep.id} className="p-4 bg-[#0d0d0d] border border-white/10 rounded-xl flex items-center justify-between gap-4 text-xs font-sans">
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded font-bold uppercase text-[9px]">
                      {rep.reason}
                    </span>
                    <span className="font-semibold text-white">{rep.targetTitle}</span>
                  </div>
                  <p className="text-white/60 mt-1">Denunciado por {rep.reporterName}: "{rep.details}"</p>
                </div>

                {rep.status === 'pending' ? (
                  <button
                    onClick={() => resolveReport(rep.id)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold rounded-lg text-xs"
                  >
                    Marcar Resolvido
                  </button>
                ) : (
                  <span className="text-white/40 font-mono font-bold">Resolvido</span>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
