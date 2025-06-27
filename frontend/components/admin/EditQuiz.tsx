import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Loader } from 'lucide-react';
import styles from '@/styles/EditQuiz.module.css';

interface EditQuizProps {
  certId: number;
  quizId: number;
  initialData?: {
    question: string;
    options: string[];
    answer: string;
  };
  onClose: () => void;
  onSuccess: (quiz: any) => void;
  error: string | null;
}

const EditQuiz: React.FC<EditQuizProps> = ({ 
  certId, 
  quizId, 
  initialData, 
  onClose, 
  onSuccess, 
  error 
}) => {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [options, setOptions] = useState<string[]>(initialData?.options || ['', '', '']);
  const [answer, setAnswer] = useState(initialData?.answer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question);
      setOptions(initialData.options);
      setAnswer(initialData.answer);
    }
  }, [initialData]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Update answer if it was the option being changed
    if (answer === options[index]) {
      setAnswer(value);
    }
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      
      // Reset answer if it was the removed option
      if (answer === options[index]) {
        setAnswer('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (!question.trim()) {
      setUpdateError('يرجى إدخال السؤال');
      return;
    }
    
    if (validOptions.length < 2) {
      setUpdateError('يجب إدخال خيارين على الأقل');
      return;
    }
    
    if (!answer.trim()) {
      setUpdateError('يرجى اختيار الإجابة الصحيحة');
      return;
    }

    if (!validOptions.includes(answer)) {
      setUpdateError('الإجابة الصحيحة يجب أن تكون من ضمن الخيارات');
      return;
    }

    setIsSubmitting(true);
    setUpdateError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/admin/certifications/${certId}/quiz/${quizId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: question.trim(), 
          options: validOptions, 
          answer: answer.trim() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'فشل في تحديث السؤال' }));
        throw new Error(errorData.error || 'فشل في تحديث السؤال');
      }

      const data = await response.json();
      onSuccess(data);
      handleClose();
    } catch (error: any) {
      console.error('Update error:', error);
      setUpdateError(error.message || 'حدث خطأ أثناء تحديث السؤال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUpdateError(null);
    onClose();
  };

  const validOptions = options.filter(opt => opt.trim() !== '');

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <h2>تعديل السؤال</h2>
            <button className={styles.closeBtn} onClick={handleClose} disabled={isSubmitting}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.body}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="question">السؤال</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="اكتب السؤال هنا..."
                  required
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.optionsHeader}>
                  <label>الخيارات</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className={styles.addOptionBtn}
                    disabled={options.length >= 6 || isSubmitting}
                  >
                    <Plus size={16} />
                    إضافة خيار
                  </button>
                </div>
                
                <div className={styles.optionsContainer}>
                  {options.map((option, index) => (
                    <div key={index} className={styles.optionRow}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`الخيار ${index + 1}`}
                        className={styles.optionInput}
                        disabled={isSubmitting}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className={styles.removeOptionBtn}
                          disabled={isSubmitting}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="answer">الإجابة الصحيحة</label>
                <select
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  className={styles.answerSelect}
                  disabled={isSubmitting}
                >
                  <option value="">اختر الإجابة الصحيحة</option>
                  {validOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {(error || updateError) && (
                <div className={styles.errorMessage}>
                  {error || updateError}
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
                  disabled={!question.trim() || validOptions.length < 2 || !answer.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className={styles.spinner} />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      حفظ التغييرات
                    </>
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

export default EditQuiz;