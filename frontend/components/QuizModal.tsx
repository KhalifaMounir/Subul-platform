import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Quiz.module.css';

interface QuizModalProps {
  onClose: () => void;
  certId: string | null;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

interface SuggestionData {
  message: string;
  subpart_id: number;
  lesson_id: number;
  timestamp: number; // En secondes
}

export default function QuizModal({ onClose, certId }: QuizModalProps) {
  const router = useRouter(); // Hook pour la navigation
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestionData, setSuggestionData] = useState<SuggestionData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!certId) {
      setError('معرف الدورة غير متوفر');
      setIsLoading(false);
      return;
    }
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/quiz/${certId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('فشل جلب الأسئلة');
        const data = await response.json();
        setQuestions(data);
      } catch (err: any) {
        setError(`تعذر تحميل الأسئلة: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [certId]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitAnswer = async () => {
    if (!questions[currentQuestion] || selectedAnswers[currentQuestion] === undefined) return;
    const selectedOption = questions[currentQuestion].options[selectedAnswers[currentQuestion]];
    try {
      const response = await fetch(`http://localhost:5000/quiz/${questions[currentQuestion].id}/answer`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_option: selectedOption }),
      });
      if (!response.ok) throw new Error('فشل إرسال الإجابة');
      const data = await response.json();
      setAnswered(true);

      if (!data.is_correct && data.suggestion) {
        if (typeof data.suggestion === 'object' && data.suggestion !== null) {
            setSuggestionData(data.suggestion as SuggestionData);
            setShowToast(true);
        } else {
             console.warn("Received suggestion as string, expected object:", data.suggestion);
             setSuggestionData(null);
             setShowToast(false);
        }
      } else {
        setSuggestionData(null); 
        setShowToast(false);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
       setSuggestionData(null);
       setShowToast(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSuggestionData(null);
      setShowToast(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswered(false);
      setSuggestionData(null);
      setShowToast(false);
    }
  };

  const handleRedirectToLesson = () => {
    if (suggestionData && certId) { 
      onClose();
      
      const redirectUrl = `/course?cert_id=${certId}&lesson_id=${suggestionData.lesson_id}&subpart_id=${suggestionData.subpart_id}&timestamp=${suggestionData.timestamp}`;
      router.push(redirectUrl);

      setShowToast(false);
      setSuggestionData(null);
    }
  };

  if (isLoading) return <div className={styles.modal}>جاري تحميل الاختبار...</div>;
  if (error) return <div className={styles.modal}>{error}</div>;

  return (
    <div className={`${styles.modal} ${styles.active}`}>
      <div className={styles.modalContent}>
        <div className={styles.quizHeader}>
          <h2>اختبار الدرس</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.quizBody}>
          <div className={styles.quizProgress}>
            <div className={styles.quizProgressBar}>
              <div
                className={styles.quizProgressFill}
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <span>
              السؤال {currentQuestion + 1} من {questions.length}
            </span>
          </div>
          <div className={styles.questionContainer}>
            <h3>{questions[currentQuestion]?.question || 'لا يوجد سؤال'}</h3>
            <div className={styles.optionsContainer}>
              {questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${
                    selectedAnswers[currentQuestion] === index ? styles.selected : ''
                  } ${answered ? (index === selectedAnswers[currentQuestion] ? (option.toLowerCase() === questions[currentQuestion].answer.toLowerCase() ? styles.correct : styles.incorrect) : '') : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={selectedAnswers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(index)}
                    disabled={answered}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.quizActions}>
            <button className={styles.btnSecondary} onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
              السابق
            </button>
            {!answered ? (
              <button
                className={styles.btnPrimary}
                onClick={handleSubmitAnswer}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                className={styles.btnPrimary}
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
              >
                السؤال التالي
              </button>
            )}
          </div>
        </div>
      </div>

      {showToast && suggestionData && (
        <div className={styles.toast}>
          <p>
            <strong>إجابة خاطئة</strong><br />
            {suggestionData.message}
          </p>
          <button
            className={styles.redirectButton} 
            onClick={handleRedirectToLesson}
          >
            انتقل إلى الدرس
          </button>
        </div>
      )}
    </div>
  );
}