import { useState, useRef } from 'react';
import { Upload, Video, X, Loader } from 'lucide-react';
import styles from '@/styles/AddVideo.module.css';

interface AddVideoProps {
  certId: number;
  onClose: () => void;
  onSuccess: (video: any) => void;
  error: string | null;
}

const AddVideo: React.FC<AddVideoProps> = ({ certId, onClose, onSuccess, error }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
      if (isValidVideoFile(droppedFile)) {
        setFile(droppedFile);
        setUploadError(null);
      } else {
        setUploadError('يرجى اختيار ملف فيديو صالح (MP4, MOV)');
      }
    }
  };

  const isValidVideoFile = (file: File) => {
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const validExtensions = ['.mp4', '.mov', '.avi'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidVideoFile(selectedFile)) {
        setFile(selectedFile);
        setUploadError(null);
      } else {
        setUploadError('يرجى اختيار ملف فيديو صالح (MP4, MOV)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isSubmitting) return;

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setUploadError('حجم الملف يجب أن يكون أقل من 100 ميجابايت');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:5000/admin/certifications/${certId}/video`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'فشل في رفع الفيديو' }));
        throw new Error(errorData.error || 'فشل في رفع الفيديو');
      }

      const data = await response.json();
      onSuccess(data);
      handleClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'حدث خطأ أثناء رفع الفيديو');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadError(null);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <h2>إضافة فيديو تعليمي</h2>
            <button className={styles.closeBtn} onClick={handleClose} disabled={isSubmitting}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.body}>
            <form onSubmit={handleSubmit}>
              <div
                className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp4,.mov,video/*"
                  onChange={handleFileSelect}
                  className={styles.hiddenInput}
                  disabled={isSubmitting}
                />
                
                <div className={styles.uploadContent}>
                  {file ? (
                    <>
                      <Video size={48} className={styles.fileIcon} />
                      <p className={styles.fileName}>{file.name}</p>
                      <p className={styles.fileSize}>
                        {formatFileSize(file.size)}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={48} className={styles.uploadIcon} />
                      <p className={styles.uploadText}>
                        اسحب وأفلت ملف فيديو هنا أو انقر للتحديد
                      </p>
                      <p className={styles.uploadSubtext}>
                        يدعم ملفات MP4 و MOV (حتى 100MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {file && (
                <div className={styles.filePreview}>
                  <div className={styles.fileInfo}>
                    <Video size={20} />
                    <div>
                      <p className={styles.fileNamePreview}>{file.name}</p>
                      <p className={styles.fileSizePreview}>{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className={styles.removeFile}
                    disabled={isSubmitting}
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
                  disabled={!file || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className={styles.spinner} />
                      جاري الرفع...
                    </>
                  ) : (
                    'رفع الفيديو'
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

export default AddVideo;