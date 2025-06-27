import { useState } from 'react';
import { Trash2, X, AlertTriangle, Loader } from 'lucide-react';
import styles from '@/styles/DeleteConfirmation.module.css';

interface DeleteConfirmationProps {
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  type?: 'certification' | 'quiz' | 'video' | 'lab';
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'certification'
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'certification': return 'var(--error)';
      case 'quiz': return 'var(--warning)';
      case 'video': return 'var(--secondary)';
      case 'lab': return 'var(--primary)';
      default: return 'var(--error)';
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.iconContainer} style={{ backgroundColor: `${getTypeColor()}15` }}>
              <AlertTriangle size={24} style={{ color: getTypeColor() }} />
            </div>
            <button className={styles.closeBtn} onClick={onCancel} disabled={isDeleting}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.body}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.message}>{message}</p>
            {itemName && (
              <div className={styles.itemName}>
                <strong>"{itemName}"</strong>
              </div>
            )}
            <div className={styles.warning}>
              <AlertTriangle size={16} />
              <span>هذا الإجراء لا يمكن التراجع عنه</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.btnSecondary}
              disabled={isDeleting}
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={styles.btnDanger}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader size={16} className={styles.spinner} />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  تأكيد الحذف
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;