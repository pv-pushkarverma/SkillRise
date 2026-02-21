import express from 'express'
import {
  generateQuiz,
  getQuiz,
  submitQuiz,
  getQuizResults,
  getCourseQuizResults,
  getAllMyQuizResults,
  getEducatorQuizInsights,
} from '../controllers/quizController.js'
import { protectEducator } from '../middlewares/authMiddleware.js'

const quizRouter = express.Router()

// Educator
quizRouter.post('/generate', protectEducator, generateQuiz)
quizRouter.get('/educator-insights', protectEducator, getEducatorQuizInsights)
quizRouter.get('/my-results', getAllMyQuizResults)

// Student
// submit answers to get score and AI recommendations
quizRouter.post('/submit', submitQuiz)
quizRouter.get('/results/:courseId/:chapterId', getQuizResults) // Previous Quiz
quizRouter.get('/course-results/:courseId', getCourseQuizResults) // Chapter Wise Total Quiz
quizRouter.get('/:courseId/:chapterId', getQuiz) // Get Last Quiz

export default quizRouter
