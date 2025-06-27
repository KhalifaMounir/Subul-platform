import styles from '@/styles/add_quiz.module.css';

interface AddQuizProps {
  cert_id: number;
  question: string;
  options: string[];
  answer: string;
  error: string | null;
  isSubmitting: boolean;
  onQuestionChange: (value: string) => void;
  onOptionChange: (index: number, value: string) => void;
  onAnswerChange: (value: string) => void;
  onAddOption: () => void;
  onSubmit: (e: React.FormEvent, isNext: boolean) => void;
  onClose: () => void;
}

const AddQuiz: React.FC<AddQuizProps> = ({
  cert_id,
  question,
  options,
  answer,
  error,
  isSubmitting,
  onQuestionChange,
  onOptionChange,
  onAnswerChange,
  onAddOption,
  onSubmit,
  onClose,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.certificationHeader}>
            <h2>إضافة سؤال جديد</h2>
            <button className={styles.closeBtn} onClick={onClose} disabled={isSubmitting}>
              ×
            </button>
          </div>
          <div className={styles.certificationBody}>
            <form onSubmit={(e) => onSubmit(e, false)}>
              <div className={styles.formGroup}>
                <label htmlFor="question">السؤال</label>
                <input
                  type="text"
                  id="question"
                  value={question}
                  onChange={(e) => onQuestionChange(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              {options.map((option, index) => (
                <div className={styles.formGroup} key={index}>
                  <label htmlFor={`option${index}`}>الخيار {index + 1}</label>
                  <input
                    type="text"
                    id={`option${index}`}
                    value={option}
                    onChange={(e) => onOptionChange(index, e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              ))}
              {options.length < 4 && (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={onAddOption}
                  disabled={isSubmitting}
                >
                  إضافة خيار آخر
                </button>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="answer">الإجابة</label>
                <input
                  type="text"
                  id="answer"
                  value={answer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {error && <div className={styles.errorMessage}>{error}</div>}
              </div>
              <div className={styles.certificationActions}>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? 'جارٍ الإضافة...' : 'إضافة السؤال'}
                </button>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={(e) => onSubmit(e, true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جارٍ الإضافة...' : 'التالي'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;