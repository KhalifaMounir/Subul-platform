import React from 'react';
import { BookOpen, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Lesson, AdminAction } from '@/types/certification';
import SubpartItem from './SubpartItem';
import styles from '@/styles/admin/LessonItem.module.css';

interface LessonItemProps {
  lesson: Lesson;
  onAdminAction: (action: AdminAction) => void;
}

export default function LessonItem({ lesson, onAdminAction }: LessonItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

const handleAddSubpart = () => {
  onAdminAction({
    type: 'add-subpart',
    targetId: lesson.id.toString(),
    targetType: 'lesson',
  });
};


  // Only the header is clickable for expand/collapse, not the whole card
  return (
    <div className={styles.lessonCard}>
      <div
        className={styles.lessonHeader}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded((prev) => !prev);
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }
        }}
      >
        <div className={styles.lessonHeaderContent}>
          <div className={styles.lessonLeft}>
            {isExpanded ? (
              <ChevronDown className={styles.chevronIcon} size={18} />
            ) : (
              <ChevronRight className={styles.chevronIcon} size={18} />
            )}
            <BookOpen size={18} className={styles.lessonIcon} />
            <div>
              <h3 className={styles.lessonTitle}>{lesson.title}</h3>
              <p className={styles.lessonSubtitle}>
                {lesson.subparts.length} جزء فرعي
              </p>
            </div>
          </div>
          <div className={styles.lessonRight}>
            {lesson.completed && (
              <span className={styles.completedBadge}>مكتمل</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddSubpart();
              }}
              className={styles.addSubpartButton}
            >
              <Plus size={14} /> إضافة جزء فرعي
            </button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.subpartsContainer}>
            {lesson.subparts.length === 0 ? (
              <div className={styles.emptySubparts}>
                <BookOpen size={32} className={styles.lessonIcon} />
                <p className={styles.emptySubpartsText}>
                  لا توجد أجزاء فرعية بعد. أضف أول جزء فرعي أعلاه.
                </p>
              </div>
            ) : (
              lesson.subparts.map((subpart) => (
              <SubpartItem
                key={subpart.id}
                subpart={subpart}
                onAdminAction={onAdminAction}
                certificationId={lesson.certificationId.toString()} 
              />

              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}