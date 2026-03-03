# SkillRise Codebase Map

This document is a fast lookup guide for future work: where code lives, how major flows work, and which files to edit for each feature.

## 1. High-Level Architecture

- Stack: React 19 + Vite frontend (`client/`), Express 5 + MongoDB backend (`server/`), Clerk auth, Razorpay payments, Groq AI.
- Entry points:
  - Frontend bootstrap: `client/src/main.jsx`
  - Frontend routing shell: `client/src/App.jsx`
  - Global app data/auth context: `client/src/context/AppContext.jsx`
  - Backend server bootstrap + middleware + route mounts: `server/server.js`
- Data flow shape:
  - UI page/component -> Axios call (`client/src/pages/*`) -> Express route (`server/routes/*`) -> controller (`server/controllers/*`) -> model (`server/models/*`).

## 2. Where To Edit What (Quick Lookup)

### Student-facing features
- Home and landing UI: `client/src/pages/student/Home.jsx` and `client/src/components/student/*`
- Course browsing/list/search: `client/src/pages/student/CoursesList.jsx`, `client/src/components/student/SearchBar.jsx`
- Course details + buy CTA: `client/src/pages/student/CourseDetails.jsx`
- Checkout/payment launch: `client/src/pages/student/Checkout.jsx`
- Payment success handling: `client/src/pages/student/PaymentSuccess.jsx`
- Learning player/progress/certificate/rating: `client/src/pages/student/Player.jsx`
- My enrollments: `client/src/pages/student/MyEnrollments.jsx`
- Quiz UI: `client/src/pages/student/Quiz.jsx`, `client/src/components/quiz/*`
- AI chat UI + history: `client/src/pages/student/AIChat.jsx`, `client/src/components/chatbot/MarkDownRenderer.jsx`
- Roadmap UI: `client/src/pages/student/Roadmap.jsx`, `client/src/components/roadmap/*`
- Analytics UI: `client/src/pages/student/Analytics.jsx`, `client/src/components/analytics/*`
- Community feed/post detail: `client/src/pages/student/Community.jsx`, `client/src/pages/student/PostDetail.jsx`, `client/src/components/community/*`

### Educator features
- Educator layout/gate: `client/src/pages/educator/Educator.jsx`, `client/src/components/educator/*`
- Dashboard: `client/src/pages/educator/Dashboard.jsx`
- Course creation: `client/src/pages/educator/AddCourse.jsx`, `client/src/components/educator/course/*`
- Educator course list: `client/src/pages/educator/MyCourses.jsx`
- Enrolled students: `client/src/pages/educator/StudentsEnrolled.jsx`
- Educator application (student side): `client/src/pages/student/BecomeEducator.jsx`

### Admin features
- Admin layout/gate: `client/src/pages/admin/Admin.jsx`, `client/src/components/admin/*`
- Stats/charts dashboard: `client/src/pages/admin/AdminDashboard.jsx`
- Courses table: `client/src/pages/admin/AdminCourses.jsx`
- Users table: `client/src/pages/admin/AdminUsers.jsx`
- Purchases table: `client/src/pages/admin/AdminPurchases.jsx`
- Educator application moderation: `client/src/pages/admin/EducatorApplications.jsx`

### Cross-cutting frontend
- Global app state and initial API fetches: `client/src/context/AppContext.jsx`
- Theme handling: `client/src/context/ThemeContext.jsx`
- Auto time tracking: `client/src/hooks/useTimeTracker.js`
- Route-wide wrappers: `client/src/components/common/*`
- Tailwind styles: `client/src/index.css`, `client/tailwind.config.js`

### Backend service areas
- Auth webhooks and user sync: `server/controllers/webhooks.js`
- User/course/progress/certificate/rating/payment APIs: `server/controllers/userController.js`
- Public course read APIs: `server/controllers/courseController.js`
- Educator APIs: `server/controllers/educatorController.js`
- Educator application lifecycle: `server/controllers/educatorApplicationController.js`
- Admin APIs: `server/controllers/adminController.js`
- Quiz generation/submission/insights: `server/controllers/quizController.js`
- Roadmap generation: `server/controllers/roadmapController.js`
- AI chat logic: `server/controllers/chatbotController.js`, `server/services/chatbot/aiChatbotService.js`
- Community groups/posts/replies: `server/controllers/communityController.js`
- Time analytics ingestion/reporting: `server/controllers/timeTrackingController.js`

## 3. Frontend Route Map (`client/src/App.jsx`)

- `/` -> `Home` (admins auto-redirected to `/admin`)
- `/course-list`, `/course-list/:input` -> `CoursesList`
- `/course/:id` -> `CourseDetails`
- `/my-enrollments` -> `MyEnrollments`
- `/player/:courseId` -> `Player`
- `/ai-chat` -> `AIChat`
- `/analytics` -> `Analytics`
- `/roadmap` -> `Roadmap`
- `/community` -> `Community`
- `/community/post/:postId` -> `PostDetail`
- `/quiz/:courseId/:chapterId` -> `Quiz`
- `/become-educator` -> `BecomeEducator`
- `/checkout/:courseId` -> `Checkout`
- `/payment/success/:courseId` -> `PaymentSuccess`
- `/about`, `/contact`, `/privacy`, `/terms-of-service`, `/cookies`, `/careers`, `/blog`, `/help` -> general content pages
- `/educator/*` -> educator layout and pages
- `/admin/*` -> admin layout and pages

## 4. Backend API Map (by router)

### `/api/course` (`server/routes/courseRoute.js`)
- `GET /all` -> list published courses
- `GET /:id` -> single course details

### `/api/user` (`server/routes/userRoutes.js`) (requires Clerk auth)
- `GET /data`
- `GET /enrolled-courses`
- `GET /enrolled-courses/:courseId`
- `GET /analytics`
- `POST /purchase`
- `POST /verify-razorpay`
- `POST /update-course-progress`
- `POST /get-course-progress`
- `POST /generate-certificate`
- `POST /add-rating`
- `POST /track-time`
- `POST /generate-personal-roadmap`
- `POST /generate-custom-roadmap`
- `POST /ai-chat`
- `POST /previous-chats`
- `GET /chat/:sessionId`
- `DELETE /chat/:sessionId`

### `/api/educator` (`server/routes/educatorRoutes.js`)
- Public/any logged-in user:
  - `POST /apply`
  - `GET /application-status`
- Protected educator-only:
  - `POST /add-course` (multipart image via multer)
  - `GET /courses`
  - `GET /dashboard`
  - `GET /enrolled-students`

### `/api/admin` (`server/routes/adminRoutes.js`) (admin-only)
- `GET /stats`
- `GET /chart-data`
- `GET /courses`
- `GET /purchases`
- `GET /users`
- `GET /educator-applications`
- `PATCH /educator-applications/:id/approve`
- `PATCH /educator-applications/:id/reject`

### `/api/community` (`server/routes/communityRoutes.js`)
- Groups: `GET /groups`, `POST /groups`, `POST /groups/:groupId/membership`
- Posts: `GET /posts`, `POST /posts`, `GET /posts/:postId`, `POST /posts/:postId/upvote`, `PATCH /posts/:postId/resolve`, `DELETE /posts/:postId`
- Replies: `POST /posts/:postId/replies`, `POST /posts/:postId/replies/:replyId/upvote`, `PATCH /posts/:postId/replies/:replyId/accept`

### `/api/quiz` (`server/routes/quizRoutes.js`)
- Educator: `POST /generate`, `GET /educator-insights`
- Student/self: `GET /my-results`, `POST /submit`, `GET /results/:courseId/:chapterId`, `GET /course-results/:courseId`, `GET /:courseId/:chapterId`

## 5. Core Models (`server/models/*`)

- `User.js`: Clerk user profile + enrolled course refs.
- `Course.js`: title/description/pricing/publishing + nested chapters/lectures + ratings/enrollment counters.
- `Purchase.js`: payment lifecycle (`created`, `pending`, `completed`, `failed`, `refunded`) + provider IDs.
- `CourseProgress.js`: per-user per-course lecture completion state.
- `Certificate.js`: generated completion certificate metadata + PDF URL.
- `Quiz.js`: generated chapter quiz question bank.
- `QuizResult.js`: user quiz attempts, score, recommendations, answers.
- `AiChat.js`: chat sessions/messages per user.
- `TimeTracking.js`: page-level duration events for analytics.
- `Group.js`, `GroupMembership.js`, `CommunityPost.js`, `Reply.js`: community domain.
- `EducatorApplication.js`: educator onboarding moderation state.

## 6. Important Infra/Config Files

- CI (lint/format/build): `.github/workflows/build.yml`
- Docker Hub deploy pipelines: `.github/workflows/deploy.yml`
- Full stack containers: `docker-compose.yml`
- Frontend container/nginx: `client/Dockerfile`, `client/nginx.conf`
- Backend container: `server/Dockerfile`
- Vercel configs: `client/vercel.json`, `server/vercel.json`
- Lint/format configs: `client/eslint.config.js`, `server/eslint.config.js`, `.prettierrc` files

## 7. How Main Flows Work (Edit Path)

- New page or route:
  - Add page in `client/src/pages/...`
  - Register route in `client/src/App.jsx`
  - Add navigation entry in matching navbar/sidebar component.

- New API feature:
  - Add endpoint in `server/routes/*.js`
  - Implement handler in `server/controllers/*.js`
  - Add/extend model in `server/models/*.js` if persistence changes
  - Call from frontend page/context via axios.

- Role access changes:
  - Backend guards: `server/middlewares/authMiddleware.js`
  - Frontend role checks: `client/src/context/AppContext.jsx` and layout pages (`Admin.jsx`, `Educator.jsx`).

- Payment updates:
  - API: `server/controllers/userController.js`
  - Gateway service: `server/services/payments/razorpay.service.js`
  - Completion logic (single source of truth): `server/services/payments/order.service.js`
  - Webhook verification: `server/controllers/webhooks.js`
  - Client checkout/success: `client/src/pages/student/Checkout.jsx`, `client/src/pages/student/PaymentSuccess.jsx`

- AI behavior updates:
  - Chat model/call: `server/services/chatbot/aiChatbotService.js`
  - Chat orchestration/storage: `server/controllers/chatbotController.js`
  - Quiz generation logic: `server/controllers/quizController.js`
  - Roadmap generation logic: `server/controllers/roadmapController.js`

## 8. Tracked File Inventory

The repository currently has **170 tracked files** (`git ls-files`).


### Full list
- `.github/workflows/build.yml`
- `.github/workflows/deploy.yml`
- `.gitignore`
- `README.md`
- `client/.dockerignore`
- `client/.gitignore`
- `client/.prettierignore`
- `client/.prettierrc`
- `client/Dockerfile`
- `client/README.md`
- `client/eslint.config.js`
- `client/index.html`
- `client/nginx.conf`
- `client/package-lock.json`
- `client/package.json`
- `client/postcss.config.js`
- `client/public/favicon.svg`
- `client/src/App.jsx`
- `client/src/assets/accenture_logo.svg`
- `client/src/assets/adobe_logo.svg`
- `client/src/assets/logo-dark.svg`
- `client/src/assets/logo-light.svg`
- `client/src/assets/microsoft_logo.svg`
- `client/src/assets/paypal_logo.svg`
- `client/src/assets/walmart_logo.svg`
- `client/src/components/admin/Navbar.jsx`
- `client/src/components/admin/Sidebar.jsx`
- `client/src/components/analytics/ActivityTab.jsx`
- `client/src/components/analytics/CoursesTab.jsx`
- `client/src/components/analytics/QuizzesTab.jsx`
- `client/src/components/chatbot/MarkDownRenderer.jsx`
- `client/src/components/common/ErrorBoundary.jsx`
- `client/src/components/common/Loading.jsx`
- `client/src/components/common/ScrollToTop.jsx`
- `client/src/components/common/Skeleton.jsx`
- `client/src/components/community/CreateGroupModal.jsx`
- `client/src/components/community/CreatePostForm.jsx`
- `client/src/components/community/GroupsPanel.jsx`
- `client/src/components/community/PostCard.jsx`
- `client/src/components/community/ReplyCard.jsx`
- `client/src/components/educator/Footer.jsx`
- `client/src/components/educator/Navbar.jsx`
- `client/src/components/educator/Sidebar.jsx`
- `client/src/components/educator/course/ChapterList.jsx`
- `client/src/components/educator/course/CourseFormShared.jsx`
- `client/src/components/educator/course/CoursePreview.jsx`
- `client/src/components/quiz/QuizQuestion.jsx`
- `client/src/components/quiz/QuizResults.jsx`
- `client/src/components/quiz/ScoreRing.jsx`
- `client/src/components/roadmap/GeneratingSpinner.jsx`
- `client/src/components/roadmap/RoadmapView.jsx`
- `client/src/components/roadmap/StageCard.jsx`
- `client/src/components/shared/Avatar.jsx`
- `client/src/components/student/CallToAction.jsx`
- `client/src/components/student/Companies.jsx`
- `client/src/components/student/ContinueLearning.jsx`
- `client/src/components/student/CourseCard.jsx`
- `client/src/components/student/CoursesSection.jsx`
- `client/src/components/student/Features.jsx`
- `client/src/components/student/Footer.jsx`
- `client/src/components/student/Hero.jsx`
- `client/src/components/student/Navbar.jsx`
- `client/src/components/student/Rating.jsx`
- `client/src/components/student/SearchBar.jsx`
- `client/src/components/student/TestimonialsSection.jsx`
- `client/src/components/student/VideoPlayer.jsx`
- `client/src/components/ui/accordion.jsx`
- `client/src/components/ui/badge.jsx`
- `client/src/components/ui/button.jsx`
- `client/src/components/ui/select.jsx`
- `client/src/components/ui/social-icons.jsx`
- `client/src/context/AppContext.jsx`
- `client/src/context/ThemeContext.jsx`
- `client/src/hooks/useInView.js`
- `client/src/hooks/useTimeTracker.js`
- `client/src/index.css`
- `client/src/lib/utils.js`
- `client/src/main.jsx`
- `client/src/pages/admin/Admin.jsx`
- `client/src/pages/admin/AdminCourses.jsx`
- `client/src/pages/admin/AdminDashboard.jsx`
- `client/src/pages/admin/AdminPurchases.jsx`
- `client/src/pages/admin/AdminUsers.jsx`
- `client/src/pages/admin/EducatorApplications.jsx`
- `client/src/pages/educator/AddCourse.jsx`
- `client/src/pages/educator/Dashboard.jsx`
- `client/src/pages/educator/Educator.jsx`
- `client/src/pages/educator/MyCourses.jsx`
- `client/src/pages/educator/StudentsEnrolled.jsx`
- `client/src/pages/general/AboutUs.jsx`
- `client/src/pages/general/Blog.jsx`
- `client/src/pages/general/Careers.jsx`
- `client/src/pages/general/ContactUs.jsx`
- `client/src/pages/general/DataPrivacy.jsx`
- `client/src/pages/general/HelpCenter.jsx`
- `client/src/pages/general/SiteCookies.jsx`
- `client/src/pages/general/TermsOfService.jsx`
- `client/src/pages/student/AIChat.jsx`
- `client/src/pages/student/Analytics.jsx`
- `client/src/pages/student/BecomeEducator.jsx`
- `client/src/pages/student/Checkout.jsx`
- `client/src/pages/student/Community.jsx`
- `client/src/pages/student/CourseDetails.jsx`
- `client/src/pages/student/CoursesList.jsx`
- `client/src/pages/student/Home.jsx`
- `client/src/pages/student/MyEnrollments.jsx`
- `client/src/pages/student/NotFound.jsx`
- `client/src/pages/student/PaymentSuccess.jsx`
- `client/src/pages/student/Player.jsx`
- `client/src/pages/student/PostDetail.jsx`
- `client/src/pages/student/Quiz.jsx`
- `client/src/pages/student/Roadmap.jsx`
- `client/src/utils/analyticsHelpers.js`
- `client/src/utils/time.js`
- `client/tailwind.config.js`
- `client/vercel.json`
- `client/vite.config.js`
- `docker-compose.yml`
- `server/.DS_Store`
- `server/.dockerignore`
- `server/.gitignore`
- `server/.prettierignore`
- `server/.prettierrc`
- `server/Dockerfile`
- `server/configs/cloudinary.js`
- `server/configs/mongodb.js`
- `server/configs/multer.js`
- `server/controllers/adminController.js`
- `server/controllers/chatbotController.js`
- `server/controllers/communityController.js`
- `server/controllers/courseController.js`
- `server/controllers/educatorApplicationController.js`
- `server/controllers/educatorController.js`
- `server/controllers/quizController.js`
- `server/controllers/roadmapController.js`
- `server/controllers/timeTrackingController.js`
- `server/controllers/userController.js`
- `server/controllers/webhooks.js`
- `server/eslint.config.js`
- `server/middlewares/authMiddleware.js`
- `server/models/AiChat.js`
- `server/models/Certificate.js`
- `server/models/CommunityPost.js`
- `server/models/Course.js`
- `server/models/CourseProgress.js`
- `server/models/EducatorApplication.js`
- `server/models/Group.js`
- `server/models/GroupMembership.js`
- `server/models/Purchase.js`
- `server/models/Quiz.js`
- `server/models/QuizResult.js`
- `server/models/Reply.js`
- `server/models/TimeTracking.js`
- `server/models/User.js`
- `server/package-lock.json`
- `server/package.json`
- `server/routes/adminRoutes.js`
- `server/routes/communityRoutes.js`
- `server/routes/courseRoute.js`
- `server/routes/educatorRoutes.js`
- `server/routes/quizRoutes.js`
- `server/routes/userRoutes.js`
- `server/seed.js`
- `server/server.js`
- `server/services/chatbot/aiChatbotService.js`
- `server/services/payments/order.service.js`
- `server/services/payments/razorpay.service.js`
- `server/utils/generateCertificateHtml.js`
- `server/utils/generatePdf.js`
- `server/vercel.json`
