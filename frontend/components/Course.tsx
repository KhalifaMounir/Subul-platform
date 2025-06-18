import Link from 'next/link'
import { useState, useEffect } from 'react'
import { quizActions } from '@/utils/actions'
import styles from '@/styles/Course.module.css'

export default function Course() {
  const [currentLesson, setCurrentLesson] = useState(null)
  const [currentSubpart, setCurrentSubpart] = useState(null)
  const [videoError, setVideoError] = useState(false)
  const [progress, setProgress] = useState(25)

  const lessons = [
    {
      id: 1,
      title: "مقدمة عن الحوسبة السحابية",
      completed: false,
      subparts: [
        { 
          id: 101,
          title: "مفاهيم الحوسبة السحابية", 
          duration: "30 دقيقة",
          videoUrl: "/videos/cloud-concepts.mp4",
          completed: true
        },
        { 
          id: 102,
          title: "فوائد Azure", 
          duration: "25 دقيقة",
          videoUrl: "/videos/azure-benefits.mp4",
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
          videoUrl: "/videos/compute-services.mp4",
          completed: false
        },
        { 
          id: 202,
          title: "خدمات التخزين", 
          duration: "35 دقيقة",
          videoUrl: "/videos/storage-services.mp4",
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
          videoUrl: "/videos/resource-groups.mp4",
          completed: false
        },
        { 
          id: 302,
          title: "إدارة التكاليف", 
          duration: "30 دقيقة",
          videoUrl: "/videos/cost-management.mp4",
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
          completed: false,
          isQuiz: true
        }
      ]
    }
  ]

  // Load first incomplete subpart by default
  useEffect(() => {
    const firstIncompleteSubpart = lessons
      .flatMap(lesson => lesson.subparts.map(subpart => ({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title })))
      .find(subpart => !subpart.completed);
    
    if (firstIncompleteSubpart) {
      const lesson = lessons.find(l => l.id === firstIncompleteSubpart.lessonId);
      setCurrentLesson(lesson);
      setCurrentSubpart(firstIncompleteSubpart);
    }
  }, []);

  const handleSubpartClick = (subpart, lesson) => {
    setCurrentLesson(lesson);
    setCurrentSubpart({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title });
    setVideoError(false);
  };

  const handleNextSubpart = () => {
    if (!currentSubpart || !currentLesson) return;

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
      setVideoError(false);
    }
  };

  const hasNextSubpart = () => {
    if (!currentSubpart) return false;
    const allSubparts = lessons.flatMap(lesson => lesson.subparts);
    const currentIndex = allSubparts.findIndex(s => s.id === currentSubpart.id);
    return currentIndex < allSubparts.length - 1;
  };

  const isQuizLesson = currentSubpart?.isQuiz;

  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.courseContainer}>
        <div className={styles.courseSidebar}>
          <Link href="/dashboard" className={styles.backBtn}>
            <i className="fas fa-arrow-right"></i>
            العودة للدورات
          </Link>

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
                <div className={styles.lessonHeader}>
                  <i className={`fas ${lesson.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>
                  <h4>{lesson.title}</h4>
                </div>
                <ul>
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
              </div>
            ))}
          </div>
        </div>

        <div className={styles.courseContent}>
          <div className={styles.videoPlayer}>
            {currentSubpart && !isQuizLesson ? (
              videoError ? (
                <div className={styles.videoPlaceholder}>
                  <i className="fas fa-play-circle"></i>
                  <p>محتوى {currentSubpart.title}</p>
                  <small>(محاكاة فيديو)</small>
                </div>
              ) : (
                <video
                  className={styles.video}
                  controls
                  onError={() => setVideoError(true)}
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
                  onClick={() => {
                    quizActions.startQuiz()
                  }}
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
  )
}