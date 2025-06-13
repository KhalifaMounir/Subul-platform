const courses = [
  {
    id: 1,
    title: 'أساسيات البرمجة باستخدام Python',
    description: 'تعلم البرمجة باستخدام Python لتطوير تطبيقات الويب والذكاء الاصطناعي، مما يعزز فرصك الوظيفية.',
    duration: '4 ساعات',
    lessonCount: 8,
    progress: 0,
    icon: 'laptop-code',
    lessons: [
      {
        id: 1,
        title: 'مقدمة إلى Python',
        duration: '30 دقيقة',
        completed: false,
        videoUrl: 'static/videos/sample-video.mp4',

        quizzes: [
          {
            id: 1,
            question: 'ما هي لغة Python؟',
            options: ['لغة برمجة', 'لغة تصميم', 'لغة استعلام', 'لغة ترميز'],
            correctAnswer: 'لغة برمجة',
          },
          {
            id: 2,
            question: 'ما هو الإصدار الحالي لـ Python؟',
            options: ['2.x', '3.x', '4.x', '5.x'],
            correctAnswer: '3.x',
          },
        ],
      },
      {
        id: 2,
        title: 'المتغيرات والأنواع',
        duration: '45 دقيقة',
        completed: false,
        quizzes: [
          {
            id: 1,
            question: 'ما نوع البيانات لـ "Hello"?',
            options: ['عدد صحيح', 'سلسلة نصية', 'قائمة', 'قاموس'],
            correctAnswer: 'سلسلة نصية',
          },
        ],
      },
      { id: 3, title: 'الحلقات والشروط', duration: '40 دقيقة', completed: false, quizzes: [] },
    ],
  },
  {
    id: 2,
    title: 'تصميم واجهات المستخدم باستخدام Figma',
    description: 'إتقان تصميم واجهات مستخدم جذابة لتحسين تجربة المستخدم في مشاريع التقنية.',
    duration: '6 ساعات',
    lessonCount: 10,
    progress: 20,
    icon: 'palette',
    lessons: [
      {
        id: 1,
        title: 'مقدمة إلى Figma',
        duration: '25 دقيقة',
        completed: true,
        quizzes: [
          {
            id: 1,
            question: 'ما هو Figma؟',
            options: ['أداة برمجة', 'أداة تصميم', 'أداة تحرير فيديو', 'أداة تحليل'],
            correctAnswer: 'أداة تصميم',
          },
        ],
      },
      { id: 2, title: 'تصميم الواجهات', duration: '50 دقيقة', completed: false, quizzes: [] },
      { id: 3, title: 'التحريك في Figma', duration: '35 دقيقة', completed: false, quizzes: [] },
    ],
  },
  {
    id: 3,
    title: 'إدارة الأعمال الحديثة',
    description: 'اكتسب مهارات قيادة الفرق وإدارة المشاريع للتميز في سوق العمل.',
    duration: '5 ساعات',
    lessonCount: 7,
    progress: 0,
    icon: 'briefcase',
    lessons: [
      {
        id: 1,
        title: 'مبادئ الإدارة',
        duration: '40 دقيقة',
        completed: false,
        quizzes: [
          {
            id: 1,
            question: 'ما هو دور المدير؟',
            options: ['كتابة البرامج', 'قيادة الفريق', 'تصميم الواجهات', 'تحليل البيانات'],
            correctAnswer: 'قيادة الفريق',
          },
        ],
      },
      { id: 2, title: 'إدارة الوقت', duration: '45 دقيقة', completed: false, quizzes: [] },
      { id: 3, title: 'اتخاذ القرارات', duration: '50 دقيقة', completed: false, quizzes: [] },
    ],
  },
];