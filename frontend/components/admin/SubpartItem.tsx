import React from 'react';
import { Play, FileText, Pizza as Quiz, Video, Upload, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Subpart, AdminAction } from '@/types/certification';
import styles from '@/styles/admin/SubpartItem.module.css';

interface SubpartItemProps {
  subpart: Subpart;
  onAdminAction: (action: AdminAction) => void;
  certificationId: string;
}


export default function SubpartItem({ subpart, onAdminAction }: SubpartItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getSubpartIcon = () => {
    if (subpart.isQuiz) return <Quiz size={16} className={styles.quizIcon} />;
    if (subpart.videoUrl) return <Play size={16} className={styles.videoIcon} />;
    return <FileText size={16} className={styles.fileIcon} />;
  };

  const handleAdminAction = (actionType: 'add-video' | 'delete-video' | 'add-lab-guide' | 'delete-lab-guide') => {
    onAdminAction({
      type: actionType,
      targetId: String(subpart.id),
      targetType: 'certification',
      ...(actionType === 'delete-video' && { videoId: subpart.videoUrl || '' }),
      ...(actionType === 'delete-lab-guide' && { labId: subpart.labGuideUrl || '' })
    });
  };

  return (
    <div className={styles.subpartCard}>
      <div
        className={styles.subpartHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.subpartHeaderContent}>
          <div className={styles.subpartLeft}>
            {isExpanded ? <ChevronDown className={styles.chevronIcon} size={16} /> : <ChevronRight className={styles.chevronIcon} size={16} />}
            {getSubpartIcon()}
            <div>
              <h4 className={styles.subpartTitle}>{subpart.title}</h4>
              <p className={styles.subpartDuration}>المدة: {subpart.duration}</p>
            </div>
          </div>
          <div className={styles.subpartRight}>
            {subpart.completed && (
              <span className={`${styles.badge} ${styles.completedBadge}`}>
                مكتمل
              </span>
            )}
            {subpart.isQuiz && (
              <span className={`${styles.badge} ${styles.quizBadge}`}>
                اختبار
              </span>
            )}
            {subpart.videoUrl && (
              <span className={`${styles.badge} ${styles.videoBadge}`}>
                فيديو
              </span>
            )}
            {subpart.labGuideUrl && (
              <span className={`${styles.badge} ${styles.labGuideBadge}`}>
                دليل مختبر
              </span>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
  <div className={styles.expandedContent}>
    <h5 className={styles.adminTitle}>إجراءات الإدارة</h5>
    <div className={styles.actionsGrid}>
      {subpart.videoUrl ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdminAction('delete-video');
          }}
          className={`${styles.actionButton} ${styles.deleteVideoButton}`}
        >
          <Trash2 size={14} />
          حذف الفيديو
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdminAction('add-video');
          }}
          className={`${styles.actionButton} ${styles.addVideoButton}`}
        >
          <Video size={14} />
          إضافة فيديو
        </button>
      )}
      {subpart.labGuideUrl ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdminAction('delete-lab-guide');
          }}
          className={`${styles.actionButton} ${styles.deleteLabGuideButton}`}
        >
          <Trash2 size={14} />
          حذف دليل المختبر
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdminAction('add-lab-guide');
          }}
          className={`${styles.actionButton} ${styles.addLabGuideButton}`}
        >
          <Upload size={14} />
          إضافة دليل مختبر
        </button>
      )}
    </div>

    {subpart.videoUrl && (
      <div className={styles.videoPreview}>
        <video
          controls
          src={subpart.videoUrl}
          style={{ maxWidth: '100%', marginTop: '0.5rem' }}
        />
      </div>
    )}

    {subpart.labGuideUrl && (
      <div className={styles.labGuideDownload}>
        <a
          href={subpart.labGuideUrl}
          download
          style={{
            color: '#2563eb',
            textDecoration: 'underline',
            marginTop: '0.5rem',
            display: 'inline-block'
          }}
        >
          تحميل دليل المختبر
        </a>
      </div>
    )}
  </div>
)}

    </div>
  );
}