import React, { useState, useEffect } from 'react';
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

export default function QuizModal({ onClose, certId }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmitQuiz = async () => {
    if (!questions[currentQuestion] || selectedAnswers[currentQuestion] === undefined) return;
    try {
      const response = await fetch(`http://localhost:5000/quiz/${questions[currentQuestion].id}/answer`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_option: questions[currentQuestion].options[selectedAnswers[currentQuestion]] }),
      });
      if (response.ok) setShowResults(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  const handleShowCertificate = () => {
    setShowCertificate(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] !== undefined && q.options[selectedAnswers[index]].toLowerCase() === q.answer.toLowerCase()) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (isLoading) return <div className={styles.modal}>جاري تحميل الاختبار...</div>;
  if (error) return <div className={styles.modal}>{error}</div>;

  if (showCertificate) {
    return (
      <div className={`${styles.modal} ${styles.active}`}>
        <div className={styles.modalContent}>
          <div className={styles.certificateHeader}>
            <h2>شهادة الإنجاز</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className={styles.certificateBody}>
            <div className={styles.certificate}>
              <div className={styles.certificateBorder}>
                <div className={styles.certificateInner}>
                  <div className={styles.certificateLogo}>
                    <i className="fas fa-award"></i>
                    <h1>شهادة إنجاز</h1>
                  </div>
                  <p className={styles.certificateText}>هذا يشهد أن</p>
                  <div className={styles.studentName}>الطالب المتميز</div>
                  <p className={styles.certificateText}>قد أكمل بنجاح دورة</p>
                  <div className={styles.courseName}>Microsoft Azure Fundamentals (AZ-900)</div>
                  <div className={styles.certificateDetails}>
                    <p>تاريخ الإنجاز: {new Date().toLocaleDateString('ar-SA')}</p>
                    <p>النتيجة: {calculateScore()}%</p>
                  </div>
                  <div className={styles.certificateSignature}>
                    <div className={styles.signatureLine}>
                      <p>مدير التدريب</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.certificateActions}>
              <button className={styles.btnSecondary} onClick={() => setShowCertificate(false)}>
                العودة للنتائج
              </button>
              <button className={styles.btnPrimary} onClick={() => window.print()}>
                <i className="fas fa-print"></i> طباعة الشهادة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className={`${styles.modal} ${styles.active}`}>
        <div className={styles.modalContent}>
          <div className={styles.resultsHeader}>
            <h2>نتائج الاختبار</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className={styles.resultsBody}>
            <div className={styles.scoreDisplay}>
              <div className={styles.scoreCircle}>{score}%</div>
              <h3>{score >= 70 ? 'مبروك! لقد نجحت' : 'للأسف، لم تنجح'}</h3>
              <p>
                {score >= 70
                  ? 'لقد أكملت الاختبار بنجاح وحصلت على الشهادة'
                  : 'تحتاج إلى 70% على الأقل للنجاح. حاول مرة أخرى'}
              </p>
            </div>
            <div className={styles.resultsActions}>
              <button className={styles.btnSecondary} onClick={onClose}>
                إغلاق
              </button>
              {score >= 70 && (
                <button className={styles.btnSuccess} onClick={handleShowCertificate}>
                  <i className="fas fa-certificate"></i> احصل على الشهادة
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className={styles.quizProgressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <span>السؤال {currentQuestion + 1} من {questions.length}</span>
          </div>
          <div className={styles.questionContainer}>
            <h3>{questions[currentQuestion]?.question || 'لا يوجد سؤال'}</h3>
            <div className={styles.optionsContainer}>
              {questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${selectedAnswers[currentQuestion] === index ? styles.selected : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={selectedAnswers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(index)}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.quizActions}>
            <button
              className={styles.btnSecondary}
              onClick={handlePrevQuestion}
              disabled={isFirstQuestion}
            >
              السابق
            </button>
            {isLastQuestion ? (
              <button
                className={styles.btnPrimary}
                onClick={handleSubmitQuiz}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                إرسال الاختبار
              </button>
            ) : (
              <button
                className={styles.btnPrimary}
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                السؤال التالي
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}