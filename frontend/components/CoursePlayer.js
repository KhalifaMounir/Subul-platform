import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlayCircle, faCheckCircle, faQuestionCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/CoursePlayer.module.css';
import QuizModal from './QuizModal';
import ResultsModal from './ResultsModal';
import { courses } from '../utils/data';
import { loadLesson, nextLesson, initializeQuiz } from '../utils/course';

export default function CoursePlayer() {
  const router = useRouter();
  const { id, lesson } = router.query;
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);

  useEffect(() => {
    if (id && lesson) {
      loadLesson(id, lesson, setCurrentLesson, setCourse, setVideoError);
    }
  }, [id, lesson]);

  if (!course || !currentLesson) return <div>Loading...</div>;

  const lessonData = course.lessons.find(l => l.id === Number(currentLesson.lessonId));

  const handleRetakeQuiz = () => {
    setShowResultsModal(false);
    initializeQuiz(lessonData.quiz, setCurrentQuiz, setCurrentQuestionIndex, setUserAnswers, setScore, setShowQuizModal);
  };

  const handleGetCertificate = (courseId) => {
    console.log(`Generating certificate for course ${courseId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    alert('جاري إنشاء الشهادة...');
  };

  return (
    <div className={styles.courseContainer}>
      <div className={styles.courseSidebar}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <FontAwesomeIcon icon={faArrowRight} />
          العودة للدورات
        </button>
        <div className={styles.courseInfo}>
          <h3>{course.title}</h3>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${course.progress}%` }}></div>
          </div>
          <span className={styles.progressText}>{course.progress}% مكتمل</span>
        </div>
        <div className={styles.lessonsList}>
          {course.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              className={`${styles.lessonItem} ${lesson.completed ? styles.completed : ''} ${lesson.id === Number(currentLesson.lessonId) ? styles.active : ''}`}
              onClick={() => router.push(`/course/${course.id}?lesson=${lesson.id}`)}
            >
              <FontAwesomeIcon icon={lesson.completed ? faCheckCircle : faPlayCircle} />
              <div className={styles.lessonInfo}>
                <h4>{lesson.title}</h4>
                <p>{lesson.duration}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.courseContent}>
        <div className={styles.videoPlayer}>
          {videoError ? (
            <div className={styles.videoPlaceholder}>
              <FontAwesomeIcon icon={faPlayCircle} />
              <p>محتوى {lessonData.title} (محاكاة فيديو)</p>
            </div>
          ) : (
            <video
              className={styles.video}
              controls
              onError={() => setVideoError(true)}
              onPlay={() => console.log(`Video started playing for lesson ${lessonData.id} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }))}
              onEnded={() => console.log(`Video ended for lesson ${lessonData.id} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }))}
            >
              <source src={lessonData.videoUrl} type="video/mp4" />
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
          )}
        </div>
        <div className={styles.lessonContent}>
          <h2>{lessonData.title}</h2>
          <p>تعلم {lessonData.title} في {lessonData.duration}. هذا الدرس جزء من رحلتك لتطوير مهاراتك الوظيفية.</p>
          <div className={styles.lessonActions}>
            {lessonData.quiz && lessonData.quiz.length > 0 && (
              <button
                className={styles.btnPrimary}
                onClick={() => initializeQuiz(lessonData.quiz, setCurrentQuiz, setCurrentQuestionIndex, setUserAnswers, setScore, setShowQuizModal)}
              >
                <FontAwesomeIcon icon={faQuestionCircle} />
                خذ الاختبار
              </button>
            )}
            {course.lessons.findIndex(l => l.id === Number(currentLesson.lessonId)) < course.lessons.length - 1 && (
              <button
                className={styles.btnSecondary}
                onClick={() => nextLesson(course, currentLesson, setCurrentLesson, router)}
              >
                الدرس التالي
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
          </div>
        </div>
      </div>
      {showQuizModal && (
        <QuizModal
          currentQuiz={currentQuiz}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          setShowQuizModal={setShowQuizModal}
          setShowResultsModal={setShowResultsModal}
          setScore={setScore}
          courseId={id}
        />
      )}
      <ResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        onRetake={handleRetakeQuiz}
        onGetCertificate={handleGetCertificate}
        score={score}
        courseId={id}
      />
    </div>
  );
}