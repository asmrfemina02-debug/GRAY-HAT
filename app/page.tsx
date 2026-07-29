'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import {
  Search,
  Sparkles,
  Flame,
  Trophy,
  Play,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShoppingBag,
  Code,
  Zap,
  Target,
  Users,
  ShieldCheck,
  Star,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { courses, categories, currentUser, userProgress, favorites } = useApp();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const publishedCourses = courses.filter(c => c.status === 'published');
  const featuredCourses = publishedCourses.filter(c => c.isFeatured);
  const trendingCourses = publishedCourses.filter(c => c.isTrending || c.rating >= 4.8);

  // Courses in progress for "Continue Assistindo"
  const inProgressCourses = publishedCourses.filter(c => {
    const courseLessons = c.modules?.flatMap(m => m.lessons) || [];
    return userProgress.some(p => p.courseId === c.id && courseLessons.some(l => l.id === p.lessonId));
  });

  // Favorite courses for "Minha Lista"
  const favoriteCourses = publishedCourses.filter(c => favorites.includes(c.id));

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/cursos?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-sky-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'Code': return <Code className="w-5 h-5 text-purple-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Target': return <Target className="w-5 h-5 text-rose-400" />;
      default: return <TrendingUp className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Main Navbar */}
      <Navbar />

      <main className="flex-1 space-y-16 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-[#050505] border-b border-white/10">
          
          {/* Subtle Monochrome Ambient Radial */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            
            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/70 text-[10px] font-mono tracking-[0.2em] uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>GRAY HAT • REPOSITÓRIO ABERTO DE CONHECIMENTO</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-serif italic text-white leading-tight font-medium">
              Tudo que os gurus ensinam sobre como{' '}
              <span className="not-italic font-sans font-bold text-white underline decoration-white/30 underline-offset-8">
                ganhar dinheiro no digital
              </span>.
            </h1>

            {/* Subheading / Positioning Statement */}
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-sans">
              Uma plataforma colaborativa e 100% gratuita. Aprenda Inteligência Artificial, TikTok Shop, Tráfego Pago, Automação, Programação e Copywriting sem pagar um único centavo.
            </p>

            {/* Search Input Box in Hero */}
            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto relative pt-4">
              <div className="relative flex items-center bg-[#0e0e0e] border border-white/15 focus-within:border-white/40 rounded-2xl p-1.5 shadow-2xl transition-all">
                <Search className="w-5 h-5 ml-3 text-white/40" />
                <input
                  type="text"
                  placeholder="O que você deseja aprender hoje? (ex: Gemini, n8n, Meta Ads, TikTok Shop)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-0 px-3 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-[#e5e5e5] text-black font-semibold text-xs uppercase tracking-wider font-mono rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0"
                >
                  <span>Explorar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Category Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono">
              <span className="text-white/40 uppercase text-[10px] tracking-widest">Tendências:</span>
              {categories.slice(0, 6).map(cat => (
                <Link
                  key={cat.id}
                  href={`/cursos?cat=${cat.id}`}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all text-[11px]"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Quick Value Stats */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs uppercase font-mono tracking-wider">100% Grátis</div>
                  <div className="text-white/40 text-[11px]">Sem paywall ou vip</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs uppercase font-mono tracking-wider">Moderação</div>
                  <div className="text-white/40 text-[11px]">Aprovação de admin</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-300">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs uppercase font-mono tracking-wider">Certificado</div>
                  <div className="text-white/40 text-[11px]">Ao concluir cursos</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-300">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white text-xs uppercase font-mono tracking-wider">Colaborativo</div>
                  <div className="text-white/40 text-[11px]">Comunidade aberta</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CONTINUE ASSISTINDO */}
        {inProgressCourses.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 text-white">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <h2 className="text-xl font-serif italic text-white tracking-tight">
                  Continue Assistindo
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inProgressCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* MINHA LISTA (Favorites) */}
        {favoriteCourses.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-amber-300 rounded-full" />
                <h2 className="text-xl font-serif italic text-white tracking-tight">
                  Minha Lista ({favoriteCourses.length})
                </h2>
              </div>
              <Link href="/cursos?favorite=true" className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 uppercase tracking-wider">
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* CATEGORIAS POPULARES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-2xl font-serif italic text-white tracking-tight">Categorias em Destaque</h2>
              <p className="text-xs text-white/50">Escolha um nicho e domine as principais habilidades digitais</p>
            </div>
            <Link href="/cursos" className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 uppercase tracking-wider">
              Ver todas ({categories.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map(cat => (
              <Link
                key={cat.id}
                href={`/cursos?cat=${cat.id}`}
                className="group p-4 bg-[#0d0d0d] hover:bg-[#121212] border border-white/10 hover:border-white/25 rounded-xl transition-all flex flex-col justify-between gap-3 shadow-md"
              >
                <div className="p-2.5 rounded-lg bg-[#050505] w-fit border border-white/10 group-hover:border-white/20 transition-colors">
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-white/80 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] font-mono text-white/40 mt-0.5">{cat.courseCount} CURSOS</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CURSOS EM DESTAQUE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h2 className="text-2xl font-serif italic text-white tracking-tight">Novos & Em Destaque</h2>
              </div>
              <p className="text-xs text-white/50">Conteúdos revisados e aprovados pela administração</p>
            </div>
            <Link href="/cursos" className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 uppercase tracking-wider">
              Ver catálogo completo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
              <p className="text-sm text-white/60">Nenhum curso publicado até o momento.</p>
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
