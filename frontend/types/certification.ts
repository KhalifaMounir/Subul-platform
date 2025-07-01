// frontend/types/certification.ts
export interface Subpart {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  isQuiz: boolean;
  videoUrl: string; // Mandatory
  videoId?: string;
  labGuideUrl: string | null; // Optional
  labGuideId?: string;
}
export interface Lesson {
  id: string;
  title: string;
  subparts: Subpart[];
  completed: boolean;
  certificationId?: string;
}

export interface Certification {
  id: string;
  name: string;
  lessons: Lesson[];
  videoUrl?: string | null;
  labGuideUrl?: string | null;
  videoId?: string | null;
  labId?: string | null;
}

export interface Certification {
  id: string;
  name: string;
  booked_by_user: boolean;
  lessons: Lesson[];
}
export type AdminAction =
  | { type: 'add-certification'; targetType: 'certification'; targetId?: string }
  | { type: 'add-video'; targetType: 'certification'; targetId: string }
  | { type: 'add-lab-guide'; targetType: 'certification'; targetId: string }
  | { type: 'add-quiz'; targetType: 'subpart'; targetId: string }
  | { type: 'edit-quiz'; targetType: 'subpart'; targetId: string; quizId: string }
  | { type: 'add-lesson'; targetType: 'certification'; targetId: string }
  | { type: 'add-subpart'; targetType: 'lesson'; targetId: string }
  | { type: 'delete-certification'; targetType: 'certification'; targetId: string }
  | { type: 'delete-quiz'; targetType: 'subpart'; targetId: string; quizId: string }
  | { type: 'delete-video'; targetType: 'certification'; targetId: string; videoId: string }
  | { type: 'delete-lab-guide'; targetType: 'certification'; targetId: string; labId: string };

export interface QuizData {
  question: string;
  options: string[];
  answer: string;
}

export interface VideoData {
  title: string;
  file: File;
}

export interface LabGuideData {
  title: string;
  file: File;
}

export interface LessonData {
  title: string;
  certification_id: string;
}

export interface SubpartData {
  title: string;
  duration: string;
  lesson_id: string;
}
