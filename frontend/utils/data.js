export const courses = [
  {
    id: 1,
    title: 'أساسيات البرمجة باستخدام Python',
    description: 'تعلم أساسيات البرمجة باستخدام لغة Python من الصفر.',
    duration: '10 ساعات',
    lessonCount: 15,
    progress: 0,
    icon: 'laptop-code',
    lessons: [
      {
        id: 1,
        title: 'مقدمة إلى Python',
        videoUrl: '/videos/sample-video.mp4',
        duration: '30 دقيقة',
        quiz: [
          {
            question: 'ما هو الغرض من print() في Python؟',
            options: ['إدخال البيانات', 'إخراج البيانات', 'حل الحسابات', 'إنشاء متغيرات'],
            correctAnswer: 'إخراج البيانات',
          },
          {
            question: 'ما نوع البيانات التي تمثل الأرقام الصحيحة؟',
            options: ['str', 'int', 'float', 'bool'],
            correctAnswer: 'int',
          },
        ],
      },
      {
        id: 2,
        title: 'المتغيرات والعمليات الحسابية',
        videoUrl: '/videos/sample-video.mp4',
        duration: '45 دقيقة',
        quiz: [],
      },
    ],
  },
  {
    id: 2,
    title: 'تصميم واجهات المستخدم باستخدام Figma',
    description: 'تعلم كيفية تصميم واجهات مستخدم جذابة باستخدام أداة Figma.',
    duration: '8 ساعات',
    lessonCount: 12,
    progress: 0,
    icon: 'palette',
    lessons: [
      {
        id: 1,
        title: 'مقدمة إلى Figma',
        videoUrl: '/videos/sample-video.mp4',
        duration: '25 دقيقة',
        quiz: [],
      },
    ],
  },
];