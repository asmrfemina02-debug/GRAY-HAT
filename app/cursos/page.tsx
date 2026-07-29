'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { Search, Filter, SlidersHorizontal, Bookmark, X, BookOpen } from 'lucide-react';

function CatalogContent() {
  const { courses, categories, favorites } = useApp();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('cat') || 'all';
  const initialFavoriteOnly = searchParams.get('favorite') === 'true';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(initialFavoriteOnly);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const publishedCourses = courses.filter(c => c.status === 'published');

  const filteredCourses = useMemo(() => {
    return publishedCourses.filter(course => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesTeacher = course.teacherName.toLowerCase().includes(q);
        const matchesTags = course.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTeacher && !matchesTags) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && course.categoryId !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(course.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.totalStudents - a.totalStudents; // default popular
    });
  }, [publishedCourses, searchQuery, selectedCategory, selectedLevel, showFavoritesOnly, favorites, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setShowFavoritesOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif italic text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-white/80" />
            <span>Repositório de Cursos</span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Explore o acervo aberto de conhecimento gratuito. Todos os materiais são de acesso livre.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por palavra-chave, tema ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          
          {/* Categories Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none flex-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#050505] text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              Todas as Categorias
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#050505] text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Level Filter & Sort */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Level Select */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:border-white/30 font-mono"
            >
              <option value="all">Todos os Níveis</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#050505] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:border-white/30 font-mono"
            >
              <option value="popular">Mais Populares</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="newest">Mais Recentes</option>
            </select>

            {/* Favorites Toggle Button */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                showFavoritesOnly
                  ? 'bg-amber-400 text-black border-amber-300 font-bold'
                  : 'bg-[#050505] text-white/60 border-white/10 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-black' : ''}`} />
              <span>Minha Lista</span>
            </button>

          </div>
        </div>

        {/* Active Filters Bar */}
        {(selectedCategory !== 'all' || selectedLevel !== 'all' || showFavoritesOnly || searchQuery) && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
            <span className="text-white/40">
              Exibindo <strong className="text-white">{filteredCourses.length}</strong> de {publishedCourses.length} cursos
            </span>
            <button
              onClick={clearFilters}
              className="text-white/70 hover:text-white flex items-center gap-1 font-medium underline"
            >
              <X className="w-3.5 h-3.5" />
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto my-12">
          <BookOpen className="w-10 h-10 text-white/20 mx-auto" />
          <h3 className="text-lg font-serif italic text-white">Nenhum curso encontrado</h3>
          <p className="text-xs text-white/50 font-sans">
            Não foram encontrados cursos que correspondam aos critérios de busca selecionados.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition-all"
          >
            Limpar Filtros
          </button>
        </div>
      )}

    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-white/40 font-mono text-xs uppercase tracking-widest">Carregando catálogo...</div>}>
          <CatalogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
