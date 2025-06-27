import { useState } from 'react';
import styles from '@/styles/add_certification.module.css';

interface AddCertificationProps {
  onClose: () => void;
  onSubmit: (certName: string) => void;
  error: string | null;
}

const AddCertification: React.FC<AddCertificationProps> = ({ onClose, onSubmit, error }) => {
  const [certName, setCertName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(certName);
  };

  const handleClose = () => {
    setCertName('');
    onClose();
  };

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.certificationHeader}>
            <h2>إضافة شهادة جديدة</h2>
            <button className={styles.closeBtn} onClick={handleClose}>
              ×
            </button>
          </div>
          <div className={styles.certificationBody}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="certName">اسم الشهادة</label>
                <input
                  type="text"
                  id="certName"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  required
                />
                {error && <div className={styles.errorMessage}>{error}</div>}
              </div>
              <div className={styles.certificationActions}>
                <button type="submit" className={styles.btnPrimary}>
                  إضافة الشهادة
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCertification;