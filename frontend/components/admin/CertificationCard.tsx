import React from 'react';
import { Certification, AdminAction } from '@/types/certification';
import SubpartItem from './SubpartItem';
import LessonItem from './LessonItem';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import styles from '@/styles/admin/CertificationCard.module.css';

interface CertificationCardProps {
  certification: Certification;
  onAdminAction: (action: AdminAction) => void;
}

export default function CertificationCard({ certification, onAdminAction }: CertificationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={styles.certificationCard}>
      <div
        className={styles.certificationHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            {isExpanded ? (
              <ChevronDown className={styles.chevronIcon} size={20} />
            ) : (
              <ChevronRight className={styles.chevronIcon} size={20} />
            )}
            <h3 className={styles.certificationTitle}>{certification.name}</h3>
          </div>
          <button
  onClick={async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/admin/certifications/${certification.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        onAdminAction({
          type: 'delete-certification',
          targetId: certification.id,
          targetType: 'certification',
        });
      } else {
        const data = await res.json();
        alert(data.error || 'فشل حذف الشهادة');
      }
    } catch (err) {
      alert('حدث خطأ أثناء حذف الشهادة');
    }
  }}
  className={`${styles.actionButton} ${styles.deleteButton}`}
  aria-label={`حذف الشهادة ${certification.name}`}
>
  <Trash2 size={14} />
  حذف الشهادة
</button>

        </div>
      </div>
      {isExpanded && (
        <div className={styles.lessons}>
          {certification.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              onAdminAction={onAdminAction}
            />
          ))}
          <button
            onClick={() =>
              onAdminAction({
                type: 'add-lesson',
                targetId: certification.id,
                targetType: 'certification',
              })
            }
            className={`${styles.actionButton} ${styles.addButton}`}
            style={{
              margin: '0.75rem auto 0',
              display: 'block',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.35rem 0.85rem',
              fontWeight: 500,
              fontSize: '0.92rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
          >
            إضافة درس
          </button>
        </div>
      )}
    </div>
  );
}