import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader } from 'lucide-react';
import styles from '@/styles/AddLabGuide.module.css';

interface AddLabGuideProps {
  onClose: () => void;
  onUpload: (file: File, certName: string) => void;
  error: string | null;
  isSubmitting: boolean;
}

const AddLabGuide: React.FC<AddLabGuideProps> = ({ onClose, onUpload, error, isSubmitting }) => {
  const [file, setFile] = useState<File | null>(null);
  const [certName, setCertName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setUploadError(null);
      } else {
        setUploadError('يرجى اختيار ملف PDF فقط');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setUploadError(null);
      } else {
        setUploadError('يرجى اختيار ملف PDF فقط');
      }
    }
  };

  const handleCertNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !certName.trim() || isSubmitting) return;
    onUpload(file, certName);
  };

  const handleClose = () => {
    setFile(null);
    setCertName('');
    setUploadError(null);
    onClose();
  };

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <h2>إضافة دليل مختبر</h2>
            <button
              className={styles.closeBtn}
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="إغلاق النافذة"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.body}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="certName" className={styles.label}>
                  اسم الشهادة
                </label>
                <input
                  id="certName"
                  type="text"
                  value={certName}
                  onChange={handleCertNameChange}
                  className={styles.input}
                  placeholder="أدخل اسم الشهادة"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div
                className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="رفع ملف PDF أو اسحبه هنا"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className={styles.hiddenInput}
                  disabled={isSubmitting}
                  aria-hidden="true"
                />
                <div className={styles.uploadContent}>
                  {file ? (
                    <>
                      <FileText size={48} className={styles.fileIcon} />
                      <p className={styles.fileName}>{file.name}</p>
                      <p className={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={48} className={styles.uploadIcon} />
                      <p className={styles.uploadText}>
                        اسحب وأفلت ملف PDF هنا أو انقر للتحديد
                      </p>
                      <p className={styles.uploadSubtext}>
                        يدعم ملفات PDF فقط (حتى 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {file && (
                <div className={styles.filePreview}>
                  <div className={styles.fileInfo}>
                    <FileText size={20} />
                    <span>{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className={styles.removeFile}
                    disabled={isSubmitting}
                    aria-label={`إزالة الملف ${file.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {(error || uploadError) && (
                <div className={styles.errorMessage}>
                  {error || uploadError}
                </div>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={handleClose}
                  className={styles.btnSecondary}
                  disabled={isSubmitting}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={!file || !certName.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className={styles.spinner} />
                      جاري الرفع...
                    </>
                  ) : (
                    'رفع الدليل'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLabGuide;