import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AppProvider } from '@/lib/store';
import { FirebaseAnalytics } from '@/components/firebase-analytics';
import { AdminAuthProvider } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Gray Hat — Repositório Aberto de Conhecimento Digital',
  description: 'tudo que os gurus ensinam sobre como ganhar dinheiro no digital. Plataforma aberta e gratuita para aprender IA, marketing, programação e negócios.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-[#050505] text-[#e5e5e5] antialiased">
        <FirebaseAnalytics />
        <AdminAuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
