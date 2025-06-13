import { courses } from './data';

export function loadLesson(courseId, lessonId, setCurrentLesson, setCourse, setVideoError) {
  console.log(`Loading lesson ${lessonId} for course ${courseId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const course = courses.find(c => c.id === Number(courseId));
  if (!course) {
    console.error(`Course with ID ${courseId} not found at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const lesson = course.lessons.find(l => l.id === Number(lessonId));
  if (!lesson) {
    console.error(`Lesson with ID ${lessonId} not found at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  setCourse(course);
  setCurrentLesson({ courseId, lessonId });

  if (!lesson.videoUrl) {
    setVideoError(true);
  } else {
    setVideoError(false);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('currentLesson', JSON.stringify({ courseId, lessonId }));
  }
}

export function nextLesson(course, currentLesson, setCurrentLesson, router) {
  console.log('Navigating to next lesson at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const currentLessonIndex = course.lessons.findIndex(l => l.id === Number(currentLesson.lessonId));
  if (currentLessonIndex < course.lessons.length - 1) {
    const nextLesson = course.lessons[currentLessonIndex + 1];
    router.push(`/course/${course.id}?lesson=${nextLesson.id}`);
  }
}

export function initializeQuiz(quizzes, setCurrentQuiz, setCurrentQuestionIndex, setUserAnswers, setScore, setShowQuizModal) {
  console.log('Initializing quiz with', quizzes.length, 'questions at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    console.error('Invalid or empty quizzes array at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }
  setCurrentQuiz(quizzes);
  setCurrentQuestionIndex(0);
  setUserAnswers([]);
  setScore(0);
  setShowQuizModal(true);
}

export function submitQuiz(currentQuiz, userAnswers, setScore, setShowQuizModal, setShowResultsModal, courseId) {
  console.log('Submitting quiz at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const score = currentQuiz.reduce((total, question, index) => {
    return total + (userAnswers[index] === question.correctAnswer ? 1 : 0);
  }, 0);
  const percentage = Math.round((score / currentQuiz.length) * 100);
  setScore(percentage);

  const userData = JSON.parse(localStorage.getItem('userData')) || { quizScores: {} };
  if (!userData.quizScores[courseId]) userData.quizScores[courseId] = [];
  userData.quizScores[courseId].push(percentage);
  localStorage.setItem('userData', JSON.stringify(userData));

  setShowQuizModal(false);
  setShowResultsModal(true);
}