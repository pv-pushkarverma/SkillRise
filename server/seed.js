/**
 * Seed script — populates the SkillRise database with demo data.
 * Run: node seed.js
 * Safe to re-run: clears existing seeded collections first.
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './configs/mongodb.js'
import User from './models/User.js'
import Course from './models/Course.js'
import { Purchase } from './models/Purchase.js'
import { CourseProgress } from './models/CourseProgress.js'
import CommunityPost from './models/CommunityPost.js'
import Group from './models/Group.js'
import Reply from './models/Reply.js'
import Quiz from './models/Quiz.js'

// ─── Users ────────────────────────────────────────────────────────────────────

const users = [
  {
    _id: 'user_seed_educator1',
    name: 'Arjun Mehta',
    email: 'arjun@skillrise.dev',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=arjun',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_educator2',
    name: 'Priya Sharma',
    email: 'priya@skillrise.dev',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=priya',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_student1',
    name: 'Rohan Das',
    email: 'rohan@example.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rohan',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_student2',
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sneha',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_student3',
    name: 'Vikram Nair',
    email: 'vikram@example.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vikram',
    enrolledCourses: [],
  },
]

// ─── Courses ──────────────────────────────────────────────────────────────────

const courseData = [
  {
    courseTitle: 'Full-Stack Web Development with React & Node.js',
    courseDescription:
      '<h2>Master modern full-stack development</h2><p>Learn to build production-ready web applications using React 19, Node.js, Express, and MongoDB. This comprehensive course takes you from zero to deploying a complete application.</p><ul><li>React hooks, context, and state management</li><li>RESTful APIs with Express</li><li>MongoDB & Mongoose</li><li>Authentication with JWT</li><li>Deployment with Docker</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    coursePrice: 3999,
    isPublished: true,
    discount: 30,
    educatorId: 'user_seed_educator1',
    courseContent: [
      {
        chapterId: 'ch_react_basics',
        chapterOrder: 1,
        chapterTitle: 'React Fundamentals',
        chapterContent: [
          {
            lectureId: 'lec_jsx',
            lectureTitle: 'JSX and Components',
            lectureDuration: 18,
            lectureUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_hooks',
            lectureTitle: 'useState and useEffect',
            lectureDuration: 24,
            lectureUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_context',
            lectureTitle: 'Context API & useContext',
            lectureDuration: 20,
            lectureUrl: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_node_express',
        chapterOrder: 2,
        chapterTitle: 'Backend with Node.js & Express',
        chapterContent: [
          {
            lectureId: 'lec_express_setup',
            lectureTitle: 'Setting Up Express Server',
            lectureDuration: 16,
            lectureUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_rest_api',
            lectureTitle: 'Building REST APIs',
            lectureDuration: 28,
            lectureUrl: 'https://www.youtube.com/watch?v=pKd0Rpw7O48',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_mongodb',
            lectureTitle: 'MongoDB & Mongoose',
            lectureDuration: 30,
            lectureUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_deployment',
        chapterOrder: 3,
        chapterTitle: 'Deployment & DevOps',
        chapterContent: [
          {
            lectureId: 'lec_docker',
            lectureTitle: 'Dockerizing Your App',
            lectureDuration: 22,
            lectureUrl: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
            isPreviewFree: false,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_ci_cd',
            lectureTitle: 'CI/CD with GitHub Actions',
            lectureDuration: 19,
            lectureUrl: 'https://www.youtube.com/watch?v=R8_veQiYBjI',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
    ],
    courseRatings: [
      { userId: 'user_seed_student1', rating: 5 },
      { userId: 'user_seed_student2', rating: 4 },
    ],
    enrolledStudents: ['user_seed_student1', 'user_seed_student2'],
  },
  {
    courseTitle: 'Data Science & Machine Learning with Python',
    courseDescription:
      '<h2>From data to insights</h2><p>A hands-on introduction to data science using Python. You will work with real datasets, build machine learning models, and visualize results.</p><ul><li>NumPy, Pandas, Matplotlib</li><li>Supervised & unsupervised learning</li><li>scikit-learn pipelines</li><li>Neural network basics with TensorFlow</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    coursePrice: 4499,
    isPublished: true,
    discount: 20,
    educatorId: 'user_seed_educator1',
    courseContent: [
      {
        chapterId: 'ch_python_basics',
        chapterOrder: 1,
        chapterTitle: 'Python for Data Science',
        chapterContent: [
          {
            lectureId: 'lec_numpy',
            lectureTitle: 'NumPy Arrays & Operations',
            lectureDuration: 21,
            lectureUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_pandas',
            lectureTitle: 'Pandas DataFrames',
            lectureDuration: 26,
            lectureUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
      {
        chapterId: 'ch_ml_models',
        chapterOrder: 2,
        chapterTitle: 'Machine Learning Models',
        chapterContent: [
          {
            lectureId: 'lec_linear_reg',
            lectureTitle: 'Linear Regression',
            lectureDuration: 24,
            lectureUrl: 'https://www.youtube.com/watch?v=nk2CQITm_eo',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_classification',
            lectureTitle: 'Classification Algorithms',
            lectureDuration: 29,
            lectureUrl: 'https://www.youtube.com/watch?v=0Lt9w-BxKFQ',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_clustering',
            lectureTitle: 'Clustering with K-Means',
            lectureDuration: 20,
            lectureUrl: 'https://www.youtube.com/watch?v=4b5d3muPQmA',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
    ],
    courseRatings: [
      { userId: 'user_seed_student2', rating: 5 },
      { userId: 'user_seed_student3', rating: 4 },
    ],
    enrolledStudents: ['user_seed_student2', 'user_seed_student3'],
  },
  {
    courseTitle: 'UI/UX Design: From Wireframes to Prototypes',
    courseDescription:
      '<h2>Design products people love</h2><p>Learn the complete UI/UX design process — from user research and wireframing to high-fidelity prototypes in Figma. No prior design experience required.</p><ul><li>Design thinking & user research</li><li>Wireframing & information architecture</li><li>Figma components and auto-layout</li><li>Usability testing</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    coursePrice: 2999,
    isPublished: true,
    discount: 15,
    educatorId: 'user_seed_educator2',
    courseContent: [
      {
        chapterId: 'ch_design_thinking',
        chapterOrder: 1,
        chapterTitle: 'Design Thinking Process',
        chapterContent: [
          {
            lectureId: 'lec_empathize',
            lectureTitle: 'Empathize & Define',
            lectureDuration: 17,
            lectureUrl: 'https://www.youtube.com/watch?v=_r0VX-aU_T8',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_ideate',
            lectureTitle: 'Ideate & Prototype',
            lectureDuration: 22,
            lectureUrl: 'https://www.youtube.com/watch?v=IsNO_XhEtaw',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
      {
        chapterId: 'ch_figma',
        chapterOrder: 2,
        chapterTitle: 'Figma Masterclass',
        chapterContent: [
          {
            lectureId: 'lec_figma_basics',
            lectureTitle: 'Figma Interface & Tools',
            lectureDuration: 25,
            lectureUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_components',
            lectureTitle: 'Components & Variants',
            lectureDuration: 28,
            lectureUrl: 'https://www.youtube.com/watch?v=k74IrUNaJVk',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_prototype',
            lectureTitle: 'Interactive Prototypes',
            lectureDuration: 23,
            lectureUrl: 'https://www.youtube.com/watch?v=iBkXf6u8htI',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
    ],
    courseRatings: [{ userId: 'user_seed_student1', rating: 5 }],
    enrolledStudents: ['user_seed_student1', 'user_seed_student3'],
  },
]

// ─── Community Groups ─────────────────────────────────────────────────────────

const groupData = [
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Discuss HTML, CSS, JavaScript, React, Node.js and everything web.',
    icon: '🌐',
    memberCount: 128,
    postCount: 0,
    createdBy: 'system',
    isOfficial: true,
  },
  {
    name: 'Data Science & AI',
    slug: 'data-science-ai',
    description: 'Machine learning, data analysis, Python, and AI discussions.',
    icon: '🤖',
    memberCount: 94,
    postCount: 0,
    createdBy: 'system',
    isOfficial: true,
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Design systems, Figma tips, user research, and product design.',
    icon: '🎨',
    memberCount: 76,
    postCount: 0,
    createdBy: 'system',
    isOfficial: true,
  },
  {
    name: 'Career & Jobs',
    slug: 'career-jobs',
    description: 'Resume tips, interview prep, job hunting strategies.',
    icon: '💼',
    memberCount: 210,
    postCount: 0,
    createdBy: 'system',
    isOfficial: true,
  },
]

// ─── Main Seed Function ───────────────────────────────────────────────────────

const seed = async () => {
  await connectDB()

  // Clear existing seeded data
  console.log('🧹 Clearing existing seed data...')
  await Promise.all([
    User.deleteMany({ _id: { $regex: /^user_seed_/ } }),
    Course.deleteMany({ educatorId: { $in: ['user_seed_educator1', 'user_seed_educator2'] } }),
    Purchase.deleteMany({ userId: { $regex: /^user_seed_/ } }),
    CourseProgress.deleteMany({ userId: { $regex: /^user_seed_/ } }),
    CommunityPost.deleteMany({ authorId: { $regex: /^user_seed_/ } }),
    Group.deleteMany({ createdBy: 'system' }),
    Reply.deleteMany({ authorId: { $regex: /^user_seed_/ } }),
    Quiz.deleteMany({ courseId: { $exists: true } }),
  ])

  // ── Users
  console.log('👤 Seeding users...')
  const createdUsers = await User.insertMany(users)
  console.log(`   ✓ ${createdUsers.length} users`)

  // ── Courses
  console.log('📚 Seeding courses...')
  const createdCourses = await Course.insertMany(courseData)
  console.log(`   ✓ ${createdCourses.length} courses`)

  const [courseWeb, courseDS, courseUX] = createdCourses

  // ── Update users with enrolled course IDs
  await User.updateOne(
    { _id: 'user_seed_student1' },
    { enrolledCourses: [courseWeb._id, courseUX._id] }
  )
  await User.updateOne(
    { _id: 'user_seed_student2' },
    { enrolledCourses: [courseWeb._id, courseDS._id] }
  )
  await User.updateOne(
    { _id: 'user_seed_student3' },
    { enrolledCourses: [courseDS._id, courseUX._id] }
  )

  // ── Purchases
  console.log('💳 Seeding purchases...')
  const purchases = [
    { courseId: courseWeb._id, userId: 'user_seed_student1', amount: 2799, status: 'completed' },
    { courseId: courseUX._id, userId: 'user_seed_student1', amount: 2549, status: 'completed' },
    { courseId: courseWeb._id, userId: 'user_seed_student2', amount: 2799, status: 'completed' },
    { courseId: courseDS._id, userId: 'user_seed_student2', amount: 3599, status: 'completed' },
    { courseId: courseDS._id, userId: 'user_seed_student3', amount: 3599, status: 'completed' },
    { courseId: courseUX._id, userId: 'user_seed_student3', amount: 2549, status: 'completed' },
  ]
  const createdPurchases = await Purchase.insertMany(purchases)
  console.log(`   ✓ ${createdPurchases.length} purchases`)

  // ── Course Progress
  console.log('📈 Seeding course progress...')
  const progressRecords = [
    {
      userId: 'user_seed_student1',
      courseId: courseWeb._id.toString(),
      completed: false,
      lectureCompleted: ['lec_jsx', 'lec_hooks', 'lec_express_setup'],
    },
    {
      userId: 'user_seed_student1',
      courseId: courseUX._id.toString(),
      completed: true,
      lectureCompleted: [
        'lec_empathize',
        'lec_ideate',
        'lec_figma_basics',
        'lec_components',
        'lec_prototype',
      ],
    },
    {
      userId: 'user_seed_student2',
      courseId: courseWeb._id.toString(),
      completed: false,
      lectureCompleted: ['lec_jsx'],
    },
    {
      userId: 'user_seed_student2',
      courseId: courseDS._id.toString(),
      completed: false,
      lectureCompleted: ['lec_numpy', 'lec_pandas', 'lec_linear_reg'],
    },
    {
      userId: 'user_seed_student3',
      courseId: courseDS._id.toString(),
      completed: false,
      lectureCompleted: ['lec_numpy'],
    },
    {
      userId: 'user_seed_student3',
      courseId: courseUX._id.toString(),
      completed: false,
      lectureCompleted: ['lec_empathize', 'lec_ideate', 'lec_figma_basics'],
    },
  ]
  const createdProgress = await CourseProgress.insertMany(progressRecords)
  console.log(`   ✓ ${createdProgress.length} progress records`)

  // ── Quizzes
  console.log('🧠 Seeding quizzes...')
  const quizzes = [
    {
      courseId: courseWeb._id.toString(),
      chapterId: 'ch_react_basics',
      chapterTitle: 'React Fundamentals',
      courseTitle: courseWeb.courseTitle,
      questions: [
        {
          question: 'What hook is used to manage local state in a React functional component?',
          options: ['useEffect', 'useState', 'useRef', 'useContext'],
          correctIndex: 1,
          explanation: 'useState returns a stateful value and a setter function.',
        },
        {
          question: 'Which of the following correctly describes JSX?',
          options: [
            'A CSS preprocessor',
            'A JavaScript XML syntax extension',
            'A Node.js module',
            'A database query language',
          ],
          correctIndex: 1,
          explanation: 'JSX allows writing HTML-like syntax inside JavaScript files.',
        },
        {
          question: 'When does useEffect with an empty dependency array run?',
          options: [
            'On every render',
            'Only when a prop changes',
            'Once after the initial render',
            'Before the component mounts',
          ],
          correctIndex: 2,
          explanation: 'An empty [] dependency array means the effect runs only once after mount.',
        },
      ],
    },
    {
      courseId: courseWeb._id.toString(),
      chapterId: 'ch_node_express',
      chapterTitle: 'Backend with Node.js & Express',
      courseTitle: courseWeb.courseTitle,
      questions: [
        {
          question: 'Which HTTP method is typically used to create a new resource?',
          options: ['GET', 'PUT', 'POST', 'DELETE'],
          correctIndex: 2,
          explanation: 'POST is the standard method for creating new resources.',
        },
        {
          question: 'What does `npm ci` do differently from `npm install`?',
          options: [
            'It installs global packages',
            'It installs from package-lock.json exactly and errors if it differs',
            'It clears the npm cache',
            'It installs only dev dependencies',
          ],
          correctIndex: 1,
          explanation: 'npm ci ensures a clean, reproducible install based on the lock file.',
        },
      ],
    },
    {
      courseId: courseDS._id.toString(),
      chapterId: 'ch_python_basics',
      chapterTitle: 'Python for Data Science',
      courseTitle: courseDS.courseTitle,
      questions: [
        {
          question: 'Which library provides the DataFrame data structure in Python?',
          options: ['NumPy', 'Matplotlib', 'Pandas', 'Scikit-learn'],
          correctIndex: 2,
          explanation: 'Pandas provides the DataFrame, the core data structure for data analysis.',
        },
        {
          question: 'What does NumPy stand for?',
          options: [
            'Numerical Methods for Python',
            'Numeric Python',
            'New Mathematical Python',
            'None of the above',
          ],
          correctIndex: 1,
          explanation: 'NumPy stands for Numerical Python.',
        },
      ],
    },
    {
      courseId: courseUX._id.toString(),
      chapterId: 'ch_design_thinking',
      chapterTitle: 'Design Thinking Process',
      courseTitle: courseUX.courseTitle,
      questions: [
        {
          question: 'What is the first stage of the Design Thinking process?',
          options: ['Define', 'Ideate', 'Empathize', 'Prototype'],
          correctIndex: 2,
          explanation: 'Empathize is the first stage — understanding users and their needs.',
        },
        {
          question: 'A usability test primarily helps you:',
          options: [
            'Make the design look better',
            'Identify how real users interact with the product',
            'Choose brand colors',
            'Write better copy',
          ],
          correctIndex: 1,
          explanation:
            'Usability testing observes real users to find friction points in the experience.',
        },
      ],
    },
  ]
  const createdQuizzes = await Quiz.insertMany(quizzes)
  console.log(`   ✓ ${createdQuizzes.length} quizzes`)

  // ── Community Groups
  console.log('👥 Seeding community groups...')
  const createdGroups = await Group.insertMany(groupData)
  console.log(`   ✓ ${createdGroups.length} groups`)

  const [grpWeb, grpDS, grpUX, grpCareer] = createdGroups

  // ── Community Posts
  console.log('📝 Seeding community posts...')
  const postData = [
    {
      authorId: 'user_seed_student1',
      authorName: 'Rohan Das',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rohan',
      groupId: grpWeb._id,
      title: 'How do I avoid prop drilling in large React apps?',
      content:
        "I'm building a dashboard with 5+ levels of components and I keep passing props through components that don't need them. I've heard about Context API and Redux — when should I use which?",
      tags: ['react', 'state-management', 'context'],
      upvotes: ['user_seed_student2', 'user_seed_educator1'],
      replyCount: 2,
      isResolved: true,
    },
    {
      authorId: 'user_seed_student2',
      authorName: 'Sneha Patel',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sneha',
      groupId: grpWeb._id,
      title: 'What is the difference between `==` and `===` in JavaScript?',
      content:
        'I keep seeing both used in code but I am not sure when to use which. Can someone explain the difference with a practical example?',
      tags: ['javascript', 'beginner'],
      upvotes: ['user_seed_student1'],
      replyCount: 1,
      isResolved: true,
    },
    {
      authorId: 'user_seed_student3',
      authorName: 'Vikram Nair',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vikram',
      groupId: grpDS._id,
      title: 'Best way to handle missing values in a Pandas DataFrame?',
      content:
        'I have a dataset with ~15% missing values spread across multiple columns. Should I drop rows, fill with mean/median, or use a more sophisticated imputation technique?',
      tags: ['pandas', 'data-cleaning', 'python'],
      upvotes: ['user_seed_student2', 'user_seed_educator1'],
      replyCount: 2,
      isResolved: false,
    },
    {
      authorId: 'user_seed_student2',
      authorName: 'Sneha Patel',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sneha',
      groupId: grpUX._id,
      title: 'Figma auto-layout vs manual frames — which to use?',
      content:
        "I've been placing elements manually in Figma but noticed auto-layout exists. Is it worth switching? Does it make responsive design easier?",
      tags: ['figma', 'auto-layout', 'design'],
      upvotes: ['user_seed_student1', 'user_seed_student3'],
      replyCount: 1,
      isResolved: false,
    },
    {
      authorId: 'user_seed_student1',
      authorName: 'Rohan Das',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rohan',
      groupId: grpCareer._id,
      title: 'How to prepare for a frontend developer interview in 4 weeks?',
      content:
        'I have an interview at a product startup in 4 weeks. I know React and basic algorithms. What should I focus on — DSA, system design, or project portfolio?',
      tags: ['interview', 'frontend', 'career'],
      upvotes: ['user_seed_student2', 'user_seed_student3', 'user_seed_educator2'],
      replyCount: 2,
      isResolved: false,
    },
    {
      authorId: 'user_seed_student3',
      authorName: 'Vikram Nair',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vikram',
      groupId: null,
      title: 'Sharing my learning roadmap after 3 months on SkillRise',
      content:
        "Started with zero coding knowledge. Completed the UI/UX course and I'm halfway through Data Science. Here's what worked: consistency over intensity — 1 hour every day beats 7 hours on weekends. Also, community posts helped me stay accountable!",
      tags: ['motivation', 'roadmap', 'progress'],
      upvotes: [
        'user_seed_student1',
        'user_seed_student2',
        'user_seed_educator1',
        'user_seed_educator2',
      ],
      replyCount: 1,
      isResolved: false,
    },
  ]
  const createdPosts = await CommunityPost.insertMany(postData)
  console.log(`   ✓ ${createdPosts.length} posts`)

  // Update group postCounts
  await Group.updateOne({ _id: grpWeb._id }, { postCount: 2 })
  await Group.updateOne({ _id: grpDS._id }, { postCount: 1 })
  await Group.updateOne({ _id: grpUX._id }, { postCount: 1 })
  await Group.updateOne({ _id: grpCareer._id }, { postCount: 1 })

  // ── Replies
  console.log('💬 Seeding replies...')
  const [postPropDrilling, postEquality, postMissing, postFigma, postInterview, postRoadmap] =
    createdPosts

  const replyData = [
    // Post: prop drilling
    {
      postId: postPropDrilling._id,
      authorId: 'user_seed_educator1',
      authorName: 'Arjun Mehta',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=arjun',
      content:
        'Use Context API for simple global state like theme or auth. Reach for Redux (or Zustand) when you have complex state with many updates — like a shopping cart with filters. For most apps, Context + useReducer is enough.',
      upvotes: ['user_seed_student1', 'user_seed_student2'],
      isAcceptedAnswer: true,
    },
    {
      postId: postPropDrilling._id,
      authorId: 'user_seed_student2',
      authorName: 'Sneha Patel',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sneha',
      content:
        'I switched from Redux to Zustand recently and it drastically reduced boilerplate. Worth looking into if Context feels limiting.',
      upvotes: ['user_seed_student1'],
      isAcceptedAnswer: false,
    },
    // Post: == vs ===
    {
      postId: postEquality._id,
      authorId: 'user_seed_educator1',
      authorName: 'Arjun Mehta',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=arjun',
      content:
        '`==` does type coercion (so `0 == "0"` is true), while `===` checks type AND value (so `0 === "0"` is false). Always use `===` unless you specifically need coercion.',
      upvotes: ['user_seed_student2', 'user_seed_student1'],
      isAcceptedAnswer: true,
    },
    // Post: missing values
    {
      postId: postMissing._id,
      authorId: 'user_seed_educator1',
      authorName: 'Arjun Mehta',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=arjun',
      content:
        'It depends on the column type and why data is missing. For numerical columns with random missingness, median imputation is safe. For categorical, use mode. If missingness is informative (not random), consider adding a binary indicator column alongside.',
      upvotes: ['user_seed_student3'],
      isAcceptedAnswer: false,
    },
    {
      postId: postMissing._id,
      authorId: 'user_seed_student2',
      authorName: 'Sneha Patel',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sneha',
      content:
        "Also check out scikit-learn's `IterativeImputer` — it uses the relationship between columns to impute values, much more powerful than simple mean/median.",
      upvotes: ['user_seed_student3'],
      isAcceptedAnswer: false,
    },
    // Post: Figma auto-layout
    {
      postId: postFigma._id,
      authorId: 'user_seed_educator2',
      authorName: 'Priya Sharma',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=priya',
      content:
        'Absolutely switch to auto-layout. It mirrors CSS flexbox — spacing, alignment, and resizing become declarative instead of manual. Your handoff to developers will also be much cleaner since the constraints are explicit.',
      upvotes: ['user_seed_student2', 'user_seed_student1'],
      isAcceptedAnswer: true,
    },
    // Post: interview prep
    {
      postId: postInterview._id,
      authorId: 'user_seed_educator1',
      authorName: 'Arjun Mehta',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=arjun',
      content:
        'For a product startup: week 1 — polish 2 React projects (add auth, responsive design, deploy). Week 2–3 — medium-level DSA on arrays, strings, hashmaps. Week 4 — mock interviews and behavioural prep. They care more about shipping than algorithms.',
      upvotes: ['user_seed_student1', 'user_seed_student3'],
      isAcceptedAnswer: false,
    },
    {
      postId: postInterview._id,
      authorId: 'user_seed_educator2',
      authorName: 'Priya Sharma',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=priya',
      content:
        "Don't neglect CSS! Many frontend interviews include layout challenges — flexbox, grid, and responsive design questions trip up a lot of candidates.",
      upvotes: ['user_seed_student1'],
      isAcceptedAnswer: false,
    },
    // Post: roadmap
    {
      postId: postRoadmap._id,
      authorId: 'user_seed_student1',
      authorName: 'Rohan Das',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rohan',
      content:
        "This is super inspiring! I'm at 2 months and was feeling frustrated. The '1 hour every day' advice is exactly what I needed to hear.",
      upvotes: ['user_seed_student3'],
      isAcceptedAnswer: false,
    },
  ]

  const createdReplies = await Reply.insertMany(replyData)
  console.log(`   ✓ ${createdReplies.length} replies`)

  console.log('\n✅ Seed complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`   Users      : ${createdUsers.length}`)
  console.log(`   Courses    : ${createdCourses.length}`)
  console.log(`   Purchases  : ${createdPurchases.length}`)
  console.log(`   Progress   : ${createdProgress.length}`)
  console.log(`   Quizzes    : ${createdQuizzes.length}`)
  console.log(`   Groups     : ${createdGroups.length}`)
  console.log(`   Posts      : ${createdPosts.length}`)
  console.log(`   Replies    : ${createdReplies.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  mongoose.disconnect()
  process.exit(1)
})
