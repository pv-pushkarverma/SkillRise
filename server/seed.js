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
import Purchase from './models/Purchase.js'
import CourseProgress from './models/CourseProgress.js'
import CommunityPost from './models/CommunityPost.js'
import Group from './models/Group.js'
import Reply from './models/Reply.js'
import Quiz from './models/Quiz.js'

// ─── Users ────────────────────────────────────────────────────────────────────

const users = [
  {
    _id: 'user_seed_educator1',
    name: 'Brad Traversy',
    email: 'brad@traversymedia.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_educator2',
    name: 'Corey Schafer',
    email: 'corey@coreyms.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=coreyschafer',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_educator3',
    name: 'Nana Janashia',
    email: 'nana@techworld-with-nana.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=nanajanashia',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_educator4',
    name: 'Gary Simon',
    email: 'gary@designcourse.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=garysimon',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_educator5',
    name: 'Jeff Delaney',
    email: 'jeff@fireship.io',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=jeffdelaney',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_educator6',
    name: 'Gaurav Sen',
    email: 'gaurav@gauravsen.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=gauravsen',
    enrolledCourses: [],
  },
  {
    _id: 'user_seed_educator7',
    name: 'Chuck Keith',
    email: 'chuck@networkchuck.com',
    imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=chuckkeith',
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

// Fake student IDs for display purposes — no real user records needed
const _fs = Array.from({ length: 60 }, (_, i) => `fake_s_${String(i + 4).padStart(3, '0')}`)
const _fr = (count, offset = 0) =>
  Array.from({ length: count }, (_, i) => ({
    userId: `fake_s_${String(i + 4 + offset).padStart(3, '0')}`,
    rating: (i + offset) % 3 === 0 ? 4 : 5,
  }))

const courseData = [
  // 1
  {
    courseTitle: 'Full-Stack Web Development with React & Node.js',
    courseDescription:
      '<h2>Master modern full-stack development</h2><p>Learn to build production-ready web applications using React 19, Node.js, Express, and MongoDB. This comprehensive course takes you from zero to deploying a complete application.</p><ul><li>React hooks, context, and state management</li><li>RESTful APIs with Express</li><li>MongoDB & Mongoose</li><li>Authentication with JWT</li><li>Deployment with Docker</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    coursePrice: 3999,
    isPublished: true,
    discount: 30,
    educator: 'user_seed_educator1',
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
      ..._fr(10),
    ],
    enrolledStudents: ['user_seed_student1', 'user_seed_student2', ..._fs.slice(0, 35)],
  },
  // 2
  {
    courseTitle: 'Data Science & Machine Learning with Python',
    courseDescription:
      '<h2>From data to insights</h2><p>A hands-on introduction to data science using Python. You will work with real datasets, build machine learning models, and visualize results.</p><ul><li>NumPy, Pandas, Matplotlib</li><li>Supervised & unsupervised learning</li><li>scikit-learn pipelines</li><li>Neural network basics with TensorFlow</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    coursePrice: 4499,
    isPublished: true,
    discount: 20,
    educator: 'user_seed_educator2',
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
      ..._fr(12),
    ],
    enrolledStudents: ['user_seed_student2', 'user_seed_student3', ..._fs.slice(0, 40)],
  },
  // 3
  {
    courseTitle: 'UI/UX Design: From Wireframes to Prototypes',
    courseDescription:
      '<h2>Design products people love</h2><p>Learn the complete UI/UX design process — from user research and wireframing to high-fidelity prototypes in Figma. No prior design experience required.</p><ul><li>Design thinking & user research</li><li>Wireframing & information architecture</li><li>Figma components and auto-layout</li><li>Usability testing</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    coursePrice: 2999,
    isPublished: true,
    discount: 15,
    educator: 'user_seed_educator4',
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
    courseRatings: [{ userId: 'user_seed_student1', rating: 5 }, ..._fr(8)],
    enrolledStudents: ['user_seed_student1', 'user_seed_student3', ..._fs.slice(0, 25)],
  },
  // 4
  {
    courseTitle: 'TypeScript Masterclass for JavaScript Developers',
    courseDescription:
      '<h2>Level up from JavaScript to TypeScript</h2><p>TypeScript is now an industry standard. This course takes you from JavaScript fundamentals to advanced TypeScript patterns used in production codebases.</p><ul><li>Types, interfaces, and generics</li><li>TypeScript with React</li><li>Utility types and advanced patterns</li><li>Migrating a JS project to TS</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    coursePrice: 2499,
    isPublished: true,
    discount: 20,
    educator: 'user_seed_educator5',
    courseContent: [
      {
        chapterId: 'ch_ts_basics',
        chapterOrder: 1,
        chapterTitle: 'TypeScript Fundamentals',
        chapterContent: [
          {
            lectureId: 'lec_ts_types',
            lectureTitle: 'Types & Interfaces',
            lectureDuration: 20,
            lectureUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_ts_generics',
            lectureTitle: 'Generics in Depth',
            lectureDuration: 25,
            lectureUrl: 'https://www.youtube.com/watch?v=nViEqpgwxHE',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_ts_utility',
            lectureTitle: 'Utility Types: Partial, Pick, Omit',
            lectureDuration: 18,
            lectureUrl: 'https://www.youtube.com/watch?v=F7ThfBbZrTE',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_ts_react',
        chapterOrder: 2,
        chapterTitle: 'TypeScript with React',
        chapterContent: [
          {
            lectureId: 'lec_ts_props',
            lectureTitle: 'Typing Props and State',
            lectureDuration: 22,
            lectureUrl: 'https://www.youtube.com/watch?v=TPACABQTHvM',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_ts_hooks',
            lectureTitle: 'Typing Custom Hooks',
            lectureDuration: 19,
            lectureUrl: 'https://www.youtube.com/watch?v=ydkQlJhodio',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
    ],
    courseRatings: [
      { userId: 'user_seed_student1', rating: 5 },
      { userId: 'user_seed_student2', rating: 5 },
      ..._fr(10),
    ],
    enrolledStudents: ['user_seed_student1', 'user_seed_student2', ..._fs.slice(0, 30)],
  },
  // 5
  {
    courseTitle: 'DevOps with Docker & Kubernetes',
    courseDescription:
      '<h2>Ship software like a pro</h2><p>Learn container-based DevOps from Docker basics to Kubernetes orchestration. Build, ship, and scale applications reliably in production environments.</p><ul><li>Docker images, containers, and volumes</li><li>Docker Compose for multi-service apps</li><li>Kubernetes pods, deployments, and services</li><li>Helm charts and production deployments</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
    coursePrice: 3499,
    isPublished: true,
    discount: 25,
    educator: 'user_seed_educator3',
    courseContent: [
      {
        chapterId: 'ch_docker_core',
        chapterOrder: 1,
        chapterTitle: 'Docker Essentials',
        chapterContent: [
          {
            lectureId: 'lec_docker_intro',
            lectureTitle: 'Docker Architecture & Setup',
            lectureDuration: 20,
            lectureUrl: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_dockerfile',
            lectureTitle: 'Writing Dockerfiles',
            lectureDuration: 24,
            lectureUrl: 'https://www.youtube.com/watch?v=Gjnup-PuquQ',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_compose',
            lectureTitle: 'Docker Compose in Practice',
            lectureDuration: 28,
            lectureUrl: 'https://www.youtube.com/watch?v=HG6yIjZapSA',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_kubernetes',
        chapterOrder: 2,
        chapterTitle: 'Kubernetes Fundamentals',
        chapterContent: [
          {
            lectureId: 'lec_k8s_pods',
            lectureTitle: 'Pods & Deployments',
            lectureDuration: 30,
            lectureUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_k8s_services',
            lectureTitle: 'Services & Ingress',
            lectureDuration: 26,
            lectureUrl: 'https://www.youtube.com/watch?v=s_o8dwzRlu4',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
    ],
    courseRatings: [
      { userId: 'user_seed_student2', rating: 4 },
      { userId: 'user_seed_student3', rating: 5 },
      ..._fr(9),
    ],
    enrolledStudents: ['user_seed_student2', 'user_seed_student3', ..._fs.slice(0, 28)],
  },
  // 6
  {
    courseTitle: 'React Native: Build iOS & Android Apps',
    courseDescription:
      '<h2>One codebase, two platforms</h2><p>Build real mobile applications for iOS and Android using React Native and Expo. If you know React, you already know most of what you need.</p><ul><li>React Native core components</li><li>Navigation with React Navigation</li><li>State management with Zustand</li><li>Accessing device APIs (camera, location)</li><li>Publishing to App Store & Play Store</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    coursePrice: 3299,
    isPublished: true,
    discount: 10,
    educator: 'user_seed_educator5',
    courseContent: [
      {
        chapterId: 'ch_rn_basics',
        chapterOrder: 1,
        chapterTitle: 'React Native Basics',
        chapterContent: [
          {
            lectureId: 'lec_rn_setup',
            lectureTitle: 'Expo Setup & First App',
            lectureDuration: 18,
            lectureUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_rn_components',
            lectureTitle: 'Core Components: View, Text, Image',
            lectureDuration: 22,
            lectureUrl: 'https://www.youtube.com/watch?v=Hf4MJH0jDb4',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_rn_styles',
            lectureTitle: 'Styling with StyleSheet',
            lectureDuration: 17,
            lectureUrl: 'https://www.youtube.com/watch?v=mqhFMB2BSAA',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_rn_navigation',
        chapterOrder: 2,
        chapterTitle: 'Navigation & State',
        chapterContent: [
          {
            lectureId: 'lec_rn_nav',
            lectureTitle: 'Stack & Tab Navigation',
            lectureDuration: 27,
            lectureUrl: 'https://www.youtube.com/watch?v=nQVCkqvU1uE',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_rn_zustand',
            lectureTitle: 'Global State with Zustand',
            lectureDuration: 20,
            lectureUrl: 'https://www.youtube.com/watch?v=KCr-UNsM3vA',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
    ],
    courseRatings: [{ userId: 'user_seed_student1', rating: 4 }, ..._fr(7)],
    enrolledStudents: ['user_seed_student1', 'user_seed_student3', ..._fs.slice(0, 22)],
  },
  // 7
  {
    courseTitle: 'Django & REST API Development',
    courseDescription:
      '<h2>Backend development with Python</h2><p>Build powerful REST APIs using Django and Django REST Framework. Learn authentication, serializers, viewsets, and deploy a production-ready API.</p><ul><li>Django models, views, and URLs</li><li>Django REST Framework serializers</li><li>JWT authentication</li><li>API documentation with Swagger</li><li>Deployment on AWS</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    coursePrice: 2799,
    isPublished: true,
    discount: 15,
    educator: 'user_seed_educator2',
    courseContent: [
      {
        chapterId: 'ch_django_basics',
        chapterOrder: 1,
        chapterTitle: 'Django Fundamentals',
        chapterContent: [
          {
            lectureId: 'lec_django_setup',
            lectureTitle: 'Django Project Setup & Apps',
            lectureDuration: 19,
            lectureUrl: 'https://www.youtube.com/watch?v=F5mRW0jo-U4',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_django_models',
            lectureTitle: 'Models & Migrations',
            lectureDuration: 24,
            lectureUrl: 'https://www.youtube.com/watch?v=OyMyzoLSRBc',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_django_admin',
            lectureTitle: 'Django Admin Panel',
            lectureDuration: 15,
            lectureUrl: 'https://www.youtube.com/watch?v=1PkNAEzBJ38',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_drf',
        chapterOrder: 2,
        chapterTitle: 'Django REST Framework',
        chapterContent: [
          {
            lectureId: 'lec_drf_serializers',
            lectureTitle: 'Serializers & ViewSets',
            lectureDuration: 30,
            lectureUrl: 'https://www.youtube.com/watch?v=TmsD8QOptUM',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_drf_auth',
            lectureTitle: 'JWT Authentication',
            lectureDuration: 25,
            lectureUrl: 'https://www.youtube.com/watch?v=PUzgZrS_piQ',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
    ],
    courseRatings: [{ userId: 'user_seed_student2', rating: 4 }, ..._fr(6)],
    enrolledStudents: ['user_seed_student2', ..._fs.slice(0, 18)],
  },
  // 8
  {
    courseTitle: 'Cybersecurity Fundamentals',
    courseDescription:
      '<h2>Understand and defend against threats</h2><p>A practical introduction to cybersecurity concepts for developers and IT professionals. Learn how attacks work so you can build better defenses.</p><ul><li>OWASP Top 10 vulnerabilities</li><li>Network security basics</li><li>SQL injection & XSS prevention</li><li>Cryptography fundamentals</li><li>Penetration testing intro</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    coursePrice: 3199,
    isPublished: true,
    discount: 20,
    educator: 'user_seed_educator7',
    courseContent: [
      {
        chapterId: 'ch_cyber_basics',
        chapterOrder: 1,
        chapterTitle: 'Security Fundamentals',
        chapterContent: [
          {
            lectureId: 'lec_cyber_intro',
            lectureTitle: 'CIA Triad & Threat Landscape',
            lectureDuration: 16,
            lectureUrl: 'https://www.youtube.com/watch?v=hXSFdwIOfnE',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_cyber_crypto',
            lectureTitle: 'Cryptography & Hashing',
            lectureDuration: 22,
            lectureUrl: 'https://www.youtube.com/watch?v=AQDCe585Lnc',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
      {
        chapterId: 'ch_owasp',
        chapterOrder: 2,
        chapterTitle: 'OWASP Top 10',
        chapterContent: [
          {
            lectureId: 'lec_owasp_sqli',
            lectureTitle: 'SQL Injection & Prevention',
            lectureDuration: 26,
            lectureUrl: 'https://www.youtube.com/watch?v=ciNHn38EyRc',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_owasp_xss',
            lectureTitle: 'XSS Attacks & Defenses',
            lectureDuration: 23,
            lectureUrl: 'https://www.youtube.com/watch?v=rWHvp7rUka8',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_owasp_auth',
            lectureTitle: 'Broken Authentication',
            lectureDuration: 20,
            lectureUrl: 'https://www.youtube.com/watch?v=woNZJMSNbuo',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
    ],
    courseRatings: [{ userId: 'user_seed_student3', rating: 5 }, ..._fr(11)],
    enrolledStudents: ['user_seed_student3', ..._fs.slice(0, 32)],
  },
  // 9
  {
    courseTitle: 'System Design for Engineers',
    courseDescription:
      '<h2>Design systems that scale</h2><p>Learn how to architect large-scale distributed systems. Essential for senior engineering interviews and real-world backend engineering at scale.</p><ul><li>Scalability: horizontal vs vertical</li><li>Load balancers, caches, CDNs</li><li>Databases: SQL vs NoSQL, sharding</li><li>Message queues & event-driven architecture</li><li>Designing Twitter, YouTube, Uber</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    coursePrice: 4999,
    isPublished: true,
    discount: 10,
    educator: 'user_seed_educator6',
    courseContent: [
      {
        chapterId: 'ch_sd_fundamentals',
        chapterOrder: 1,
        chapterTitle: 'System Design Fundamentals',
        chapterContent: [
          {
            lectureId: 'lec_sd_intro',
            lectureTitle: 'How to Approach System Design',
            lectureDuration: 18,
            lectureUrl: 'https://www.youtube.com/watch?v=UzLMhqg3_Wc',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_sd_scalability',
            lectureTitle: 'Scalability & Load Balancing',
            lectureDuration: 27,
            lectureUrl: 'https://www.youtube.com/watch?v=K0Ta65OqQkY',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_sd_caching',
            lectureTitle: 'Caching Strategies & Redis',
            lectureDuration: 24,
            lectureUrl: 'https://www.youtube.com/watch?v=U3RkDLtS7uY',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_sd_databases',
        chapterOrder: 2,
        chapterTitle: 'Databases at Scale',
        chapterContent: [
          {
            lectureId: 'lec_sd_sql_nosql',
            lectureTitle: 'SQL vs NoSQL Trade-offs',
            lectureDuration: 22,
            lectureUrl: 'https://www.youtube.com/watch?v=Jt_w2swkXAk',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_sd_sharding',
            lectureTitle: 'Database Sharding & Replication',
            lectureDuration: 29,
            lectureUrl: 'https://www.youtube.com/watch?v=5faMjKuB9bc',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
    ],
    courseRatings: [
      { userId: 'user_seed_student1', rating: 5 },
      { userId: 'user_seed_student3', rating: 4 },
      ..._fr(8),
    ],
    enrolledStudents: ['user_seed_student1', 'user_seed_student3', ..._fs.slice(0, 20)],
  },
  // 10
  {
    courseTitle: 'Next.js: Full-Stack React Framework',
    courseDescription:
      '<h2>The React framework for production</h2><p>Next.js is the go-to choice for production React apps. Learn server-side rendering, app router, server components, API routes, and full-stack features built into the framework.</p><ul><li>App Router & file-based routing</li><li>Server Components & Client Components</li><li>Data fetching: SSR, SSG, ISR</li><li>API routes & server actions</li><li>Authentication with NextAuth</li></ul>',
    courseThumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    coursePrice: 3799,
    isPublished: true,
    discount: 20,
    educator: 'user_seed_educator1',
    courseContent: [
      {
        chapterId: 'ch_next_routing',
        chapterOrder: 1,
        chapterTitle: 'App Router & Routing',
        chapterContent: [
          {
            lectureId: 'lec_next_intro',
            lectureTitle: 'Next.js App Router Intro',
            lectureDuration: 21,
            lectureUrl: 'https://www.youtube.com/watch?v=mTz0GXj8NN0',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_next_layouts',
            lectureTitle: 'Layouts & Nested Routes',
            lectureDuration: 18,
            lectureUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
            isPreviewFree: false,
            lectureOrder: 2,
          },
          {
            lectureId: 'lec_next_server',
            lectureTitle: 'Server vs Client Components',
            lectureDuration: 25,
            lectureUrl: 'https://www.youtube.com/watch?v=Y6KDk5iyrYE',
            isPreviewFree: false,
            lectureOrder: 3,
          },
        ],
      },
      {
        chapterId: 'ch_next_data',
        chapterOrder: 2,
        chapterTitle: 'Data Fetching & API',
        chapterContent: [
          {
            lectureId: 'lec_next_fetch',
            lectureTitle: 'SSR, SSG, and ISR',
            lectureDuration: 30,
            lectureUrl: 'https://www.youtube.com/watch?v=pUNSHPyVryU',
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: 'lec_next_api',
            lectureTitle: 'API Routes & Server Actions',
            lectureDuration: 26,
            lectureUrl: 'https://www.youtube.com/watch?v=vrR4MlB7nBI',
            isPreviewFree: false,
            lectureOrder: 2,
          },
        ],
      },
    ],
    courseRatings: [
      { userId: 'user_seed_student1', rating: 5 },
      { userId: 'user_seed_student2', rating: 4 },
      { userId: 'user_seed_student3', rating: 5 },
      ..._fr(12),
    ],
    enrolledStudents: [
      'user_seed_student1',
      'user_seed_student2',
      'user_seed_student3',
      ..._fs.slice(0, 38),
    ],
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
    Course.deleteMany({
      educator: {
        $in: [
          'user_seed_educator1',
          'user_seed_educator2',
          'user_seed_educator3',
          'user_seed_educator4',
          'user_seed_educator5',
          'user_seed_educator6',
          'user_seed_educator7',
        ],
      },
    }),
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

  const [
    courseWeb,
    courseDS,
    courseUX,
    courseTS,
    courseDO,
    courseRN,
    courseDjango,
    courseCyber,
    courseSD,
    courseNext,
  ] = createdCourses

  // ── Update users with enrolled course IDs
  await User.updateOne(
    { _id: 'user_seed_student1' },
    {
      enrolledCourses: [
        courseWeb._id,
        courseUX._id,
        courseTS._id,
        courseRN._id,
        courseSD._id,
        courseNext._id,
      ],
    }
  )
  await User.updateOne(
    { _id: 'user_seed_student2' },
    {
      enrolledCourses: [
        courseWeb._id,
        courseDS._id,
        courseTS._id,
        courseDO._id,
        courseDjango._id,
        courseNext._id,
      ],
    }
  )
  await User.updateOne(
    { _id: 'user_seed_student3' },
    {
      enrolledCourses: [
        courseDS._id,
        courseUX._id,
        courseDO._id,
        courseRN._id,
        courseCyber._id,
        courseSD._id,
        courseNext._id,
      ],
    }
  )

  // ── Purchases
  console.log('💳 Seeding purchases...')
  const purchases = [
    { courseId: courseWeb._id, userId: 'user_seed_student1', amount: 2799, status: 'completed' },
    { courseId: courseUX._id, userId: 'user_seed_student1', amount: 2549, status: 'completed' },
    { courseId: courseTS._id, userId: 'user_seed_student1', amount: 1999, status: 'completed' },
    { courseId: courseRN._id, userId: 'user_seed_student1', amount: 2969, status: 'completed' },
    { courseId: courseSD._id, userId: 'user_seed_student1', amount: 4499, status: 'completed' },
    { courseId: courseNext._id, userId: 'user_seed_student1', amount: 3039, status: 'completed' },
    { courseId: courseWeb._id, userId: 'user_seed_student2', amount: 2799, status: 'completed' },
    { courseId: courseDS._id, userId: 'user_seed_student2', amount: 3599, status: 'completed' },
    { courseId: courseTS._id, userId: 'user_seed_student2', amount: 1999, status: 'completed' },
    { courseId: courseDO._id, userId: 'user_seed_student2', amount: 2624, status: 'completed' },
    { courseId: courseDjango._id, userId: 'user_seed_student2', amount: 2379, status: 'completed' },
    { courseId: courseNext._id, userId: 'user_seed_student2', amount: 3039, status: 'completed' },
    { courseId: courseDS._id, userId: 'user_seed_student3', amount: 3599, status: 'completed' },
    { courseId: courseUX._id, userId: 'user_seed_student3', amount: 2549, status: 'completed' },
    { courseId: courseDO._id, userId: 'user_seed_student3', amount: 2624, status: 'completed' },
    { courseId: courseRN._id, userId: 'user_seed_student3', amount: 2969, status: 'completed' },
    { courseId: courseCyber._id, userId: 'user_seed_student3', amount: 2559, status: 'completed' },
    { courseId: courseSD._id, userId: 'user_seed_student3', amount: 4499, status: 'completed' },
    { courseId: courseNext._id, userId: 'user_seed_student3', amount: 3039, status: 'completed' },
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
      userId: 'user_seed_student1',
      courseId: courseTS._id.toString(),
      completed: false,
      lectureCompleted: ['lec_ts_types', 'lec_ts_generics'],
    },
    {
      userId: 'user_seed_student1',
      courseId: courseRN._id.toString(),
      completed: false,
      lectureCompleted: ['lec_rn_setup'],
    },
    {
      userId: 'user_seed_student1',
      courseId: courseSD._id.toString(),
      completed: false,
      lectureCompleted: ['lec_sd_intro', 'lec_sd_scalability'],
    },
    {
      userId: 'user_seed_student1',
      courseId: courseNext._id.toString(),
      completed: false,
      lectureCompleted: ['lec_next_intro', 'lec_next_layouts', 'lec_next_server'],
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
      userId: 'user_seed_student2',
      courseId: courseTS._id.toString(),
      completed: true,
      lectureCompleted: [
        'lec_ts_types',
        'lec_ts_generics',
        'lec_ts_utility',
        'lec_ts_props',
        'lec_ts_hooks',
      ],
    },
    {
      userId: 'user_seed_student2',
      courseId: courseDO._id.toString(),
      completed: false,
      lectureCompleted: ['lec_docker_intro', 'lec_dockerfile'],
    },
    {
      userId: 'user_seed_student2',
      courseId: courseDjango._id.toString(),
      completed: false,
      lectureCompleted: ['lec_django_setup', 'lec_django_models'],
    },
    {
      userId: 'user_seed_student2',
      courseId: courseNext._id.toString(),
      completed: false,
      lectureCompleted: ['lec_next_intro'],
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
    {
      userId: 'user_seed_student3',
      courseId: courseDO._id.toString(),
      completed: false,
      lectureCompleted: ['lec_docker_intro', 'lec_dockerfile', 'lec_compose', 'lec_k8s_pods'],
    },
    {
      userId: 'user_seed_student3',
      courseId: courseRN._id.toString(),
      completed: false,
      lectureCompleted: ['lec_rn_setup', 'lec_rn_components'],
    },
    {
      userId: 'user_seed_student3',
      courseId: courseCyber._id.toString(),
      completed: false,
      lectureCompleted: ['lec_cyber_intro', 'lec_cyber_crypto', 'lec_owasp_sqli'],
    },
    {
      userId: 'user_seed_student3',
      courseId: courseSD._id.toString(),
      completed: false,
      lectureCompleted: ['lec_sd_intro'],
    },
    {
      userId: 'user_seed_student3',
      courseId: courseNext._id.toString(),
      completed: false,
      lectureCompleted: ['lec_next_intro', 'lec_next_layouts'],
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
    {
      courseId: courseTS._id.toString(),
      chapterId: 'ch_ts_basics',
      chapterTitle: 'TypeScript Fundamentals',
      courseTitle: courseTS.courseTitle,
      questions: [
        {
          question: 'What is the difference between `interface` and `type` in TypeScript?',
          options: [
            'They are identical in all situations',
            'Interfaces can be extended; types cannot',
            'Interfaces support declaration merging; types do not',
            'Types are only for primitives',
          ],
          correctIndex: 2,
          explanation:
            'Interfaces support declaration merging (defining the same interface twice merges them), while type aliases do not.',
        },
        {
          question: 'Which utility type makes all properties of a type optional?',
          options: ['Required<T>', 'Readonly<T>', 'Partial<T>', 'Pick<T, K>'],
          correctIndex: 2,
          explanation: 'Partial<T> constructs a type with all properties of T set to optional.',
        },
        {
          question: 'What does the `unknown` type enforce compared to `any`?',
          options: [
            'Nothing, they are the same',
            'You must type-check before using the value',
            'It only works with objects',
            'It disables all type checking',
          ],
          correctIndex: 1,
          explanation:
            'unknown requires you to narrow the type before performing operations on it, making it safer than any.',
        },
      ],
    },
    {
      courseId: courseDO._id.toString(),
      chapterId: 'ch_docker_core',
      chapterTitle: 'Docker Essentials',
      courseTitle: courseDO.courseTitle,
      questions: [
        {
          question: 'What is the purpose of a Dockerfile?',
          options: [
            'To configure Kubernetes clusters',
            'To define instructions for building a Docker image',
            'To list running containers',
            'To set environment variables at runtime',
          ],
          correctIndex: 1,
          explanation:
            'A Dockerfile contains a sequence of instructions that Docker uses to build an image.',
        },
        {
          question: 'Which command runs a Docker container in detached (background) mode?',
          options: ['docker run', 'docker run -d', 'docker start -b', 'docker exec -d'],
          correctIndex: 1,
          explanation: 'The -d flag runs the container in detached mode, in the background.',
        },
      ],
    },
    {
      courseId: courseCyber._id.toString(),
      chapterId: 'ch_owasp',
      chapterTitle: 'OWASP Top 10',
      courseTitle: courseCyber.courseTitle,
      questions: [
        {
          question: 'Which attack injects malicious SQL through user input fields?',
          options: ['XSS', 'CSRF', 'SQL Injection', 'Man-in-the-Middle'],
          correctIndex: 2,
          explanation:
            'SQL Injection exploits improper sanitization of user input to manipulate database queries.',
        },
        {
          question: 'What does XSS stand for?',
          options: [
            'Cross-Server Scripting',
            'Cross-Site Scripting',
            'Cross-System Security',
            'Cross-Site Session',
          ],
          correctIndex: 1,
          explanation:
            'XSS (Cross-Site Scripting) is an attack where malicious scripts are injected into trusted websites.',
        },
        {
          question: 'What is the best way to prevent SQL injection?',
          options: [
            'Escape all output HTML',
            'Use prepared statements and parameterized queries',
            'Use HTTPS',
            'Disable JavaScript',
          ],
          correctIndex: 1,
          explanation: 'Prepared statements ensure user input is never interpreted as SQL code.',
        },
      ],
    },
    {
      courseId: courseSD._id.toString(),
      chapterId: 'ch_sd_fundamentals',
      chapterTitle: 'System Design Fundamentals',
      courseTitle: courseSD.courseTitle,
      questions: [
        {
          question: 'What does horizontal scaling mean?',
          options: [
            'Adding more CPU/RAM to a single server',
            'Adding more servers to distribute load',
            'Increasing database storage',
            'Upgrading the network bandwidth',
          ],
          correctIndex: 1,
          explanation:
            'Horizontal scaling (scaling out) means adding more machines to share the load.',
        },
        {
          question:
            'Which caching strategy always writes to both cache and database simultaneously?',
          options: ['Cache-aside', 'Write-through', 'Write-back', 'Read-through'],
          correctIndex: 1,
          explanation:
            'Write-through writes to both the cache and the backing store at the same time, keeping them in sync.',
        },
      ],
    },
    {
      courseId: courseNext._id.toString(),
      chapterId: 'ch_next_routing',
      chapterTitle: 'App Router & Routing',
      courseTitle: courseNext.courseTitle,
      questions: [
        {
          question: 'In Next.js App Router, where do you define a layout shared across pages?',
          options: [
            '_app.js',
            'layout.js inside the app directory',
            'next.config.js',
            'middleware.js',
          ],
          correctIndex: 1,
          explanation:
            'layout.js files in the app directory define shared UI that wraps child routes.',
        },
        {
          question: 'What is a Server Component in Next.js?',
          options: [
            'A component that only runs in the browser',
            'A component rendered on the server with no client-side JavaScript',
            'A component that handles API requests',
            'A component that uses useState',
          ],
          correctIndex: 1,
          explanation:
            'Server Components render on the server and send HTML to the client, with no JS bundle shipped for the component itself.',
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
    // Web Development (4 posts)
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
      authorId: 'user_seed_student1',
      authorName: 'Rohan Das',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rohan',
      groupId: grpWeb._id,
      title: 'Server Components vs Client Components in Next.js — when to use which?',
      content:
        "I've been migrating a project to Next.js App Router and I'm confused about when to mark a component with 'use client'. Is it better to keep everything as a Server Component unless you need interactivity?",
      tags: ['nextjs', 'react', 'server-components'],
      upvotes: ['user_seed_student2', 'user_seed_student3', 'user_seed_educator1'],
      replyCount: 2,
      isResolved: false,
    },
    {
      authorId: 'user_seed_student3',
      authorName: 'Vikram Nair',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vikram',
      groupId: grpWeb._id,
      title: 'Is TypeScript really worth the extra setup for side projects?',
      content:
        'I always start with JavaScript on personal projects to move fast, but then regret it when bugs appear that TypeScript would have caught. Is it worth adding TS from the start even for small apps?',
      tags: ['typescript', 'javascript', 'opinion'],
      upvotes: ['user_seed_student1', 'user_seed_educator2'],
      replyCount: 1,
      isResolved: false,
    },
    // Data Science & AI (3 posts)
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
      groupId: grpDS._id,
      title: 'How do I know if my ML model is overfitting?',
      content:
        'My model has 98% accuracy on training data but only 71% on the validation set. Is this overfitting? What techniques should I use — dropout, regularization, more data?',
      tags: ['machine-learning', 'overfitting', 'scikit-learn'],
      upvotes: ['user_seed_student3', 'user_seed_educator1'],
      replyCount: 2,
      isResolved: true,
    },
    {
      authorId: 'user_seed_student1',
      authorName: 'Rohan Das',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=rohan',
      groupId: grpDS._id,
      title: 'What is the difference between supervised and unsupervised learning?',
      content:
        'I understand supervised learning uses labeled data, but I am unclear on when to choose unsupervised approaches like clustering. Can someone give practical examples of each?',
      tags: ['machine-learning', 'beginner', 'concepts'],
      upvotes: ['user_seed_student2'],
      replyCount: 1,
      isResolved: true,
    },
    // UI/UX Design (2 posts)
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
      authorId: 'user_seed_student3',
      authorName: 'Vikram Nair',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vikram',
      groupId: grpUX._id,
      title: 'How many users should I interview for user research?',
      content:
        "I'm conducting user interviews for a new feature. Everyone says 5 users is enough but my manager wants 20+. What's the right number and what's the diminishing returns point?",
      tags: ['user-research', 'interviews', 'ux-process'],
      upvotes: ['user_seed_student2', 'user_seed_educator2'],
      replyCount: 1,
      isResolved: false,
    },
    // Career & Jobs (2 posts)
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
      authorId: 'user_seed_student2',
      authorName: 'Sneha Patel',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sneha',
      groupId: grpCareer._id,
      title: 'How to negotiate salary as a fresher with no prior experience?',
      content:
        'I just got my first offer — ₹6 LPA for a React developer role. The job description asked for 0-2 years experience and I have completed 3 courses and built 2 projects. Is it reasonable to negotiate? How do I do it without sounding ungrateful?',
      tags: ['salary', 'negotiation', 'fresher'],
      upvotes: ['user_seed_student1', 'user_seed_student3', 'user_seed_educator1'],
      replyCount: 2,
      isResolved: false,
    },
    // Global post (no group)
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
  await Group.updateOne({ _id: grpWeb._id }, { postCount: 4 })
  await Group.updateOne({ _id: grpDS._id }, { postCount: 3 })
  await Group.updateOne({ _id: grpUX._id }, { postCount: 2 })
  await Group.updateOne({ _id: grpCareer._id }, { postCount: 2 })

  // ── Replies
  console.log('💬 Seeding replies...')
  const [
    postPropDrilling,
    postEquality,
    postNextServer,
    postTypeScript,
    postMissing,
    postOverfitting,
    postSupervisedML,
    postFigma,
    postUserResearch,
    postInterview,
    postSalary,
    postRoadmap,
  ] = createdPosts

  const replyData = [
    // Post: prop drilling
    {
      postId: postPropDrilling._id,
      authorId: 'user_seed_educator1',
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
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
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
      content:
        '`==` does type coercion (so `0 == "0"` is true), while `===` checks type AND value (so `0 === "0"` is false). Always use `===` unless you specifically need coercion.',
      upvotes: ['user_seed_student2', 'user_seed_student1'],
      isAcceptedAnswer: true,
    },
    // Post: Next.js Server vs Client Components
    {
      postId: postNextServer._id,
      authorId: 'user_seed_educator1',
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
      content:
        "Yes, keep everything as Server Components by default. Only add 'use client' when you need useState, useEffect, event handlers, or browser APIs. A good rule: push interactivity to the leaves of the component tree so most of your app stays server-rendered.",
      upvotes: ['user_seed_student1', 'user_seed_student3'],
      isAcceptedAnswer: false,
    },
    {
      postId: postNextServer._id,
      authorId: 'user_seed_educator2',
      authorName: 'Corey Schafer',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=coreyschafer',
      content:
        'One pattern I use: keep the page as a Server Component, fetch data there, and pass it as props to a small Client Component that handles UI interactions. Best of both worlds.',
      upvotes: ['user_seed_student1'],
      isAcceptedAnswer: false,
    },
    // Post: TypeScript for side projects
    {
      postId: postTypeScript._id,
      authorId: 'user_seed_educator2',
      authorName: 'Corey Schafer',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=coreyschafer',
      content:
        "100% worth it from day one. The setup is just `tsc --init` and you're done. The autocomplete and refactoring safety you get pays off within the first week. The 'slower start' argument disappears after the first time TypeScript saves you from a runtime crash.",
      upvotes: ['user_seed_student3', 'user_seed_student1'],
      isAcceptedAnswer: true,
    },
    // Post: missing values
    {
      postId: postMissing._id,
      authorId: 'user_seed_educator1',
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
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
    // Post: overfitting
    {
      postId: postOverfitting._id,
      authorId: 'user_seed_educator1',
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
      content:
        "Yes, that's classic overfitting — large gap between train and validation accuracy. Try in order: 1) Add more training data, 2) Apply L2 regularization, 3) Dropout (for neural nets), 4) Reduce model complexity. Also make sure your validation set is representative.",
      upvotes: ['user_seed_student2', 'user_seed_student1'],
      isAcceptedAnswer: true,
    },
    {
      postId: postOverfitting._id,
      authorId: 'user_seed_student3',
      authorName: 'Vikram Nair',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vikram',
      content:
        'Cross-validation is also your friend here. Instead of a single train/val split, use k-fold cross-validation to get a more reliable estimate of generalization performance.',
      upvotes: ['user_seed_student2'],
      isAcceptedAnswer: false,
    },
    // Post: supervised vs unsupervised
    {
      postId: postSupervisedML._id,
      authorId: 'user_seed_educator1',
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
      content:
        "Supervised: you have labels. Example — predicting house prices (you have historical price data). Unsupervised: no labels. Example — customer segmentation (you don't know groups upfront, you discover them). Use unsupervised when you're exploring data without a predefined target.",
      upvotes: ['user_seed_student1', 'user_seed_student2'],
      isAcceptedAnswer: true,
    },
    // Post: Figma auto-layout
    {
      postId: postFigma._id,
      authorId: 'user_seed_educator2',
      authorName: 'Corey Schafer',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=coreyschafer',
      content:
        'Absolutely switch to auto-layout. It mirrors CSS flexbox — spacing, alignment, and resizing become declarative instead of manual. Your handoff to developers will also be much cleaner since the constraints are explicit.',
      upvotes: ['user_seed_student2', 'user_seed_student1'],
      isAcceptedAnswer: true,
    },
    // Post: user research interviews
    {
      postId: postUserResearch._id,
      authorId: 'user_seed_educator2',
      authorName: 'Corey Schafer',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=coreyschafer',
      content:
        'The Nielsen Norman Group research shows 5 users uncover ~85% of usability issues. Beyond that you get diminishing returns. For generative research (discovering needs), 5-8 interviews per segment is typical. Your manager is likely confusing qualitative research with quantitative surveys — different tools, different sample sizes.',
      upvotes: ['user_seed_student3', 'user_seed_student1'],
      isAcceptedAnswer: true,
    },
    // Post: interview prep
    {
      postId: postInterview._id,
      authorId: 'user_seed_educator1',
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
      content:
        'For a product startup: week 1 — polish 2 React projects (add auth, responsive design, deploy). Week 2–3 — medium-level DSA on arrays, strings, hashmaps. Week 4 — mock interviews and behavioural prep. They care more about shipping than algorithms.',
      upvotes: ['user_seed_student1', 'user_seed_student3'],
      isAcceptedAnswer: false,
    },
    {
      postId: postInterview._id,
      authorId: 'user_seed_educator2',
      authorName: 'Corey Schafer',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=coreyschafer',
      content:
        "Don't neglect CSS! Many frontend interviews include layout challenges — flexbox, grid, and responsive design questions trip up a lot of candidates.",
      upvotes: ['user_seed_student1'],
      isAcceptedAnswer: false,
    },
    // Post: salary negotiation
    {
      postId: postSalary._id,
      authorId: 'user_seed_educator1',
      authorName: 'Brad Traversy',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=bradtraversy',
      content:
        "Absolutely negotiate. The worst they can say is no. Try: 'I'm very excited about this role. Based on my research and the projects I've built, I was hoping for ₹7–7.5 LPA. Is there flexibility?' Having 2 projects and 3 courses is real experience — frame it that way.",
      upvotes: ['user_seed_student2', 'user_seed_student1'],
      isAcceptedAnswer: false,
    },
    {
      postId: postSalary._id,
      authorId: 'user_seed_educator2',
      authorName: 'Corey Schafer',
      authorImage: 'https://api.dicebear.com/9.x/avataaars/svg?seed=coreyschafer',
      content:
        'Also check Glassdoor and Levels.fyi for market rates in your city. Having data behind your ask makes it much easier. And remember — negotiate benefits too (remote work, learning budget, equity) if base salary has a hard cap.',
      upvotes: ['user_seed_student2'],
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
