'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Course, CourseStatus, User, UserRole, UserProgress, CourseReview, CourseComment, ContentReport, Category } from './types';
import { INITIAL_USERS, INITIAL_COURSES, INITIAL_REVIEWS, INITIAL_COMMENTS, INITIAL_REPORTS, CATEGORIES } from './seed-data';
import { firestore } from './firebase';
import { useAdminAuth } from './admin-auth';

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  courses: Course[];
  categories: Category[];
  userProgress: UserProgress[];
  favorites: string[]; // courseIds
  reviews: CourseReview[];
  comments: CourseComment[];
  reports: ContentReport[];
  
  // Progress & Gamification Actions
  markLessonComplete: (courseId: string, lessonId: string) => void;
  updateWatchTime: (courseId: string, lessonId: string, seconds: number) => void;
  toggleFavorite: (courseId: string) => void;
  
  // Course Management (Creator)
  createOrUpdateCourse: (courseData: Partial<Course>, submitForReview?: boolean) => Course;
  deleteCourse: (courseId: string) => void;
  
  // Admin Moderation
  approveCourse: (courseId: string, adminNotes?: string) => void;
  rejectCourse: (courseId: string, reason: string) => void;
  toggleFeatureCourse: (courseId: string) => void;
  
  // Community Actions
  addReview: (courseId: string, rating: number, comment: string) => void;
  addComment: (lessonId: string, courseId: string, text: string) => void;
  likeComment: (commentId: string) => void;
  moderateComment: (commentId: string, action: 'approved' | 'blocked') => void;
  createReport: (targetType: 'course' | 'lesson' | 'comment', targetId: string, targetTitle: string, reason: 'inappropriate' | 'copyright' | 'spam' | 'broken_link', details: string) => void;
  resolveReport: (reportId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_VERSION = '2';
const STORAGE_KEYS = [
  'grayhat_users',
  'grayhat_courses',
  'grayhat_progress',
  'grayhat_favorites',
  'grayhat_reviews',
  'grayhat_comments',
  'grayhat_reports',
];

function removeTemplateDataFromStorage() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('grayhat_data_version') === STORAGE_VERSION) return;

  STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
  localStorage.setItem('grayhat_data_version', STORAGE_VERSION);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, user: adminAccount } = useAdminAuth();
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      removeTemplateDataFromStorage();
      const saved = localStorage.getItem('grayhat_users');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('aluno');

  const [courses, setCourses] = useState<Course[]>(() => {
    return INITIAL_COURSES;
  });

  const [userProgress, setUserProgress] = useState<UserProgress[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_progress');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_favorites');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return [];
  });

  const [reviews, setReviews] = useState<CourseReview[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_reviews');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_REVIEWS;
  });

  const [comments, setComments] = useState<CourseComment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_comments');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_COMMENTS;
  });

  const [reports, setReports] = useState<ContentReport[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_reports');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_REPORTS;
  });

  // Sync state to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('grayhat_users', JSON.stringify(users));
      localStorage.setItem('grayhat_courses', JSON.stringify(courses));
      localStorage.setItem('grayhat_progress', JSON.stringify(userProgress));
      localStorage.setItem('grayhat_favorites', JSON.stringify(favorites));
      localStorage.setItem('grayhat_reviews', JSON.stringify(reviews));
      localStorage.setItem('grayhat_comments', JSON.stringify(comments));
      localStorage.setItem('grayhat_reports', JSON.stringify(reports));
    }
  }, [users, courses, userProgress, favorites, reviews, comments, reports]);

  useEffect(() => {
    if (!firestore) return;

    const coursesCollection = collection(firestore, 'courses');
    const coursesQuery = isAdmin
      ? coursesCollection
      : query(coursesCollection, where('status', '==', 'published'));

    return onSnapshot(
      coursesQuery,
      snapshot => {
        setCourses(snapshot.docs.map(courseDocument => courseDocument.data() as Course));
      },
      error => {
        console.error('Não foi possível carregar os cursos do Firestore:', error);
        setCourses([]);
      }
    );
  }, [isAdmin]);

  const currentUser = users.find(u => u.role === currentRole) || users[0];
  const categories = useMemo(
    () => CATEGORIES.map(category => ({
      ...category,
      courseCount: courses.filter(course => (
        course.status === 'published' && course.categoryId === category.id
      )).length,
    })),
    [courses]
  );

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setUserProgress(prev => {
      const existing = prev.find(p => p.courseId === courseId && p.lessonId === lessonId);
      if (existing) {
        if (existing.completed) return prev; // already complete
        return prev.map(p => p.courseId === courseId && p.lessonId === lessonId ? { ...p, completed: true, updatedAt: new Date().toISOString() } : p);
      } else {
        return [...prev, { courseId, lessonId, completed: true, lastWatchedSeconds: 0, updatedAt: new Date().toISOString() }];
      }
    });

    // Award XP to current user
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const newXp = u.xp + 50;
        const newLevel = Math.floor(newXp / 500) + 1;
        return { ...u, xp: newXp, level: newLevel };
      }
      return u;
    }));
  };

  const updateWatchTime = (courseId: string, lessonId: string, seconds: number) => {
    setUserProgress(prev => {
      const existingIndex = prev.findIndex(p => p.courseId === courseId && p.lessonId === lessonId);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], lastWatchedSeconds: seconds, updatedAt: new Date().toISOString() };
        return copy;
      } else {
        return [...prev, { courseId, lessonId, completed: false, lastWatchedSeconds: seconds, updatedAt: new Date().toISOString() }];
      }
    });
  };

  const toggleFavorite = (courseId: string) => {
    setFavorites(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  };

  const createOrUpdateCourse = (courseData: Partial<Course>, submitForReview = false): Course => {
    if (!isAdmin || !adminAccount) {
      throw new Error('Apenas administradores podem criar ou editar cursos.');
    }
    const isEdit = courseData.id && courses.some(c => c.id === courseData.id);
    const id = isEdit ? courseData.id! : `course-${Date.now()}`;
    const now = new Date().toISOString();

    const status: CourseStatus = submitForReview ? 'pending' : (courseData.status || 'draft');

    const newCourse: Course = {
      id,
      title: courseData.title || 'Novo Curso Sem Título',
      slug: (courseData.title || 'novo-curso').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: courseData.shortDescription || '',
      description: courseData.description || '',
      coverUrl: courseData.coverUrl || '/curso-padrao.svg',
      bannerUrl: courseData.bannerUrl || '/curso-padrao.svg',
      categoryId: courseData.categoryId || 'cat-ia',
      teacherId: adminAccount.uid,
      teacherName: adminAccount.displayName || adminAccount.email || 'Administrador',
      teacherAvatar: adminAccount.photoURL || '/avatar-padrao.svg',
      level: courseData.level || 'Iniciante',
      durationMinutes: courseData.durationMinutes || 0,
      totalLessons: courseData.modules ? courseData.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : 0,
      totalStudents: courseData.totalStudents || 0,
      rating: courseData.rating || 0,
      reviewCount: courseData.reviewCount || 0,
      tags: courseData.tags || [],
      status,
      certificateEnabled: courseData.certificateEnabled ?? true,
      language: courseData.language || 'Português',
      createdAt: isEdit ? (courses.find(c => c.id === id)?.createdAt || now) : now,
      updatedAt: now,
      modules: courseData.modules || []
    };

    if (isEdit) {
      setCourses(prev => prev.map(c => c.id === id ? newCourse : c));
    } else {
      setCourses(prev => [newCourse, ...prev]);
    }
    if (firestore) {
      void setDoc(
        doc(firestore, 'courses', id),
        JSON.parse(JSON.stringify(newCourse))
      );
    }

    return newCourse;
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    if (firestore) void deleteDoc(doc(firestore, 'courses', courseId));
  };

  const approveCourse = (courseId: string, adminNotes?: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const updatedCourse: Course = {
        ...c,
        status: 'published',
        adminNotes: adminNotes || '',
        updatedAt: new Date().toISOString()
      };
      if (firestore) {
        void setDoc(doc(firestore, 'courses', courseId), JSON.parse(JSON.stringify(updatedCourse)));
      }
      return updatedCourse;
    }));
  };

  const rejectCourse = (courseId: string, reason: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const updatedCourse: Course = {
        ...c,
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      };
      if (firestore) {
        void setDoc(doc(firestore, 'courses', courseId), JSON.parse(JSON.stringify(updatedCourse)));
      }
      return updatedCourse;
    }));
  };

  const toggleFeatureCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const updatedCourse = { ...c, isFeatured: !c.isFeatured };
      if (firestore) {
        void setDoc(doc(firestore, 'courses', courseId), JSON.parse(JSON.stringify(updatedCourse)));
      }
      return updatedCourse;
    }));
  };

  const addReview = (courseId: string, rating: number, comment: string) => {
    const newRev: CourseReview = {
      id: `rev-${Date.now()}`,
      courseId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate average rating
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const courseReviews = [newRev, ...reviews.filter(r => r.courseId === courseId)];
        const avg = courseReviews.reduce((acc, r) => acc + r.rating, 0) / courseReviews.length;
        return { ...c, rating: Number(avg.toFixed(1)), reviewCount: courseReviews.length };
      }
      return c;
    }));
  };

  const addComment = (lessonId: string, courseId: string, text: string) => {
    const newComm: CourseComment = {
      id: `comm-${Date.now()}`,
      lessonId,
      courseId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      status: 'approved',
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setComments(prev => [newComm, ...prev]);
  };

  const likeComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  const moderateComment = (commentId: string, action: 'approved' | 'blocked') => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, status: action } : c));
  };

  const createReport = (
    targetType: 'course' | 'lesson' | 'comment',
    targetId: string,
    targetTitle: string,
    reason: 'inappropriate' | 'copyright' | 'spam' | 'broken_link',
    details: string
  ) => {
    const newReport: ContentReport = {
      id: `rep-${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      reason,
      details,
      reporterUserId: currentUser.id,
      reporterName: currentUser.name,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
  };

  const resolveReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        courses,
        categories,
        userProgress,
        favorites,
        reviews,
        comments,
        reports,
        markLessonComplete,
        updateWatchTime,
        toggleFavorite,
        createOrUpdateCourse,
        deleteCourse,
        approveCourse,
        rejectCourse,
        toggleFeatureCourse,
        addReview,
        addComment,
        likeComment,
        moderateComment,
        createReport,
        resolveReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
