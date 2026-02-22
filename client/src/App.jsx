import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import 'quill/dist/quill.snow.css'

import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Analytics from './pages/student/Analytics'
import Roadmap from './pages/student/Roadmap'
import Community from './pages/student/Community'
import PostDetail from './pages/student/PostDetail'

import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'
import AIChat from './pages/student/AIChat'
import Quiz from './pages/student/Quiz'
import BecomeEducator from './pages/student/BecomeEducator'
import PaymentSuccess from './pages/student/PaymentSuccess'
import Checkout from './pages/student/Checkout'

import useTimeTracker from './hooks/useTimeTracker'

const App = () => {
  useTimeTracker()

  const isEducatorRoute = useMatch('/educator/*')
  return (
    <div className="text-default min-h-screen bg-white dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/post/:postId" element={<PostDetail />} />
        <Route path="/quiz/:courseId/:chapterId" element={<Quiz />} />
        <Route path="/become-educator" element={<BecomeEducator />} />
        <Route path="/checkout/:courseId" element={<Checkout />} />
        <Route path="/payment/success/:courseId" element={<PaymentSuccess />} />

        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="students-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
