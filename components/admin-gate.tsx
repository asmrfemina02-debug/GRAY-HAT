'use client';

import { FormEvent, ReactNode, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { KeyRound, Loader2, LockKeyhole, LogOut, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';

function authErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/invalid-credential') return 'E-mail ou senha incorretos.';
    if (error.code === 'auth/too-many-requests') return 'Muitas tentativas. Aguarde e tente novamente.';
    if (error.code === 'auth/invalid-email') return 'Informe um e-mail válido.';
  }
  return 'Não foi possível entrar. Tente novamente.';
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, login, logout, refreshAdminAccess } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (loginError) {
      setError(authErrorMessage(loginError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0b] p-7 shadow-2xl">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10">
            <LockKeyhole className="h-5 w-5 text-purple-200" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-purple-200/60">
            Área restrita
          </p>
          <h1 className="mt-2 font-serif text-3xl italic">Painel administrativo</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/45">
            Entre com o usuário criado no Firebase Authentication.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-white/50">
                E-mail
              </span>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="username"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
                placeholder="admin@exemplo.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-white/50">
                Senha
              </span>
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
                minLength={6}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
                placeholder="Sua senha"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-xs text-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-black disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Entrar como administrador
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
        <section className="w-full max-w-lg rounded-3xl border border-rose-400/15 bg-[#0b0b0b] p-8 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-rose-300" />
          <h1 className="mt-5 font-serif text-3xl italic">Acesso não autorizado</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            O e-mail <strong className="text-white">{user.email}</strong> existe no Firebase
            Authentication, mas não está na lista de administradores.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => void refreshAdminAccess()}
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black"
            >
              Verificar novamente
            </button>
            <button
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white/70"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
