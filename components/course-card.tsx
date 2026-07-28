'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/lib/types';
import { useApp } from '@/lib/store';
import { Star, Users, Clock, Bookmark, Play, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  compact?: boolean;
}

export function CourseCard({ course, compact = false }: CourseCardProps) {
  const { favorites, toggleFavorite, userProgress } = useApp();

  const isFavorite = favorites.includes(course.id);

  // Compute progress for this course
  const courseLessons = course.modules?.flatMap(m => m.lessons) || [];
  const completedLessons = courseLessons.filter(l =>
    userProgress.some(p => p.courseId === course.id && p.lessonId === l.id && p.completed)
  ).length;

  const totalLessonsCount = course.totalLessons || courseLessons.length || 1;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessons / totalLessonsCount) * 100) : 0;

  return (
    <div className="group relative bg-[#0d0d0d] border border-white/10 hover:border-white/25 rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-black/80">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#050505]">
        <img
          src={course.coverUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-transparent opacity-90" />

        {/* Level Badge */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase bg-black/80 text-white/80 border border-white/15 backdrop-blur-md">
          {course.level}
        </div>

        {/* Favorite Bookmark Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(course.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border transition-all ${
            isFavorite
              ? 'bg-amber-400 text-black border-amber-300 shadow-md scale-105'
              : 'bg-black/80 text-white/60 border-white/15 hover:text-white hover:bg-black'
          }`}
          title={isFavorite ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-black' : ''}`} />
        </button>

        {/* Hover Play Button */}
        <Link
          href={`/curso/${course.id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]"
        >
          <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform">
            <Play className="w-4 h-4 fill-black ml-0.5" />
          </div>
        </Link>

        {/* Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white/70 text-[10px] font-mono flex items-center gap-1 border border-white/10">
          <Clock className="w-3 h-3 text-white/50" />
          <span>{course.durationMinutes} min</span>
        </div>
      </div>

      {/* Progress Bar */}
      {progressPercent > 0 && (
        <div className="w-full bg-white/5 h-1 relative overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Content Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">
              {course.categoryId.replace('cat-', '').toUpperCase()}
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{course.rating || '5.0'}</span>
              <span className="text-white/30 text-[10px] font-normal">({course.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/curso/${course.id}`}>
            <h3 className="font-serif italic font-medium text-white text-base group-hover:text-white/80 transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </Link>

          {!compact && (
            <p className="text-white/50 text-xs mt-1.5 line-clamp-2 leading-relaxed font-sans">
              {course.shortDescription}
            </p>
          )}
        </div>

        {/* Footer Meta: Instructor & Students */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-sans">
          <div className="flex items-center gap-2">
            <img
              src={course.teacherAvatar}
              alt={course.teacherName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="truncate max-w-[120px] text-white/70 text-xs">{course.teacherName}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-white/40">
            <Users className="w-3 h-3 text-white/30" />
            <span>{course.totalStudents.toLocaleString('pt-BR')}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
