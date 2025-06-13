import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBook } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/CourseCard.module.css';

export default function CourseCard({ course }) {
  const router = useRouter();

  const startCourse = () => {
    console.log(`Starting course with ID: ${course.id} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    router.push(`/course/${course.id}?lesson=1`);
  };

  return (
    <div className={styles.courseCard}>
      <div className={styles.courseImage}>
        <FontAwesomeIcon icon={`fas fa-${course.icon || 'laptop-code'}`} />
      </div>
      <div className={styles.courseContent}>
        <h3 className={styles.courseTitle}>{course.title}</h3>
        <p className={styles.courseDescription}>{course.description}</p>
        <div className={styles.courseMeta}>
          <span className={styles.courseDuration}>
            <FontAwesomeIcon icon={faClock} />
            {course.duration}
          </span>
          <span className={styles.courseLessons}>
            <FontAwesomeIcon icon={faBook} />
            {course.lessonCount} دروس
          </span>
        </div>
        <div className={styles.courseProgress}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>
        <button className={styles.courseCta} onClick={startCourse}>
          {course.progress > 0 ? 'متابعة الدورة' : 'ابدأ الدورة'}
        </button>
      </div>
    </div>
  );
}