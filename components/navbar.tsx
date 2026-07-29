'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Search, Flame, Trophy, Bookmark, PlusCircle, Shield, Menu, X, Terminal, User as UserIcon, Sparkles } from 'lucide-react';

export function Navbar() {
  const { currentUser, favorites, courses } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingAdminCount = courses.filter(c => c.status === 'pending').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cursos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/cursos', label: 'Cursos' },
    { href: '/metodo', label: 'Os 3 Chapéus' },
    { href: '/cursos?favorite=true', label: 'Minha Lista', badge: favorites.length > 0 ? favorites.length : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white group-hover:border-white/30 transition-all shadow-md">
              <Terminal className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif italic tracking-tight text-white font-bold">GRAY <span className="font-sans font-extrabold not-italic text-white/90">HAT</span></span>
                <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-white/10 text-white/80 border border-white/15 rounded-full">100% Grátis</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 hidden sm:block font-mono">tudo que os gurus ensinam no digital</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-mono transition-colors flex items-center gap-1.5 ${
                    isActive ? 'bg-white/10 text-white border border-white/15' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.badge !== undefined && (
                    <span className="px-1.5 py-0.2 text-[9px] bg-white/20 text-white font-bold rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Pesquisar cursos, IA, TikTok Shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-sans"
          />
        </form>

        {/* Right Actions & Gamification Badge */}
        <div className="flex items-center gap-3">
          
          {/* Gamification Streak & XP */}
          <div className="hidden sm:flex items-center gap-2 bg-[#0d0d0d] border border-white/10 rounded-full px-3 py-1">
            <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold" title="Sequência diária de estudos">
              <Flame className="w-4 h-4 fill-amber-400/20 text-amber-300" />
              <span>{currentUser.streakDays}d</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1 text-white/80 text-xs font-semibold" title="XP Acumulado">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentUser.xp} XP</span>
            </div>
          </div>

          {/* Quick Role Links */}
          <Link
            href="/criador"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-white/80" />
            <span>Criar Curso</span>
          </Link>

          {currentUser.role === 'admin' && (
            <Link
              href="/admin"
              className="relative hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-purple-300" />
              <span>Admin</span>
              {pendingAdminCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center">
                  {pendingAdminCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile Link */}
          <Link href={`/perfil/${currentUser.id}`} className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white rounded-lg bg-[#0d0d0d] border border-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 p-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Pesquisar cursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30"
            />
          </form>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-white/80 hover:bg-white/5"
            >
              Início
            </Link>
            <Link
              href="/cursos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-white/80 hover:bg-white/5"
            >
              Todos os Cursos
            </Link>
            <Link
              href="/metodo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-white/80 hover:bg-white/5"
            >
              White, Gray e Black Hat
            </Link>
            <Link
              href="/cursos?favorite=true"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-white/80 hover:bg-white/5"
            >
              Minha Lista ({favorites.length})
            </Link>
            <Link
              href="/criador"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-white hover:bg-white/5 font-medium"
            >
              Painel do Criador (Publicar)
            </Link>
            {currentUser.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs text-purple-300 hover:bg-white/5 font-medium flex items-center justify-between"
              >
                <span>Painel Administrativo</span>
                {pendingAdminCount > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full font-bold">
                    {pendingAdminCount} pendente
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
