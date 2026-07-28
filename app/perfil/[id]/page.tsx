'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoleSwitcherBanner } from '@/components/role-switcher-banner';
import { CourseCard } from '@/components/course-card';
import {
  Flame,
  Trophy,
  Award,
  Clock,
  CheckCircle2,
  Globe,
  Github,
  Youtube,
  Users,
  Star,
  Sparkles,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentUser, courses, userProgress } = useApp();

  const profileUser = currentUser; // Profile display

  const userCourses = courses.filter(c => c.teacherId === profileUser.id || c.status === 'published');
  const publishedCourses = userCourses.filter(c => c.status === 'published');

  // Completed courses count
  const completedCoursesCount = courses.filter(c => {
    const courseLessons = c.modules?.flatMap(m => m.lessons) || [];
    if (courseLessons.length === 0) return false;
    return courseLessons.every(l => userProgress.some(p => p.courseId === c.id && p.lessonId === l.id && p.completed));
  }).length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans">
      <RoleSwitcherBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
        
        {/* Profile Header Banner */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl pointer-events-none rounded-full" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-24 h-24 rounded-2xl object-cover ring-2 ring-white/20 shadow-2xl shrink-0"
            />

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif italic text-white">{profileUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white border border-white/15">
                  Nível {profileUser.level}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
                  {profileUser.role}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white/60 max-w-xl leading-relaxed">
                {profileUser.bio || 'Membro da comunidade Gray Hat.'}
              </p>

              {/* Social & Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-white/50">
                {profileUser.website && (
                  <a href={profileUser.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </a>
                )}
                {profileUser.githubUrl && (
                  <a href={profileUser.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {profileUser.youtubeUrl && (
                  <a href={profileUser.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                    <Youtube className="w-3.5 h-3.5" /> YouTube
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Gamification Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs font-mono">
            
            <div className="p-3 bg-[#050505] border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-400/10 text-amber-300">
                <Flame className="w-5 h-5 fill-amber-300/20" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">Sequência Diária</p>
                <p className="text-base font-bold text-white">{profileUser.streakDays} dias</p>
              </div>
            </div>

            <div className="p-3 bg-[#050505] border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-white">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">XP Acumulado</p>
                <p className="text-base font-bold text-white">{profileUser.xp} XP</p>
              </div>
            </div>

            <div className="p-3 bg-[#050505] border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">Cursos Concluídos</p>
                <p className="text-base font-bold text-white">{completedCoursesCount}</p>
              </div>
            </div>

            <div className="p-3 bg-[#050505] border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-white">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">Horas Estudadas</p>
                <p className="text-base font-bold text-white">{profileUser.totalHoursStudied} hrs</p>
              </div>
            </div>

          </div>

        </div>

        {/* MEDALS / BADGES SECTION */}
        <section className="space-y-4 font-sans">
          <h2 className="text-xl font-serif italic text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-300" />
            <span>Medalhas Conquistadas ({profileUser.medals.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profileUser.medals.map(medal => (
              <div key={medal.id} className="p-4 bg-[#0d0d0d] border border-white/10 rounded-xl flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">{medal.title}</h4>
                  <p className="text-xs text-white/50 mt-0.5">{medal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COURSES CREATED OR ENROLLED */}
        <section className="space-y-4 font-sans">
          <h2 className="text-xl font-serif italic text-white">
            Cursos Recomendados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCourses.slice(0, 3).map(c => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
