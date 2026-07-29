export type UserRole = 'aluno' | 'criador' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  totalHoursStudied: number;
  completedCoursesCount: number;
  medals: Medal[];
  bio?: string;
  website?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  followersCount?: number;
}

export interface Medal {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  courseCount: number;
}

export type CourseLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
export type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'changes_requested';
export type VideoSourceType = 'youtube' | 'gdrive' | 'vimeo' | 'cloudflare' | 'bunny' | 'zdmplay' | 'telegram' | 'upload';

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'slide' | 'link' | 'code' | 'zip';
  url: string;
  size?: string;
}

export interface QuizOption {
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface Exercise {
  id: string;
  title: string;
  prompt: string;
  hints?: string[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  videoSourceType: VideoSourceType;
  videoUrl: string;
  textContent?: string;
  isPreview?: boolean;
  resources?: LessonResource[];
  quiz?: QuizQuestion[];
  exercises?: Exercise[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverUrl: string;
  bannerUrl: string;
  categoryId: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  level: CourseLevel;
  durationMinutes: number;
  totalLessons: number;
  totalStudents: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  status: CourseStatus;
  isFeatured?: boolean;
  isTrending?: boolean;
  certificateEnabled?: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  adminNotes?: string;
  modules?: Module[];
}

export interface UserProgress {
  courseId: string;
  lessonId: string;
  completed: boolean;
  lastWatchedSeconds: number;
  updatedAt: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CourseComment {
  id: string;
  lessonId: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  status: 'approved' | 'pending' | 'blocked';
  parentId?: string;
  createdAt: string;
  likes: number;
}

export interface ContentReport {
  id: string;
  targetType: 'course' | 'lesson' | 'comment';
  targetId: string;
  targetTitle: string;
  reason: 'inappropriate' | 'copyright' | 'spam' | 'broken_link';
  details: string;
  reporterUserId: string;
  reporterName: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
