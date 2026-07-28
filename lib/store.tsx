'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, CourseStatus, User, UserRole, UserProgress, CourseReview, CourseComment, ContentReport, Category } from './types';
import { INITIAL_USERS, INITIAL_COURSES, INITIAL_REVIEWS, INITIAL_COMMENTS, INITIAL_REPORTS, CATEGORIES } from './seed-data';

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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_users');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('aluno');

  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_courses');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_COURSES;
  });

  const [userProgress, setUserProgress] = useState<UserProgress[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_progress');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return [
      { courseId: 'course-ia-101', lessonId: 'les-1-1', completed: true, lastWatchedSeconds: 1080, updatedAt: new Date().toISOString() }
    ];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grayhat_favorites');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return ['course-ia-101'];
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

  const currentUser = users.find(u => u.role === currentRole) || users[0];

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
    const isEdit = courseData.id && courses.some(c => c.id === courseData.id);
    const id = isEdit ? courseData.id! : `course-${Date.now()}`;
    const now = new Date().toISOString();

    const status: CourseStatus = submitForReview ? 'pending' : (courseData.status || 'draft');

    const newCourse: Course = {
      id,
      title: courseData.title || 'Novo Curso Sem Título',
      slug: (courseData.title || 'novo-curso').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: courseData.shortDescription || 'Descrição curta do curso',
      description: courseData.description || 'Descrição completa do curso',
      coverUrl: courseData.coverUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      bannerUrl: courseData.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&auto=format&fit=crop&q=80',
      categoryId: courseData.categoryId || 'cat-ia',
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherAvatar: currentUser.avatar,
      level: courseData.level || 'Iniciante',
      durationMinutes: courseData.durationMinutes || 60,
      totalLessons: courseData.modules ? courseData.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : 1,
      totalStudents: courseData.totalStudents || 0,
      rating: courseData.rating || 5.0,
      reviewCount: courseData.reviewCount || 0,
      tags: courseData.tags || ['Inovação', 'Gratuito'],
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

    return newCourse;
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const approveCourse = (courseId: string, adminNotes?: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? {
      ...c,
      status: 'published',
      adminNotes: adminNotes || 'Curso aprovado pela administração do Gray Hat.',
      updatedAt: new Date().toISOString()
    } : c));
  };

  const rejectCourse = (courseId: string, reason: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? {
      ...c,
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: new Date().toISOString()
    } : c));
  };

  const toggleFeatureCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, isFeatured: !c.isFeatured } : c));
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
        categories: CATEGORIES,
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
