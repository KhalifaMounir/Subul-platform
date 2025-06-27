import { useState, useEffect } from 'react';
import { FileText, X, Download, Eye, Loader, AlertCircle } from 'lucide-react';
import styles from '@/styles/ViewLabGuide.module.css';

interface ViewLabGuideProps {
  certId: number;
  onClose: () => void;
}

const ViewLabGuide: React.FC<ViewLabGuideProps> = ({ certId, onClose }) => {
  const [labGuide, setLabGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLabGuide();
  }, [certId]);

  const fetchLabGuide = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/admin/certifications/${certId}/lab`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('لا يوجد دليل مختبر لهذه الشهادة');
        } else {
          const errorData = await response.json().catch(() => ({ error: 'فشل في تحميل دليل المختبر' }));
          throw new Error(errorData.error || 'فشل في تحميل دليل المختبر');
        }
        return;
      }

      const data = await response.json();
      setLabGuide(data);
    } catch (error: any) {
      console.error('Fetch error:', error);
      setError(error.message || 'حدث خطأ أثناء تحميل دليل المختبر');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (labGuide?.pdf_url) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = labGuide.pdf_url;
      link.download = `lab-guide-${certId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleView = () => {
    if (labGuide?.pdf_url) {
      window.open(labGuide.pdf_url, '_blank');
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <h2>دليل المختبر</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.body}>
            {loading ? (
              <div className={styles.loadingState}>
                <Loader size={48} className={styles.spinner} />
                <p>جاري تحميل دليل المختبر...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <AlertCircle size={48} className={styles.errorIcon} />
                <h3>غير متوفر</h3>
                <p>{error}</p>
              </div>
            ) : labGuide ? (
              <div className={styles.content}>
                <div className={styles.filePreview}>
                  <div className={styles.fileIcon}>
                    <FileText size={48} />
                  </div>
                  <div className={styles.fileInfo}>
                    <h3>دليل المختبر متوفر</h3>
                    <p>اضغط على أحد الأزرار أدناه لعرض أو تحميل الدليل</p>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    onClick={handleView}
                    className={styles.btnPrimary}
                  >
                    <Eye size={16} />
                    عرض الدليل
                  </button>
                  <button
                    onClick={handleDownload}
                    className={styles.btnSecondary}
                  >
                    <Download size={16} />
                    تحميل
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <FileText size={48} className={styles.emptyIcon} />
                <h3>لا يوجد دليل مختبر</h3>
                <p>لم يتم رفع دليل مختبر لهذه الشهادة بعد</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLabGuide;