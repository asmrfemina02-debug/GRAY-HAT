'use client';

import { FormEvent, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { Loader2, MailPlus, ShieldCheck, Trash2 } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { useAdminAuth } from '@/lib/admin-auth';

interface AdminEmailRecord {
  email: string;
  addedBy: string;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function AdminEmailManager() {
  const { user } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminEmailRecord[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(Boolean(firestore));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!firestore) return;

    return onSnapshot(
      collection(firestore, 'adminEmails'),
      snapshot => {
        setAdmins(snapshot.docs.map(item => ({
          email: item.id,
          addedBy: String(item.data().addedBy || ''),
        })));
        setLoading(false);
      },
      () => {
        setMessage('Não foi possível carregar os administradores.');
        setLoading(false);
      }
    );
  }, []);

  const addAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !user?.email) return;

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setMessage('Informe um e-mail válido.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(firestore, 'adminEmails', normalizedEmail), {
        email: normalizedEmail,
        active: true,
        addedBy: user.email,
        addedAt: serverTimestamp(),
      });
      setEmail('');
      setMessage('Administrador adicionado.');
    } catch {
      setMessage('Não foi possível adicionar o administrador.');
    } finally {
      setSaving(false);
    }
  };

  const removeAdmin = async (adminEmail: string) => {
    if (!firestore || adminEmail === normalizeEmail(user?.email || '')) return;
    if (!confirm(`Remover o acesso administrativo de ${adminEmail}?`)) return;
    try {
      await deleteDoc(doc(firestore, 'adminEmails', adminEmail));
    } catch {
      setMessage('Não foi possível remover o administrador.');
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-300" />
            <h2 className="font-serif text-xl italic text-white">Administradores</h2>
          </div>
          <p className="mt-1 text-xs text-white/45">
            Somente estes e-mails podem acessar o painel e criar cursos.
          </p>
        </div>

        <form onSubmit={addAdmin} className="flex w-full max-w-lg flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            placeholder="novo-admin@exemplo.com"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailPlus className="h-4 w-4" />}
            Adicionar
          </button>
        </form>
      </div>

      {message && <p className="mt-3 text-xs text-white/55">{message}</p>}

      <div className="mt-5 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
        {loading ? (
          <div className="flex justify-center p-5"><Loader2 className="h-4 w-4 animate-spin text-white/40" /></div>
        ) : admins.length === 0 ? (
          <p className="p-5 text-xs text-white/40">Nenhum administrador cadastrado.</p>
        ) : admins.map(admin => {
          const isCurrentAdmin = admin.email === normalizeEmail(user?.email || '');
          return (
            <div key={admin.email} className="flex items-center justify-between gap-3 bg-black/20 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-white">{admin.email}</p>
                <p className="text-[10px] text-white/35">
                  {isCurrentAdmin ? 'Sua conta' : `Adicionado por ${admin.addedBy || 'administrador'}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void removeAdmin(admin.email)}
                disabled={isCurrentAdmin}
                className="rounded-lg p-2 text-white/35 hover:bg-rose-400/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-25"
                title={isCurrentAdmin ? 'Você não pode remover seu próprio acesso' : 'Remover administrador'}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
