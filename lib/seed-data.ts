import { Category, ContentReport, Course, CourseComment, CourseReview, User } from './types';

const EMPTY_AVATAR = '/avatar-padrao.svg';

// Contas neutras mantidas apenas enquanto a autenticação real não está conectada.
// Elas não representam pessoas, resultados ou atividade da plataforma.
export const INITIAL_USERS: User[] = [
  {
    id: 'user-visitor',
    name: 'Visitante',
    email: '',
    avatar: EMPTY_AVATAR,
    role: 'aluno',
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '',
    totalHoursStudied: 0,
    completedCoursesCount: 0,
    medals: [],
  },
  {
    id: 'user-creator',
    name: 'Criador',
    email: '',
    avatar: EMPTY_AVATAR,
    role: 'criador',
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '',
    totalHoursStudied: 0,
    completedCoursesCount: 0,
    medals: [],
    followersCount: 0,
  },
  {
    id: 'user-admin',
    name: 'Administrador',
    email: '',
    avatar: EMPTY_AVATAR,
    role: 'admin',
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '',
    totalHoursStudied: 0,
    completedCoursesCount: 0,
    medals: [],
  },
];

// Categorias são apenas a taxonomia de cadastro. Os totais são calculados
// a partir dos cursos publicados, sem números fictícios.
export const CATEGORIES: Category[] = [
  { id: 'cat-ia', name: 'Inteligência Artificial', slug: 'inteligencia-artificial', icon: 'Cpu', description: '', courseCount: 0 },
  { id: 'cat-tiktok', name: 'TikTok Shop', slug: 'tiktok-shop', icon: 'ShoppingBag', description: '', courseCount: 0 },
  { id: 'cat-mkt', name: 'Marketing Digital', slug: 'marketing-digital', icon: 'TrendingUp', description: '', courseCount: 0 },
  { id: 'cat-yt', name: 'YouTube', slug: 'youtube', icon: 'Youtube', description: '', courseCount: 0 },
  { id: 'cat-prog', name: 'Programação', slug: 'programacao', icon: 'Code', description: '', courseCount: 0 },
  { id: 'cat-web', name: 'Desenvolvimento Web', slug: 'desenvolvimento-web', icon: 'Globe', description: '', courseCount: 0 },
  { id: 'cat-auto', name: 'Automação', slug: 'automacao', icon: 'Zap', description: '', courseCount: 0 },
  { id: 'cat-design', name: 'Design', slug: 'design', icon: 'Palette', description: '', courseCount: 0 },
  { id: 'cat-copy', name: 'Copywriting', slug: 'copywriting', icon: 'PenTool', description: '', courseCount: 0 },
  { id: 'cat-trafego', name: 'Tráfego Pago', slug: 'trafego-pago', icon: 'Target', description: '', courseCount: 0 },
  { id: 'cat-seo', name: 'SEO', slug: 'seo', icon: 'Search', description: '', courseCount: 0 },
  { id: 'cat-ecom', name: 'E-commerce', slug: 'e-commerce', icon: 'Store', description: '', courseCount: 0 },
  { id: 'cat-emp', name: 'Empreendedorismo', slug: 'empreendedorismo', icon: 'Briefcase', description: '', courseCount: 0 },
  { id: 'cat-fin', name: 'Finanças', slug: 'financas', icon: 'DollarSign', description: '', courseCount: 0 },
  { id: 'cat-prod', name: 'Produtividade', slug: 'produtividade', icon: 'CheckSquare', description: '', courseCount: 0 },
];

export const INITIAL_COURSES: Course[] = [];
export const INITIAL_REVIEWS: CourseReview[] = [];
export const INITIAL_COMMENTS: CourseComment[] = [];
export const INITIAL_REPORTS: ContentReport[] = [];
