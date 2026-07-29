'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/store';
import { Lesson } from '@/lib/types';
import { Navbar } from '@/components/navbar';
import { VideoPlayer } from '@/components/video-player';
import { CertificateModal } from '@/components/certificate-modal';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Award,
  Bot,
  Send,
  HelpCircle,
  ThumbsUp,
  Clock,
  Play,
  Share2
} from 'lucide-react';

export default function LessonPlayerPage({
  params
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = use(params);
  const { courses, userProgress, markLessonComplete, comments, addComment, likeComment, currentUser } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'quiz' | 'comments' | 'ai'>('notes');
  const [showCertModal, setShowCertModal] = useState(false);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Comment input
  const [newCommentText, setNewCommentText] = useState('');

  // AI Tutor & Summary states
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorAnswer, setTutorAnswer] = useState<string | null>(null);
  const [loadingTutor, setLoadingTutor] = useState(false);

  const course = courses.find(c => c.id === courseId);
  const allLessons: Lesson[] = course?.modules?.flatMap(m => m.lessons) || [];
  const currentLesson = allLessons.find(l => l.id === lessonId);

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Aula Não Encontrada</h2>
          <Link href={`/curso/${courseId}`} className="px-4 py-2 bg-sky-500 text-slate-950 font-bold rounded-xl text-xs">
            Voltar ao Curso
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = userProgress.some(p => p.courseId === course.id && p.lessonId === currentLesson.id && p.completed);

  // Find prev/next lesson index
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Completion calculation
  const completedLessonsCount = allLessons.filter(l =>
    userProgress.some(p => p.courseId === course.id && p.lessonId === l.id && p.completed)
  ).length;
  const isCourseFullyCompleted = completedLessonsCount === allLessons.length;

  const handleMarkComplete = () => {
    markLessonComplete(course.id, currentLesson.id);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#10b981', '#fbbf24']
    });

    // Check if course is now fully completed
    if (completedLessonsCount + 1 >= allLessons.length) {
      setShowCertModal(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      addComment(currentLesson.id, course.id, newCommentText.trim());
      setNewCommentText('');
    }
  };

  const lessonComments = comments.filter(c => c.lessonId === currentLesson.id && c.status === 'approved');

  // AI Summary Handler
  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentLesson.title,
          description: currentLesson.description,
          textContent: currentLesson.textContent
        })
      });
      const data = await res.json();
      setAiSummary(data.summary || 'Resumo gerado.');
    } catch (e) {
      setAiSummary('Não foi possível gerar o resumo automático.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // AI Tutor Handler
  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;

    setLoadingTutor(true);
    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: currentLesson.title,
          question: tutorQuestion.trim(),
          context: currentLesson.description + ' ' + (currentLesson.textContent || '')
        })
      });
      const data = await res.json();
      setTutorAnswer(data.answer);
    } catch (e) {
      setTutorAnswer('Ocorreu uma falha ao consultar o Tutor IA.');
    } finally {
      setLoadingTutor(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans">

      {/* TOP COMPACT NAVIGATION HEADER */}
      <header className="bg-[#0c0c0c] border-b border-white/10 px-4 py-3 sticky top-0 z-30 flex items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3">
          <Link
            href={`/curso/${course.id}`}
            className="p-1.5 rounded-lg bg-[#050505] text-white/60 hover:text-white border border-white/10 transition-colors flex items-center gap-1 text-xs font-mono"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar para o Curso</span>
          </Link>
          <div className="border-l border-white/10 h-5 hidden sm:block" />
          <h1 className="text-xs sm:text-sm font-semibold text-white truncate max-w-md">
            {currentLesson.title}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono">
          
          <button
            onClick={handleMarkComplete}
            className={`px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              isCompleted
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'bg-white hover:bg-[#e5e5e5] text-black font-bold'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Concluída' : 'Concluir Aula'}</span>
          </button>

          {isCourseFullyCompleted && (
            <button
              onClick={() => setShowCertModal(true)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-1 shadow-md"
            >
              <Award className="w-4 h-4" />
              <span className="hidden md:inline">Certificado</span>
            </button>
          )}

          {prevLesson && (
            <Link
              href={`/curso/${course.id}/aula/${prevLesson.id}`}
              className="p-2 bg-[#050505] hover:bg-white/10 border border-white/10 rounded-xl text-white/70"
              title="Aula Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          {nextLesson && (
            <Link
              href={`/curso/${course.id}/aula/${nextLesson.id}`}
              className="p-2 bg-[#050505] hover:bg-white/10 border border-white/10 rounded-xl text-white/70"
              title="Próxima Aula"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}

        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PLAYER & TABS (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Universal Video Player */}
          <VideoPlayer
            videoUrl={currentLesson.videoUrl}
            sourceType={currentLesson.videoSourceType}
            title={currentLesson.title}
            onEnded={handleMarkComplete}
          />

          {/* Interactive Lesson Tabs Navigation */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 text-xs font-mono uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'notes' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Conteúdo Teórico</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'resources' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Recursos ({currentLesson.resources?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'quiz' ? 'bg-amber-400 text-black font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz & Exercícios</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'comments' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comentários ({lessonComments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'ai' ? 'bg-white text-black font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Tutor IA (Gemini)</span>
              </button>
            </div>

            {/* TAB 1: NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-3 text-xs text-white/70 leading-relaxed font-sans">
                <h3 className="font-serif italic text-base text-white">{currentLesson.title}</h3>
                <p className="text-white/50">{currentLesson.description}</p>
                {currentLesson.textContent && (
                  <div className="p-4 bg-[#050505] border border-white/10 rounded-xl space-y-2 whitespace-pre-line text-white/80">
                    {currentLesson.textContent}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RESOURCES */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                {currentLesson.resources && currentLesson.resources.length > 0 ? (
                  currentLesson.resources.map(res => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#050505] border border-white/10 hover:border-white/30 rounded-xl flex items-center justify-between text-xs transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10 text-white">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:underline">{res.title}</p>
                          <p className="text-[10px] font-mono text-white/40 uppercase">{res.type} {res.size ? `• ${res.size}` : ''}</p>
                        </div>
                      </div>

                      <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white" />
                    </a>
                  ))
                ) : (
                  <p className="text-xs font-mono text-white/40">Nenhum arquivo complementar para esta aula.</p>
                )}
              </div>
            )}

            {/* TAB 3: QUIZ & EXERCISES */}
            {activeTab === 'quiz' && (
              <div className="space-y-4">
                {currentLesson.quiz && currentLesson.quiz.length > 0 ? (
                  currentLesson.quiz.map((q, qIdx) => {
                    const selected = selectedQuizAnswers[q.id];
                    const isSubmitted = quizSubmitted[q.id];
                    const isCorrect = selected === q.correctAnswerIndex;

                    return (
                      <div key={q.id} className="p-4 bg-[#050505] border border-white/10 rounded-xl space-y-3 text-xs">
                        <p className="font-semibold text-sm text-white">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => setSelectedQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className={`w-full p-2.5 rounded-lg border text-left transition-all font-medium ${
                                selected === optIdx
                                  ? 'bg-white text-black border-white font-bold'
                                  : 'bg-[#0c0c0c] border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {selected !== undefined && !isSubmitted && (
                          <button
                            onClick={() => setQuizSubmitted(prev => ({ ...prev, [q.id]: true }))}
                            className="px-3 py-1.5 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-lg"
                          >
                            Verificar Resposta
                          </button>
                        )}

                        {isSubmitted && (
                          <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                            isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          }`}>
                            <p className="font-mono uppercase tracking-wider font-bold">
                              {isCorrect ? '✓ Resposta Correta!' : '✗ Resposta Incorreta.'}
                            </p>
                            {q.explanation && <p className="text-[11px] text-white/70">{q.explanation}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs font-mono text-white/40">Esta aula não contém questionários específicos.</p>
                )}
              </div>
            )}

            {/* TAB 4: COMMENTS */}
            {activeTab === 'comments' && (
              <div className="space-y-4 font-sans">
                <form onSubmit={handleCommentSubmit} className="space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Deixe sua dúvida ou contribuição sobre esta aula..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Comentar</span>
                  </button>
                </form>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  {lessonComments.length > 0 ? (
                    lessonComments.map(c => (
                      <div key={c.id} className="p-3 bg-[#050505] border border-white/10 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20" />
                            <span className="font-semibold text-white">{c.userName}</span>
                          </div>
                          <button
                            onClick={() => likeComment(c.id)}
                            className="flex items-center gap-1 text-white/40 hover:text-white text-[11px] font-mono"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{c.likes}</span>
                          </button>
                        </div>
                        <p className="text-white/70 pl-8">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-mono text-white/40">Nenhum comentário publicado nesta aula.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: AI TUTOR (GEMINI) */}
            {activeTab === 'ai' && (
              <div className="space-y-4 text-xs font-sans">
                
                {/* Instant Summary Generator */}
                <div className="p-4 bg-[#050505] border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-white">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Resumo Inteligente da Aula</span>
                    </div>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={loadingSummary}
                      className="px-3 py-1 bg-white text-black font-mono text-[10px] uppercase tracking-wider font-semibold rounded-lg disabled:opacity-50"
                    >
                      {loadingSummary ? 'Gerando...' : 'Gerar Resumo Gemini'}
                    </button>
                  </div>

                  {aiSummary && (
                    <div className="p-3 bg-[#0c0c0c] rounded-lg border border-white/10 text-white/80 whitespace-pre-line leading-relaxed">
                      {aiSummary}
                    </div>
                  )}
                </div>

                {/* Tutor Question Form */}
                <form onSubmit={handleAskTutor} className="p-4 bg-[#050505] border border-white/10 rounded-xl space-y-3">
                  <p className="font-mono uppercase tracking-wider text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-white/70" />
                    <span>Tirar Dúvida com Tutor IA</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Faça uma pergunta sobre esta aula especificamente..."
                      value={tutorQuestion}
                      onChange={(e) => setTutorQuestion(e.target.value)}
                      className="flex-1 bg-[#0c0c0c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                    <button
                      type="submit"
                      disabled={loadingTutor}
                      className="px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-lg shrink-0 disabled:opacity-50"
                    >
                      {loadingTutor ? 'Pensando...' : 'Perguntar'}
                    </button>
                  </div>

                  {tutorAnswer && (
                    <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-lg text-white/80 leading-relaxed whitespace-pre-line">
                      <strong className="text-white font-mono uppercase block mb-1">Resposta do Tutor IA:</strong>
                      {tutorAnswer}
                    </div>
                  )}
                </form>

              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: MODULES PLAYLIST SIDEBAR */}
        <div className="space-y-4">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 space-y-3 shadow-xl">
            <h3 className="font-serif italic text-sm text-white flex items-center justify-between">
              <span>Conteúdo do Curso</span>
              <span className="text-xs font-mono text-white/50">{completedLessonsCount}/{allLessons.length} Aulas</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {course.modules?.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-1.5">
                  <Link href={`/curso/${course.id}`} className="relative h-20 rounded-xl overflow-hidden border border-white/10 block group">
                    <img
                      src={mod.coverUrl || course.coverUrl || '/curso-padrao.svg'}
                      alt={mod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
                    <div className="absolute inset-0 p-3 flex flex-col justify-end">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-300">Módulo {modIdx + 1}</span>
                      <p className="text-xs font-bold text-white line-clamp-2">{mod.title}</p>
                    </div>
                  </Link>
                  <div className="space-y-1">
                    {mod.lessons?.map((les) => {
                      const isCurrent = les.id === currentLesson.id;
                      const isLesCompleted = userProgress.some(p => p.courseId === course.id && p.lessonId === les.id && p.completed);

                      return (
                        <Link
                          key={les.id}
                          href={`/curso/${course.id}/aula/${les.id}`}
                          className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${
                            isCurrent
                              ? 'bg-white text-black font-bold'
                              : 'bg-[#050505] hover:bg-white/10 text-white/70 border border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {isLesCompleted ? (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-black' : 'text-emerald-400'}`} />
                            ) : (
                              <Play className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'fill-black text-black' : 'text-white/40'}`} />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className={`text-[10px] font-mono shrink-0 ${isCurrent ? 'text-black/60' : 'text-white/40'}`}>{les.durationMinutes}m</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Certificate Trigger Modal */}
      {showCertModal && (
        <CertificateModal
          course={course}
          user={currentUser}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
}
