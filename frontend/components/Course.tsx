import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizModal from './QuizModal';
import styles from '@/styles/Course.module.css';

export default function Course() {
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSubpart, setCurrentSubpart] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "مقدمة عن الحوسبة السحابية",
      completed: false,
      subparts: [
        {
          id: 101,
          title: "مفاهيم الحوسبة السحابية",
          duration: "30 دقيقة",
          videoUrl: "/videos/test.mp4",
          completed: true
        },
        {
          id: 102,
          title: "فوائد Azure",
          duration: "25 دقيقة",
          videoUrl: "/videos/test.mp4",
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "خدمات Azure الأساسية",
      completed: false,
      subparts: [
        {
          id: 201,
          title: "الخدمات الحسابية",
          duration: "40 دقيقة",
          videoUrl: "/videos/test.mp4",
          completed: false
        },
        {
          id: 202,
          title: "خدمات التخزين",
          duration: "35 دقيقة",
          videoUrl: "/videos/test.mp4",
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "إدارة الموارد",
      completed: false,
      subparts: [
        {
          id: 301,
          title: "مجموعات الموارد",
          duration: "20 دقيقة",
          videoUrl: "/videos/test.mp4",
          completed: false
        },
        {
          id: 302,
          title: "إدارة التكاليف",
          duration: "30 دقيقة",
          videoUrl: "/videos/test.mp4",
          completed: false
        }
      ]
    },
    {
      id: 4,
      title: "اختبار نهائي",
      completed: false,
      subparts: [
        {
          id: 401,
          title: "اختبار شهادة Azure",
          duration: "60 دقيقة",
          videoUrl: "",
          completed: false,
          isQuiz: true
        }
      ]
    }
  ]);

  // Calculate and save progress
  const calculateProgress = () => {
    const totalSubparts = lessons.flatMap(lesson => lesson.subparts).length;
    const completedSubparts = lessons.flatMap(lesson => lesson.subparts).filter(subpart => subpart.completed).length;
    const newProgress = Math.round((completedSubparts / totalSubparts) * 100);
    setProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem('progress-az-900', newProgress.toString());
      console.log(`Saved progress-az-900: ${newProgress}%`); // Debug log
    }
    return newProgress;
  };

  // Calculate initial progress on mount and when lessons change
  useEffect(() => {
    calculateProgress();
  }, [lessons]);

  // Load first incomplete subpart by default and expand its lesson
  useEffect(() => {
    const firstIncompleteSubpart = lessons
      .flatMap(lesson => lesson.subparts.map(subpart => ({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title })))
      .find(subpart => !subpart.completed);
    
    if (firstIncompleteSubpart) {
      const lesson = lessons.find(l => l.id === firstIncompleteSubpart.lessonId);
      setCurrentLesson(lesson);
      setCurrentSubpart(firstIncompleteSubpart);
      setExpandedLessons(prev => ({ ...prev, [firstIncompleteSubpart.lessonId]: true }));
    }
  }, []);

  const handleSubpartClick = (subpart, lesson) => {
    setCurrentLesson(lesson);
    setCurrentSubpart({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title });
    setVideoError(false);
  };

  const markSubpartCompleted = (subpartId) => {
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
        <QuizModal onClose={handleCloseQuiz} />
      )}
    </>
  );
}