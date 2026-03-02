import Hero from '../../components/student/Hero'
import Features from '../../components/student/Features'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import ContinueLearning from '../../components/student/ContinueLearning'

const Home = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Hero />

      <Features />

      <ContinueLearning />

      <CoursesSection />

      <TestimonialsSection />

      <CallToAction />

      <Footer />
    </main>
  )
}

export default Home
