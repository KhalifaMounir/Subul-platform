import React, { useState } from 'react'
import styles from '@/styles/Quiz.module.css'

interface QuizModalProps {
  onClose: () => void
}

export default function QuizModal({ onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  const questions = [
    {
      id: 1,
      question: "ما هي الحوسبة السحابية؟",
      options: [
        "تقنية لتخزين البيانات محلياً",
        "تقديم خدمات الحوسبة عبر الإنترنت",
        "نوع من أنواع الشبكات المحلية",
        "برنامج لإدارة قواعد البيانات"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "ما هي إحدى فوائد Microsoft Azure؟",
      options: [
        "التكلفة الثابتة فقط",
        "المرونة والقابلية للتوسع",
        "يعمل فقط مع Windows",
        "لا يحتاج إلى اتصال بالإنترنت"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "ما هو Azure Virtual Machine؟",
      options: [
        "خدمة تخزين البيانات",
        "خدمة الحوسبة السحابية",
        "نظام إدارة قواعد البيانات",
        "خدمة الشبكات"
      ],
      correctAnswer: 1
    }
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const handleShowCertificate = () => {
    setShowCertificate(true)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const isLastQuestion = currentQuestion === questions.length - 1
  const isFirstQuestion = currentQuestion === 0
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Certificate view
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
                <i className="fas fa-print"></i>
                طباعة الشهادة
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results view
  if (showResults) {
    const score = calculateScore()
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
              <div className={styles.scoreCircle}>
                {score}%
              </div>
              <h3>{score >= 70 ? 'مبروك! لقد نجحت' : 'للأسف، لم تنجح'}</h3>
              <p>
                {score >= 70 
                  ? 'لقد أكملت الاختبار بنجاح وحصلت على الشهادة'
                  : 'تحتاج إلى 70% على الأقل للنجاح. حاول مرة أخرى'
                }
              </p>
            </div>
            <div className={styles.resultsActions}>
              <button className={styles.btnSecondary} onClick={onClose}>
                إغلاق
              </button>
              {score >= 70 && (
                <button className={styles.btnSuccess} onClick={handleShowCertificate}>
                  <i className="fas fa-certificate"></i>
                  احصل على الشهادة
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz view
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
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span>السؤال {currentQuestion + 1} من {questions.length}</span>
          </div>
          
          <div className={styles.questionContainer}>
            <h3>{questions[currentQuestion].question}</h3>
            <div className={styles.optionsContainer}>
              {questions[currentQuestion].options.map((option, index) => (
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
  )
}