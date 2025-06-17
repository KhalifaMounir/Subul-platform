import { ViewType } from '@/utils/types'
import { certificateActions } from '@/utils/actions'
import styles from '@/styles/Modal.module.css'

interface CertificateModalProps {
  showView: (viewName: ViewType) => void
}

export default function CertificateModal({ showView }: CertificateModalProps) {
  return (
    <div className={styles.modal}>
      <div className={`${styles.modalContent} ${styles.certificateContent}`}>
        <div className={styles.certificateHeader}>
          <h2>شهادة إتمام الدورة</h2>
          <button className={styles.closeBtn} onClick={() => showView('dashboard')}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.certificateBody}>
          <div className={styles.certificate}>
            <div className={styles.certificateBorder}>
              <div className={styles.certificateInner}>
                <div className={styles.certificateLogo}>
                  <i className="fas fa-graduation-cap"></i>
                  <h1>سبل</h1>
                </div>
                <h2>شهادة إتمام</h2>
                <p className={styles.certificateText}>هذا يشهد أن</p>
                <h3 className={styles.studentName}>الطالب</h3>
                <p className={styles.certificateText}>قد أتم بنجاح دورة</p>
                <h3 className={styles.courseName}>اسم الدورة</h3>
                <div className={styles.certificateDetails}>
                  <p>تاريخ الإتمام: <span></span></p>
                  <p>الدرجة النهائية: <span></span></p>
                </div>
                <div className={styles.certificateSignature}>
                  <div className={styles.signatureLine}>
                    <p>منصة سبل للتعلم الإلكتروني</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.certificateActions}>
            <button className={styles.btnPrimary} onClick={certificateActions.downloadCertificate}>
              <i className="fas fa-download"></i>
              تحميل الشهادة
            </button>
            <button className={styles.btnSecondary} onClick={certificateActions.printCertificate}>
              <i className="fas fa-print"></i>
              طباعة الشهادة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}