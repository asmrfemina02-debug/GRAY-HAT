'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { Lesson } from '@/lib/types';
import {
  Play,
  Star,
  Users,
  Clock,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
  Award,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Send
} from 'lucide-react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { courses, favorites, toggleFavorite, userProgress, reviews, addReview, currentUser } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'modules' | 'about' | 'reviews'>('modules');
  const [openModuleIds, setOpenModuleIds] = useState<string[]>(['mod-1', 'mod-2', 'mod-tt-1', 'mod-tr-1', 'mod-p1']);

  // New Review form state
  const [newRating, setNewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Curso Não Encontrado</h2>
          <p className="text-sm text-slate-400">O curso solicitado não existe ou foi removido.</p>
          <Link href="/cursos" className="px-4 py-2 bg-sky-500 text-slate-950 font-bold rounded-xl text-xs">
            Voltar ao Catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFavorite = favorites.includes(course.id);

  // Compute completed lessons
  const allLessons: Lesson[] = course.modules?.flatMap(m => m.lessons) || [];
  const completedLessonsCount = allLessons.filter(l =>
    userProgress.some(p => p.courseId === course.id && p.lessonId === l.id && p.completed)
  ).length;

  const firstLesson: Lesson | undefined = allLessons[0];
  const nextUncompletedLesson: Lesson | undefined = allLessons.find(l =>
    !userProgress.some(p => p.courseId === course.id && p.lessonId === l.id && p.completed)
  );
  const targetLessonId = nextUncompletedLesson?.id || firstLesson?.id || 'l1';

  const toggleModule = (modId: string) => {
    setOpenModuleIds(prev =>
      prev.includes(modId) ? prev.filter(m => m !== modId) : [...prev, modId]
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewComment.trim()) {
      addReview(course.id, newRating, newReviewComment.trim());
      setNewReviewComment('');
    }
  };

  const courseReviews = reviews.filter(r => r.courseId === course.id);

  const relatedCourses = courses
    .filter(c => c.id !== course.id && c.categoryId === course.categoryId && c.status === 'published')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 space-y-8 pb-16">
        
        {/* COURSE BANNER & HEADER */}
        <section className="relative bg-[#0c0c0c] border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-center bg-cover blur-2xl" style={{ backgroundImage: `url(${course.bannerUrl || course.coverUrl})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15 uppercase tracking-wider text-[10px]">
                  {course.categoryId.replace('cat-', '')}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#050505] text-white/70 border border-white/10 text-[10px] uppercase tracking-wider">
                  {course.level}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] uppercase tracking-wider font-semibold">
                  100% Gratuito
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif italic text-white leading-tight tracking-tight font-medium">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl font-sans">
                {course.shortDescription}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-white/60 pt-2 border-t border-white/10 font-sans">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span className="text-sm">{course.reviewCount > 0 ? course.rating : 'Sem avaliações'}</span>
                  <span className="text-white/40 text-xs font-normal">({course.reviewCount} avaliações)</span>
                </div>

                <div className="flex items-center gap-1.5 text-white/70">
                  <Users className="w-4 h-4 text-white/40" />
                  <span>{course.totalStudents.toLocaleString('pt-BR')} alunos</span>
                </div>

                <div className="flex items-center gap-1.5 text-white/70">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span>{course.durationMinutes} minutos de duração</span>
                </div>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={course.teacherAvatar}
                  alt={course.teacherName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
                />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Professor / Criador</p>
                  <p className="text-sm font-semibold text-white">{course.teacherName}</p>
                </div>
              </div>
            </div>

            {/* Right Card / CTA Box */}
            <div className="bg-[#0e0e0e] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group">
                <img src={course.coverUrl} alt={course.title} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              {completedLessonsCount > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/50 font-mono">
                    <span>PROGRESSO</span>
                    <span className="text-white font-bold">{Math.round((completedLessonsCount / (allLessons.length || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full transition-all"
                      style={{ width: `${Math.round((completedLessonsCount / (allLessons.length || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Start/Continue Button */}
              {nextUncompletedLesson && completedLessonsCount < allLessons.length ? (
                <Link
                  href={`/curso/${course.id}/aula/${nextUncompletedLesson.id}`}
                  className="w-full py-3 bg-white hover:bg-[#e5e5e5] text-black font-mono uppercase text-xs tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>{completedLessonsCount > 0 ? 'Continuar Assistindo' : 'Iniciar Curso Agora'}</span>
                </Link>
              ) : (
                <Link
                  href={`/curso/${course.id}/aula/${targetLessonId}`}
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-mono uppercase text-xs tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Revisar Curso Concluído</span>
                </Link>
              )}

              {/* Favorite Bookmark Button */}
              <button
                onClick={() => toggleFavorite(course.id)}
                className={`w-full py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isFavorite
                    ? 'bg-amber-400 text-black border-amber-300 font-bold'
                    : 'bg-[#050505] text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-black' : ''}`} />
                <span>{isFavorite ? 'Salvo na Minha Lista' : 'Adicionar à Minha Lista'}</span>
              </button>
            </div>

          </div>
        </section>

        {/* TABS & DETAILS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-white/10 text-xs font-mono uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('modules')}
              className={`pb-3 px-4 border-b-2 transition-all ${
                activeTab === 'modules'
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Módulos & Aulas ({allLessons.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-4 border-b-2 transition-all ${
                activeTab === 'about'
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-4 border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Avaliações ({courseReviews.length})
            </button>
          </div>

          {/* TAB 1: MODULES ACCORDION */}
          {activeTab === 'modules' && (
            <div className="space-y-4">
              {course.modules && course.modules.length > 0 ? (
                course.modules.map((module, modIdx) => {
                  const isOpen = openModuleIds.includes(module.id);
                  return (
                    <div key={module.id} className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold text-base text-white">
                            {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-xs text-white/50 mt-0.5">{module.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 font-mono text-xs">
                          <span className="text-white/40">{module.lessons?.length || 0} AULAS</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-white/10 divide-y divide-white/5 bg-[#050505]">
                          {module.lessons?.map((lesson, lesIdx) => {
                            const isCompleted = userProgress.some(p => p.courseId === course.id && p.lessonId === lesson.id && p.completed);

                            return (
                              <Link
                                key={lesson.id}
                                href={`/curso/${course.id}/aula/${lesson.id}`}
                                className="p-3.5 px-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-white/50 font-mono group-hover:border-white group-hover:text-white">
                                      {lesIdx + 1}
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="font-medium text-sm text-white/90 group-hover:text-white transition-colors">
                                      {lesson.title}
                                    </h4>
                                    <p className="text-xs text-white/50 line-clamp-1">{lesson.description}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-white/50 shrink-0 font-mono">
                                  {lesson.isPreview && (
                                    <span className="px-2 py-0.5 bg-white/10 text-white border border-white/15 rounded text-[9px] uppercase tracking-wider font-semibold">
                                      Preview
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1 text-[10px]">
                                    <Clock className="w-3 h-3 text-white/40" />
                                    {lesson.durationMinutes} min
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs font-mono text-white/40">Nenhum módulo cadastrado ainda.</p>
              )}
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === 'about' && (
            <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-serif italic text-white mb-2">Sobre este curso</h3>
                <div className="text-sm text-white/70 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                  {course.description}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Tags & Palavras-chave</h4>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#050505] border border-white/10 text-white/70 rounded-lg text-xs font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 font-sans">
              
              {/* Submit Review Form */}
              <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-base font-serif italic text-white">Deixar uma Avaliação</h3>
                
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 font-mono uppercase">Nota:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-300 text-amber-300' : 'text-white/20'}`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Escreva sua opinião honesta sobre o curso..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Avaliação</span>
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {courseReviews.length > 0 ? (
                  courseReviews.map(rev => (
                    <div key={rev.id} className="p-4 bg-[#0d0d0d] border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20" />
                          <div>
                            <p className="text-xs font-semibold text-white">{rev.userName}</p>
                            <p className="text-[10px] font-mono text-white/40">{new Date(rev.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-300">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed pl-11">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-mono text-white/40">Seja o primeiro a avaliar este curso!</p>
                )}
              </div>

            </div>
          )}

        </section>

        {/* RELATED COURSES */}
        {relatedCourses.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4 border-t border-white/10">
            <h3 className="text-xl font-serif italic text-white">Cursos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map(rel => (
                <CourseCard key={rel.id} course={rel} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
