export interface Subpart {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  isQuiz: boolean;
  videoUrl?: string | null;
  videoId?: number | null;
  labGuideUrl?: string | null;
  labGuideId?: number | null;
}

export interface Lesson {
  id: number;
  title: string;
  subparts: Subpart[];
  completed: boolean;
  certificationId?: number;
}

export interface Certification {
  id: number;
  name: string;
  description: string;
  booked_by_user: boolean;
  lessons: Lesson[];
  videoUrl?: string | null;
  labId?: number | null;
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