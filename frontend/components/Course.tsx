import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizModal from './QuizModal';
import styles from '@/styles/Course.module.css';

export default function Course({ certId }) {
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSubpart, setCurrentSubpart] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lessons and subparts from API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/certifications/${certId}/lessons`, {
          credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const data = await response.json();
        setLessons(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLessons();
  }, [certId]);

  // Calculate and save progress
  const calculateProgress = () => {
    const totalSubparts = lessons.flatMap(lesson => lesson.subparts).length;
    const completedSubparts = lessons.flatMap(lesson => lesson.subparts).filter(subpart => subpart.completed).length;
    const newProgress = totalSubparts ? Math.round((completedSubparts / totalSubparts) * 100) : 0;
    setProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`progress-cert-${certId}`, newProgress.toString());
      console.log(`Saved progress-cert-${certId}: ${newProgress}%`);
    }
    return newProgress;
  };

  // Calculate progress when lessons change
  useEffect(() => {
    if (lessons.length > 0) {
      calculateProgress();
    }
  }, [lessons]);

  // Load first incomplete subpart by default
  useEffect(() => {
    if (lessons.length > 0) {
      const firstIncompleteSubpart = lessons
        .flatMap(lesson => lesson.subparts.map(subpart => ({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title })))
        .find(subpart => !subpart.completed);
      
      if (firstIncompleteSubpart) {
        const lesson = lessons.find(l => l.id === firstIncompleteSubpart.lessonId);
        setCurrentLesson(lesson);
        setCurrentSubpart(firstIncompleteSubpart);
        setExpandedLessons(prev => ({ ...prev, [firstIncompleteSubpart.lessonId]: true }));
      }
    }
  }, [lessons]);

  const handleSubpartClick = (subpart, lesson) => {
    setCurrentLesson(lesson);
    setCurrentSubpart({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title });
    setVideoError(false);
  };

  const markSubpartCompleted = async (subpartId) => {
    try {
      const response = await fetch(`http://localhost:5000/subparts/${subpartId}/complete`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to mark subpart as completed');
      }
      setLessons(prevLessons =>
        prevLessons.map(lesson =>
          lesson.subparts.some(subpart => subpart.id === subpartId)
            ? {
                ...lesson,
                subparts: lesson.subparts.map(subpart =>
                  subpart.id === subpartId ? { ...subpart, completed: true } : subpart
                ),
                completed: lesson.subparts.every(subpart => subpart.id === subpartId ? true : subpart.completed)
              }
            : lesson
        )
      );
    } catch (err) {
      console.error('Error marking subpart as completed:', err);
    }
  };

  const handleNextSubpart = () => {
    if (!currentSubpart || !currentLesson) return;

    if (!currentSubpart.isQuiz) {
      markSubpartCompleted(currentSubpart.id);
    }

    const allSubparts = lessons.flatMap(lesson =>
      lesson.subparts.map(subpart => ({
        ...subpart,
        lessonId: lesson.id,
        lessonTitle: lesson.title
      }))
    );
    
    const currentIndex = allSubparts.findIndex(
      item => item.id === currentSubpart.id
    );
    
    if (currentIndex < allSubparts.length - 1) {
      const next = allSubparts[currentIndex + 1];
      const nextLesson = lessons.find(l => l.id === next.lessonId);
      setCurrentLesson(nextLesson);
      setCurrentSubpart(next);
      setExpandedLessons(prev => ({ ...prev, [next.lessonId]: true }));
      setVideoError(false);
    }
  };

  const hasNextSubpart = () => {
    if (!currentSubpart) return false;
    const allSubparts = lessons.flatMap(lesson => lesson.subparts);
    const currentIndex = allSubparts.findIndex(s => s.id === currentSubpart.id);
    return currentIndex < allSubparts.length - 1;
  };

  const handleStartQuiz = () => {
    setShowQuizModal(true);
  };

  const handleCloseQuiz = () => {
    setShowQuizModal(false);
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const isQuizLesson = currentSubpart?.isQuiz;

  if (loading) {
    return <div>Loading lessons...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className={`${styles.view} ${styles.active}`}>
        <div className={styles.courseContainer}>
          <div className={styles.courseSidebar}>
            <button className={styles.backBtn} onClick={() => router.push('/dashboard')}>
              <i className="fas fa-arrow-right"></i>
              العودة للدورات
            </button>

            <div className={styles.courseInfo}>
              <h3>Microsoft Azure Fundamentals (AZ-900)</h3>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <span>{progress}% مكتمل</span>
            </div>

            <div className={styles.lessonsList}>
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div
                    className={styles.lessonHeader}
                    onClick={() => toggleLesson(lesson.id)}
                    role="button"
                    aria-expanded={expandedLessons[lesson.id] || false}
                    aria-controls={`subparts-${lesson.id}`}
                  >
                    <i className={`fas ${lesson.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    <h4>{lesson.title}</h4>
                    <i className={`fas ${expandedLessons[lesson.id] ? 'fa-chevron-down' : 'fa-chevron-right'} ${styles.toggleIcon}`}></i>
                  </div>
                  {expandedLessons[lesson.id] && (
                    <ul id={`subparts-${lesson.id}`}>
                      {lesson.subparts.map((subpart, subIndex) => (
                        <li
                          key={subpart.id}
                          className={`${styles.subpartItem} ${currentSubpart?.id === subpart.id ? styles.active : ''}`}
                          onClick={() => handleSubpartClick(subpart, lesson)}
                        >
                          <div className={styles.subpartContent}>
                            <i className={`fas ${
                              subpart.completed ? 'fa-check-circle' :
                              subpart.isQuiz ? 'fa-question-circle' :
                              'fa-play-circle'
                            }`}></i>
                            <div className={styles.subpartInfo}>
                              <span className={styles.subpartTitle}>{subpart.title}</span>
                              <span className={styles.subpartDuration}>{subpart.duration}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.courseContent}>
            <div className={styles.videoPlayer}>
              {currentSubpart && !isQuizLesson && currentSubpart.videoUrl ? (
                videoError ? (
                  <div className={styles.videoPlaceholder}>
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>خطأ في تحميل الفيديو</p>
                    <small>تأكد من وجود الملف: {currentSubpart.videoUrl}</small>
                  </div>
                ) : (
                  <video
                    className={styles.video}
                    controls
                    key={currentSubpart.id}
                    onError={() => setVideoError(true)}
                    onLoadStart={() => setVideoError(false)}
                    onPlay={() => console.log(`Video started: ${currentSubpart.title} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }))}
                    onEnded={() => console.log(`Video ended: ${currentSubpart.title} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }))}
                  >
                    <source src={currentSubpart.videoUrl} type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>
                )
              ) : (
                <div className={styles.videoPlaceholder}>
                  <i className="fas fa-play"></i>
                  <p>{currentSubpart ? currentSubpart.title : 'اختر درساً لبدء التعلم'}</p>
                  {currentSubpart && !currentSubpart.videoUrl && !isQuizLesson && (
                    <small>لا يوجد فيديو متاح لهذا الدرس</small>
                  )}
                </div>
              )}
            </div>

            <div className={styles.lessonContent}>
              <h2>{currentSubpart ? currentSubpart.title : 'مرحباً بك في الدورة'}</h2>
              <p>
                {currentSubpart
                  ? `تعلم ${currentSubpart.title} في ${currentSubpart.duration}. هذا الدرس جزء من رحلتك لتطوير مهاراتك في Microsoft Azure.`
                  : 'اختر درساً من الشريط الجانبي لبدء رحلة التعلم.'
                }
              </p>

              <div className={styles.lessonActions}>
                {isQuizLesson && currentSubpart && (
                  <button
                    className={styles.btnPrimary}
                    onClick={handleStartQuiz}
                  >
                    <i className="fas fa-question-circle"></i>
                    خذ الاختبار
                  </button>
                )}

                {hasNextSubpart() && (
                  <button
                    className={styles.btnSecondary}
                    onClick={handleNextSubpart}
                  >
                    الدرس التالي
                    <i className="fas fa-arrow-left"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuizModal && (
        <QuizModal onClose={handleCloseQuiz} certId={certId} />
      )}
    </>
  );
}