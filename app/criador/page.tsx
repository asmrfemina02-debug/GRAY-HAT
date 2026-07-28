'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Course, CourseLevel, Module, Lesson, VideoSourceType } from '@/lib/types';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoleSwitcherBanner } from '@/components/role-switcher-banner';
import {
  PlusCircle,
  Video,
  FileText,
  Save,
  Send,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Users,
  Star,
  Eye,
  Layers,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

export default function CreatorPanelPage() {
  const { courses, currentUser, createOrUpdateCourse, deleteCourse, categories } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'create' | 'comments' | 'profile'>('courses');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Course Builder Form State
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('cat-ia');
  const [level, setLevel] = useState<CourseLevel>('Iniciante');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&auto=format&fit=crop&q=80');
  const [tags, setTags] = useState('IA, Automação, Vendas');

  // Modules Builder State
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm-1',
      courseId: '',
      title: 'Módulo 1: Introdução Prática',
      order: 1,
      lessons: [
        {
          id: 'l-1',
          moduleId: 'm-1',
          title: 'Aula 1: Apresentação e Conceitos Fundamentais',
          description: 'Visão geral do conteúdo e objetivos de aprendizado.',
          durationMinutes: 15,
          order: 1,
          videoSourceType: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          textContent: 'Bem-vindo ao curso! Aqui você aprenderá passo a passo como aplicar estas ferramentas.'
        }
      ]
    }
  ]);

  const creatorCourses = courses.filter(c => c.teacherId === currentUser.id || currentUser.role === 'admin' || true); // View creator courses

  const publishedCourses = creatorCourses.filter(c => c.status === 'published');
  const pendingCourses = creatorCourses.filter(c => c.status === 'pending');
  const draftCourses = creatorCourses.filter(c => c.status === 'draft');
  const rejectedCourses = creatorCourses.filter(c => c.status === 'rejected');

  const filteredCourses = creatorCourses.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const handleAddModule = () => {
    const newMod: Module = {
      id: `m-${Date.now()}`,
      courseId: editingCourseId || '',
      title: `Módulo ${modules.length + 1}: Novo Módulo`,
      order: modules.length + 1,
      lessons: []
    };
    setModules([...modules, newMod]);
  };

  const handleAddLesson = (modId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === modId) {
        const newLes: Lesson = {
          id: `l-${Date.now()}`,
          moduleId: modId,
          title: `Nova Aula ${m.lessons.length + 1}`,
          description: 'Descrição rápida da aula.',
          durationMinutes: 10,
          order: m.lessons.length + 1,
          videoSourceType: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        };
        return { ...m, lessons: [...m.lessons, newLes] };
      }
      return m;
    }));
  };

  const handleLessonChange = (modId: string, lesId: string, field: keyof Lesson, value: any) => {
    setModules(prev => prev.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lesId ? { ...l, [field]: value } : l)
        };
      }
      return m;
    }));
  };

  const handleSaveCourse = (submitForReview: boolean) => {
    if (!title.trim()) {
      alert('Por favor, informe o título do curso.');
      return;
    }

    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    const created = createOrUpdateCourse({
      id: editingCourseId || undefined,
      title,
      shortDescription,
      description,
      categoryId,
      level,
      coverUrl,
      bannerUrl,
      tags: tagArray,
      modules
    }, submitForReview);

    alert(submitForReview ? 'Curso enviado com sucesso para revisão do administrador!' : 'Rascunho salvo com sucesso!');
    setActiveTab('courses');
    setEditingCourseId(null);
  };

  const startEdit = (course: Course) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setShortDescription(course.shortDescription);
    setDescription(course.description);
    setCategoryId(course.categoryId);
    setLevel(course.level);
    setCoverUrl(course.coverUrl);
    setBannerUrl(course.bannerUrl);
    setTags(course.tags.join(', '));
    setModules(course.modules && course.modules.length > 0 ? course.modules : modules);
    setActiveTab('create');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans">
      <RoleSwitcherBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif italic text-white flex items-center gap-3">
              <Video className="w-7 h-7 text-white/80" />
              <span>Estúdio do Criador</span>
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Crie cursos gratuitos, gerencie seus módulos e envie conteúdos para revisão aberta.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingCourseId(null);
              setTitle('');
              setShortDescription('');
              setDescription('');
              setActiveTab('create');
            }}
            className="px-4 py-2.5 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Novo Curso</span>
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 text-xs font-mono uppercase tracking-wider overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'courses' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            Meus Cursos ({creatorCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'create' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10'
            }`}
          >
            {editingCourseId ? 'Editar Curso' : 'Criar Curso'}
          </button>
        </div>

        {/* TAB 1: MEUS CURSOS LIST */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            {/* Status Filters */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg border font-semibold ${
                  filterStatus === 'all' ? 'bg-white text-black border-white' : 'bg-[#0c0c0c] border-white/10 text-white/60'
                }`}
              >
                Todos ({creatorCourses.length})
              </button>
              <button
                onClick={() => setFilterStatus('published')}
                className={`px-3 py-1.5 rounded-lg border font-semibold ${
                  filterStatus === 'published' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-[#0c0c0c] border-white/10 text-white/60'
                }`}
              >
                Publicados ({publishedCourses.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-lg border font-semibold ${
                  filterStatus === 'pending' ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'bg-[#0c0c0c] border-white/10 text-white/60'
                }`}
              >
                Em Análise ({pendingCourses.length})
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-3 py-1.5 rounded-lg border font-semibold ${
                  filterStatus === 'draft' ? 'bg-[#050505] border-white/20 text-white' : 'bg-[#0c0c0c] border-white/10 text-white/60'
                }`}
              >
                Rascunhos ({draftCourses.length})
              </button>
            </div>

            {/* Courses Table / List */}
            <div className="space-y-4">
              {filteredCourses.map(course => (
                <div key={course.id} className="p-4 bg-[#0d0d0d] border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={course.coverUrl} alt={course.title} className="w-16 h-12 object-cover rounded-xl border border-white/10 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-white">{course.title}</h3>
                        {course.status === 'published' && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-wider font-bold rounded">
                            Publicado
                          </span>
                        )}
                        {course.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[9px] font-mono uppercase tracking-wider font-bold rounded">
                            Em Análise
                          </span>
                        )}
                        {course.status === 'draft' && (
                          <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[9px] font-mono uppercase tracking-wider font-bold rounded">
                            Rascunho
                          </span>
                        )}
                        {course.status === 'rejected' && (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[9px] font-mono uppercase tracking-wider font-bold rounded">
                            Ajustes Solicitados
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 font-mono mt-0.5">{course.totalStudents} alunos • {course.rating || '5.0'}★ • {course.durationMinutes} min</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-xs">
                    {course.status === 'published' && (
                      <Link
                        href={`/curso/${course.id}`}
                        className="px-3 py-1.5 bg-[#050505] hover:bg-white/10 border border-white/10 text-white/80 rounded-lg font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </Link>
                    )}

                    <button
                      onClick={() => startEdit(course)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este curso?')) {
                          deleteCourse(course.id);
                        }
                      }}
                      className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: COURSE BUILDER FORM */}
        {activeTab === 'create' && (
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-serif italic text-white">
                {editingCourseId ? 'Editar Curso' : 'Criar Novo Curso'}
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Preencha os detalhes e adicione suas videoaulas (suporta YouTube, Google Drive, Vimeo, Cloudflare Stream e Bunny Stream).
              </p>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-mono uppercase text-[10px] tracking-wider text-white/60">Título do Curso *</label>
                <input
                  type="text"
                  placeholder="ex: Inteligência Artificial na Prática: Automação de Anúncios"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="font-mono uppercase text-[10px] tracking-wider text-white/60">Descrição Curta *</label>
                <input
                  type="text"
                  placeholder="Resumo de 1 frase chamativo sobre o que o aluno vai aprender..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="font-mono uppercase text-[10px] tracking-wider text-white/60">Descrição Detalhada *</label>
                <textarea
                  rows={4}
                  placeholder="Explique os tópicos detalhados, pré-requisitos e metodologia..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase text-[10px] tracking-wider text-white/60">Categoria *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 font-mono"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase text-[10px] tracking-wider text-white/60">Nível *</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 font-mono"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase text-[10px] tracking-wider text-white/60">URL da Capa</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono uppercase text-[10px] tracking-wider text-white/60">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                />
              </div>

            </div>

            {/* MODULES & LESSONS BUILDER */}
            <div className="space-y-6 pt-6 border-t border-white/10 font-sans">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif italic text-white">Módulos & Aulas</h3>
                  <p className="text-xs text-white/50">Monte a estrutura curricular do curso.</p>
                </div>

                <button
                  onClick={handleAddModule}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Adicionar Módulo</span>
                </button>
              </div>

              <div className="space-y-6">
                {modules.map((mod, modIdx) => (
                  <div key={mod.id} className="p-4 bg-[#050505] border border-white/10 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white text-xs">Mód {modIdx + 1}</span>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setModules(prev => prev.map(m => m.id === mod.id ? { ...m, title: val } : m));
                        }}
                        className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30 font-semibold"
                      />
                      <button
                        onClick={() => handleAddLesson(mod.id)}
                        className="px-2.5 py-1 bg-white text-black rounded-lg text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Aula</span>
                      </button>
                    </div>

                    {/* Lessons inside Module */}
                    <div className="space-y-3 pl-4 border-l-2 border-white/10">
                      {mod.lessons.map((les, lesIdx) => (
                        <div key={les.id} className="p-3 bg-[#0d0d0d] border border-white/10 rounded-lg space-y-3 text-xs font-sans">
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 font-mono">#{lesIdx + 1}</span>
                            <input
                              type="text"
                              placeholder="Título da Aula"
                              value={les.title}
                              onChange={(e) => handleLessonChange(mod.id, les.id, 'title', e.target.value)}
                              className="flex-1 bg-[#050505] border border-white/10 rounded px-2.5 py-1 text-white font-medium"
                            />
                            <input
                              type="number"
                              placeholder="Minutos"
                              value={les.durationMinutes}
                              onChange={(e) => handleLessonChange(mod.id, les.id, 'durationMinutes', Number(e.target.value))}
                              className="w-20 bg-[#050505] border border-white/10 rounded px-2.5 py-1 text-white font-mono"
                            />
                          </div>

                          {/* Video Source Selector */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <select
                              value={les.videoSourceType}
                              onChange={(e) => handleLessonChange(mod.id, les.id, 'videoSourceType', e.target.value as VideoSourceType)}
                              className="bg-[#050505] border border-white/10 rounded px-2.5 py-1 text-white/80 font-mono"
                            >
                              <option value="youtube">YouTube (Link)</option>
                              <option value="gdrive">Google Drive (Link)</option>
                              <option value="vimeo">Vimeo (Link)</option>
                              <option value="cloudflare">Cloudflare Stream</option>
                              <option value="bunny">Bunny Stream</option>
                              <option value="upload">Upload / Direct MP4</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Cole o link compartilhado da aula..."
                              value={les.videoUrl}
                              onChange={(e) => handleLessonChange(mod.id, les.id, 'videoUrl', e.target.value)}
                              className="sm:col-span-2 bg-[#050505] border border-white/10 rounded px-2.5 py-1 text-white font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Save Draft or Submit to Admin */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-end gap-3 font-mono">
              <button
                type="button"
                onClick={() => handleSaveCourse(false)}
                className="px-4 py-2.5 bg-[#050505] hover:bg-white/10 text-white border border-white/10 text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Rascunho</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveCourse(true)}
                className="px-6 py-2.5 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Enviar para Análise</span>
              </button>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
