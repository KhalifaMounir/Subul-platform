import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuizModal from "@/components/QuizModal"; 
import styles from "@/styles/Course.module.css";

interface Subpart {
  id: number;
  title: string;
  duration: string;
  videoUrl: string | null;
  completed: boolean;
  isQuiz: boolean;
  videoId?: number;
}

interface Lesson {
  id: number;
  title: string;
  completed: boolean;
  subparts: Subpart[];
}

interface LabGuide {
  id: number;
  pdf_url: string;
}

interface CourseProps {
  certId?: string | null; 
}

export default function Course({ certId }: CourseProps) {
  const router = useRouter();
  const certIdFromParams = router.query.cert_id as string || certId;
  const lessonIdFromParams = router.query.lesson_id as string;
  const subpartIdFromParams = router.query.subpart_id as string;
  const timestampParam = router.query.timestamp as string; 

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentSubpart, setCurrentSubpart] = useState<Subpart & { lessonId: number; lessonTitle: string } | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState<{ [key: number]: boolean }>({});
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [labGuide, setLabGuide] = useState<LabGuide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number | null>(null);
  const isRTL = router.locale === 'ar';

  useEffect(() => {
    console.log('Course component - certIdFromParams:', certIdFromParams);
    console.log('Course component - router.query:', router.query);
    console.log('Course component - router.asPath:', router.asPath);
    console.log('Course component - router.pathname:', router.pathname);
    
    if (!certIdFromParams) {
      console.log('No certIdFromParams found');
      setError("معرف الدورة غير متوفر");
      setIsLoading(false);
      router.push("/dashboard");
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching lessons for certId:', certIdFromParams);
        
        const [lessonsResponse, labResponse] = await Promise.all([
          fetch(`http://localhost:5000/certifications/${certIdFromParams}/lessons`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`http://localhost:5000/lab/${certIdFromParams}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);
        
        console.log('Lessons response status:', lessonsResponse.status);
        console.log('Lab response status:', labResponse.status);
        
        if (!lessonsResponse.ok) {
          console.log('Lessons response not ok:', lessonsResponse.status, lessonsResponse.statusText);
          if (lessonsResponse.status === 401 || lessonsResponse.status === 403) {
            router.push("/");
            return;
          }
          const errorText = await lessonsResponse.text();
          console.log('Error response:', errorText);
          throw new Error(`فشل جلب الدروس: ${lessonsResponse.status} ${lessonsResponse.statusText}`);
        }
        
        const lessonsData = await lessonsResponse.json();
        console.log('Lessons data received:', lessonsData);
        setLessons(lessonsData);
        setError(null);
        
        if (labResponse.ok) {
          const labData = await labResponse.json();
          setLabGuide(labData);
        } else {
          setLabGuide(null);
        }
      } catch (err: any) {
        console.error('Error in fetchData:', err);
        setError(`تعذر تحميل الدروس: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [certIdFromParams, router, router.query]);

  useEffect(() => {
    if (subpartIdFromParams) {
      const subpartId = parseInt(subpartIdFromParams, 10);
      if (!isNaN(subpartId)) {
         const targetSubpartWithLesson = lessons
          .flatMap((lesson) =>
            lesson.subparts.map((subpart) => ({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title }))
          )
          .find((sp) => sp.id === subpartId);

        if (targetSubpartWithLesson) {
          const lesson = lessons.find((l) => l.id === targetSubpartWithLesson.lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
            setCurrentSubpart(targetSubpartWithLesson);
            setExpandedLessons((prev) => ({ ...prev, [targetSubpartWithLesson.lessonId]: true }));
            if (timestampParam) {
                const ts = parseInt(timestampParam, 10);
                if (!isNaN(ts) && ts > 0) {
                    setVideoStartTime(ts);
                 } else {
                     setVideoStartTime(null);
                 }
            } else {
                 setVideoStartTime(null);
            }
            setVideoError(false); 
            return; 
          }
        }
      }
    }

    const firstIncompleteSubpart = lessons
      .flatMap((lesson) =>
        lesson.subparts.map((subpart) => ({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title }))
      )
      .find((subpart) => !subpart.completed);

    if (firstIncompleteSubpart) {
      const lesson = lessons.find((l) => l.id === firstIncompleteSubpart.lessonId);
      setCurrentLesson(lesson);
      setCurrentSubpart(firstIncompleteSubpart);
      setExpandedLessons((prev) => ({ ...prev, [firstIncompleteSubpart.lessonId]: true }));
       setVideoStartTime(null);
    } else {
        const firstSubpartWithLesson = lessons
        .flatMap((lesson) =>
            lesson.subparts.map((subpart) => ({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title }))
        )
        .find(() => true); 

        if (firstSubpartWithLesson) {
            const lesson = lessons.find((l) => l.id === firstSubpartWithLesson.lessonId);
            setCurrentLesson(lesson);
            setCurrentSubpart(firstSubpartWithLesson);
            setExpandedLessons((prev) => ({ ...prev, [firstSubpartWithLesson.lessonId]: true }));
             setVideoStartTime(null);
        }
    }
  }, [lessons, subpartIdFromParams, lessonIdFromParams, timestampParam]);

  useEffect(() => {
    if (videoStartTime !== null && currentSubpart && currentSubpart.videoUrl) {
        const videoElement = document.querySelector(`.${styles.video}`) as HTMLVideoElement | null;
        if (videoElement) {
            const handleLoadedMetadata = () => {
                 videoElement.currentTime = videoStartTime;
                 videoElement.play().catch(e => console.error("Autoplay failed:", e));
                 videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };

            if (videoElement.readyState >= 1) {
                 videoElement.currentTime = videoStartTime;
                 videoElement.play().catch(e => console.error("Autoplay failed:", e));
            } else {
                videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
                 return () => {
                    videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                 };
            }
        }
    }
  }, [videoStartTime, currentSubpart]); 

  const calculateProgress = () => {
    const totalSubparts = lessons.flatMap((lesson) => lesson.subparts).length;
    const completedSubparts = lessons
      .flatMap((lesson) => lesson.subparts)
      .filter((subpart) => subpart.completed).length;
    const newProgress = totalSubparts > 0 ? Math.round((completedSubparts / totalSubparts) * 100) : 0;
    setProgress(newProgress);
    return newProgress;
  };

  useEffect(() => {
    calculateProgress();
  }, [lessons]);

  const handleSubpartClick = (subpart: Subpart, lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentSubpart({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title });
    setVideoError(false);
     setVideoStartTime(null); 
  };

  const markSubpartCompleted = async (subpartId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/subparts/${subpartId}/complete`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson.subparts.some((s) => s.id === subpartId)
              ? {
                  ...lesson,
                  subparts: lesson.subparts.map((s) =>
                    s.id === subpartId ? { ...s, completed: true } : s
                  ),
                  completed: lesson.subparts.every((s) => (s.id === subpartId ? true : s.completed)),
                }
              : lesson
          )
        );
      }
    } catch (err) {
      console.error("Error marking subpart completed:", err);
    }
  };

  const handleNextSubpart = async () => {
    if (!currentSubpart || !currentLesson) return;
    await markSubpartCompleted(currentSubpart.id);
    const allSubparts = lessons.flatMap((lesson) =>
      lesson.subparts.map((subpart) => ({ ...subpart, lessonId: lesson.id, lessonTitle: lesson.title }))
    );
    const currentIndex = allSubparts.findIndex((item) => item.id === currentSubpart.id);
    if (currentIndex < allSubparts.length - 1) {
      const next = allSubparts[currentIndex + 1];
      const nextLesson = lessons.find((l) => l.id === next.lessonId);
      setCurrentLesson(nextLesson);
      setCurrentSubpart(next);
      setExpandedLessons((prev) => ({ ...prev, [next.lessonId]: true }));
      setVideoError(false);
       setVideoStartTime(null); 
    }
  };

  const hasNextSubpart = () => {
    if (!currentSubpart) return false;
    const allSubparts = lessons.flatMap((lesson) => lesson.subparts);
    const currentIndex = allSubparts.findIndex((s) => s.id === currentSubpart.id);
    return currentIndex < allSubparts.length - 1;
  };

  const handleStartQuiz = () => {
    setShowQuizModal(true);
  };

  const handleCloseQuiz = () => {
    setShowQuizModal(false);
  };

  const handleViewLab = () => {
    if (labGuide?.pdf_url) {
      window.open(labGuide.pdf_url, "_blank");
    }
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  if (isLoading) return <div className={styles.view}>جاري تحميل الدورة...</div>;
  if (error) return <div className={styles.view}>{error}</div>;

  return (
    <>
      <div className={`${styles.view} ${styles.active}`}>
        <div className={styles.courseContainer}>
          <div className={styles.courseSidebar} dir={isRTL ? 'rtl' : 'ltr'}>
            <button className={styles.backBtn} onClick={() => router.push("/dashboard")}>
              <i className="fas fa-arrow-right"></i> العودة للدورات
            </button>
            <div className={styles.courseInfo}>
              <h3>Microsoft Azure Fundamentals (AZ-900)</h3>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <span>{progress}% مكتمل</span>
            </div>
            <div className={styles.lessonsList}>
              {lessons.map((lesson) => (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div
                    className={styles.lessonHeader}
                    onClick={() => toggleLesson(lesson.id)}
                    role="button"
                    aria-expanded={expandedLessons[lesson.id] || false}
                    aria-controls={`subparts-${lesson.id}`}
                  >
                    <i className={`fas ${lesson.completed ? "fa-check-circle" : "fa-circle"}`}></i>
                    <h4>{lesson.title}</h4>
                    <i
                      className={`fas ${expandedLessons[lesson.id] ? "fa-chevron-down" : "fa-chevron-right"} ${
                        styles.toggleIcon
                      }`}
                    ></i>
                  </div>
                  {expandedLessons[lesson.id] && (
                    <ul id={`subparts-${lesson.id}`}>
                      {lesson.subparts.map((subpart) => (
                        <li
                          key={subpart.id}
                          className={`${styles.subpartItem} ${currentSubpart?.id === subpart.id ? styles.active : ""}`}
                          onClick={() => handleSubpartClick(subpart, lesson)}
                        >
                          <div className={styles.subpartContent}>
                            <i
                              className={`fas ${
                                subpart.completed
                                  ? "fa-check-circle"
                                  : subpart.isQuiz
                                  ? "fa-question-circle"
                                  : "fa-play-circle"
                              }`}
                            ></i>
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
          <div className={styles.courseContent} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={styles.videoPlayer}>
              {currentSubpart && currentSubpart.videoUrl ? (
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
                    onPlay={() => console.log(`Video started: ${currentSubpart.title}`)}
                    onEnded={() => console.log(`Video ended: ${currentSubpart.title}`)}
                  >
                    <source src={currentSubpart.videoUrl} type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>
                )
              ) : (
                <div className={styles.videoPlaceholder}>
                  <i className="fas fa-play"></i>
                  <p>{currentSubpart ? currentSubpart.title : "اختر درساً لبدء التعلم"}</p>
                  {currentSubpart && !currentSubpart.videoUrl && (
                    <small>لا يوجد فيديو متاح لهذا الدرس</small>
                  )}
                </div>
              )}
            </div>
            <div className={styles.lessonContent}>
              <h2>{currentSubpart ? currentSubpart.title : "مرحباً بك في الدورة"}</h2>
              <p>
                {currentSubpart
                  ? `تعلم ${currentSubpart.title} في ${currentSubpart.duration}. هذا الدرس جزء من رحلتك لتطوير مهاراتك في Microsoft Azure.`
                  : "اختر درساً من الشريط الجانبي لبدء رحلة التعلم."}
              </p>
              <div className={styles.lessonActions}>
                {currentSubpart?.isQuiz && (
                  <button className={styles.btnPrimary} onClick={handleStartQuiz}>
                    <i className="fas fa-question-circle"></i> خذ الاختبار
                  </button>
                )}
                {labGuide && (
                  <button className={styles.btnPrimary} onClick={handleViewLab} style={{ marginLeft: "10px" }}>
                    <i className="fas fa-flask"></i> عرض المختبر
                  </button>
                )}
                {hasNextSubpart() && (
                  <button className={styles.btnSecondary} onClick={handleNextSubpart}>
                    الدرس التالي
                    <i className="fas fa-arrow-left"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showQuizModal && <QuizModal onClose={handleCloseQuiz} certId={certIdFromParams} />}
    </>
  );
}