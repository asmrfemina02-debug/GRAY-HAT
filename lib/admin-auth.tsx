'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from './firebase';

interface AdminAuthContextValue {
  user: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdminAccess: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function emailHasAdminAccess(email?: string | null) {
  if (!email || !firestore) return false;
  try {
    const adminDocument = await getDoc(
      doc(firestore, 'adminEmails', normalizeEmail(email))
    );
    return adminDocument.exists() && adminDocument.data().active !== false;
  } catch {
    return false;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(Boolean(firebaseAuth));

  const checkAccess = async (account: FirebaseUser | null) => {
    setUser(account);
    setIsAdmin(await emailHasAdminAccess(account?.email));
    setLoading(false);
  };

  useEffect(() => {
    if (!firebaseAuth) return;

    return onAuthStateChanged(firebaseAuth, account => {
      void checkAccess(account);
    });
  }, []);

  const value = useMemo<AdminAuthContextValue>(() => ({
    user,
    isAdmin,
    loading,
    login: async (email, password) => {
      if (!firebaseAuth) {
        throw new Error('Firebase não está configurado.');
      }
      setLoading(true);
      try {
        const credential = await signInWithEmailAndPassword(
          firebaseAuth,
          normalizeEmail(email),
          password
        );
        await checkAccess(credential.user);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    logout: async () => {
      if (firebaseAuth) await signOut(firebaseAuth);
      setUser(null);
      setIsAdmin(false);
    },
    refreshAdminAccess: async () => {
      setLoading(true);
      await checkAccess(firebaseAuth?.currentUser || null);
    },
  }), [user, isAdmin, loading]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider.');
  }
  return context;
}
