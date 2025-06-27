import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AddQuiz from '@/components/admin/add_quiz';

export default function AdminQuiz() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { cert_id } = router.query;

  useEffect(() => {
    setIsModalOpen(true); // Open modal on page load
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isNext: boolean = false) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate inputs
    if (!question || options.some(opt => !opt) || !answer) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Validate answer is one of the options
    if (!options.includes(answer)) {
      setError('الإجابة يجب أن تكون واحدة من الخيارات');
      return;
    }

    if (!cert_id) {
      setError('معرف الشهادة غير متوفر');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/admin/certifications/${cert_id}/quiz`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ question, options, answer }),
      });

      // Check for non-JSON response
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('تم استلام استجابة غير متوقعة من الخادم');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشل في إضافة السؤال');
      }

      console.log('Quiz added:', data);
      setError(null);

      if (isNext) {
        // Reset form for next question
        setQuestion('');
        setOptions(['', '', '']);
        setAnswer('');
      } else {
        handleClose();
      }
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'حدث خطأ أثناء إضافة السؤال';
      console.error('Fetch error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuestion('');
    setOptions(['', '', '']);
    setAnswer('');
    setError(null);
    setIsModalOpen(false);
  };

  // Ensure cert_id is a number
  const certIdNumber = typeof cert_id === 'string' ? parseInt(cert_id, 10) : undefined;

  if (!certIdNumber || isNaN(certIdNumber)) {
    return <div>معرف الشهادة غير صالح</div>;
  }

  return (
    <>
      {isModalOpen && (
        <AddQuiz
          cert_id={certIdNumber}
          question={question}
          options={options}
          answer={answer}
          error={error}
          isSubmitting={isSubmitting}
          onQuestionChange={setQuestion}
          onOptionChange={handleOptionChange}
          onAnswerChange={setAnswer}
          onAddOption={handleAddOption}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </>
  );
}