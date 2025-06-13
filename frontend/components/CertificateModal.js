import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGraduationCap, faDownload, faPrint } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Modal.module.css';
import { downloadCertificate, printCertificate } from '../utils/certificate';

export default function CertificateModal({ certificate, setShowCertificateModal }) {
  const closeCertificate = () => {
    console.log('Closing certificate modal at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    setShowCertificateModal(false);
  };

  return (
    <div className={`${styles.modal} ${styles.active}`}>
      <div className={styles.modalContent}>
        <div className={styles.certificateHeader}>
          <h2>شهادة إتمام الدورة</h2>
          <button className={styles.closeBtn} onClick={closeCertificate}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles.certificateBody}>
          <div className={styles.certificate}>
            <div className={styles.certificateBorder}>
              <div className={styles.certificateInner}>
                <div className={styles.certificateLogo}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <h1>سبل</h1>
                </div>
                <h2>شهادة إتمام</h2>
                <p className={styles.certificateText}>هذا يشهد أن</p>
                <h3 className={styles.studentName}>{certificate.studentName}</h3>
                <p className={styles.certificateText}>قد أتم بنجاح دورة</p>
                <h3 className={styles.courseName}>{certificate.courseName}</h3>
                <div className={styles.certificateDetails}>
                  <p>تاريخ الإتمام: {certificate.completionDate}</p>
                  <p>الدرجة النهائية: {certificate.score}%</p>
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
            <button className={styles.btnPrimary} onClick={() => downloadCertificate(certificate)}>
              <FontAwesomeIcon icon={faDownload} />
              تحميل الشهادة
            </button>
            <button className={styles.btnSecondary} onClick={() => printCertificate(certificate)}>
              <FontAwesomeIcon icon={faPrint} />
              طباعة الشهادة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}