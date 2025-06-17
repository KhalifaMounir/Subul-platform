export type ViewType = 'dashboard' | 'profile' | 'course' | 'quiz' | 'results' | 'certificate'

export interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: string
  category: string
  image?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  videoUrl?: string
  content: string
  completed: boolean
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

export interface UserStats {
  completedCourses: number
  totalHours: number
  averageScore: number
  certificatesCount: number
}