import { useContext, useState } from 'react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import RoadmapView from '../../components/roadmap/RoadmapView'
import GeneratingSpinner from '../../components/roadmap/GeneratingSpinner'

const EXAMPLE_TOPICS = [
  'Machine Learning',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'DevOps & Cloud',
  'Cybersecurity',
  'Blockchain',
  'UI/UX Design',
  'System Design',
  'Rust Programming',
]

const Roadmap = () => {
  const { backendUrl, getToken, enrolledCourses } = useContext(AppContext)
  const { user } = useUser()
  const { openSignIn } = useClerk()

  const [tab, setTab] = useState('personal')

  const [personalRoadmap, setPersonalRoadmap] = useState(null)
  const [personalLoading, setPersonalLoading] = useState(false)
  const [personalError, setPersonalError] = useState(null)

  const [customRoadmap, setCustomRoadmap] = useState(null)
  const [customTopic, setCustomTopic] = useState('')
  const [customLoading, setCustomLoading] = useState(false)
  const [customError, setCustomError] = useState(null)

  const generatePersonal = async () => {
    setPersonalLoading(true)
    setPersonalError(null)
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/generate-personal-roadmap`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) setPersonalRoadmap(data.roadmap)
      else setPersonalError(data.message)
    } catch (e) {
      setPersonalError(e.message)
    } finally {
      setPersonalLoading(false)
    }
  }

  const generateCustom = async () => {
    if (!customTopic.trim()) return
    setCustomLoading(true)
    setCustomError(null)
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/generate-custom-roadmap`,
        { topic: customTopic },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) setCustomRoadmap(data.roadmap)
      else setCustomError(data.message)
    } catch (e) {
      setCustomError(e.message)
    } finally {
      setCustomLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">🗺️</div>
        <h2 className="text-2xl font-semibold text-gray-800">Sign in to view your roadmap</h2>
        <p className="text-gray-500 max-w-sm">
          Get a personalized AI-powered learning path based on your enrolled courses and progress.
        </p>
        <button
          onClick={() => openSignIn()}
          className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
        >
          Sign in
        </button>
      </div>
    )
  }

  const courseCount = enrolledCourses?.length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Roadmap</h1>
              <p className="text-gray-500 mt-1 max-w-lg">
                AI-powered paths tailored to your goals and current progress.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shrink-0">
              <span>✨</span>
              <span>Powered by AI</span>
            </div>
          </div>

          <div className="flex gap-1 mt-6 bg-gray-100 p-1 rounded-xl w-fit">
            {[
              { id: 'personal', label: '🎓  My Learning Path' },
              { id: 'custom', label: '✦  Custom Roadmap' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-8">
        {tab === 'personal' && (
          <div>
            {!personalRoadmap &&
              !personalLoading &&
              (courseCount === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-3">📚</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    No courses enrolled yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-5">
                    Enroll in at least one course so the AI can build your personalized roadmap.
                  </p>
                  <Link
                    to="/course-list"
                    className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 via-blue-400 to-violet-500" />
                  <div className="p-10 text-center">
                    <div className="text-5xl mb-4">🗺️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Generate Your Learning Roadmap
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-2 text-sm leading-relaxed">
                      The AI will analyze your{' '}
                      <span className="font-semibold text-gray-700">{courseCount}</span> enrolled
                      course{courseCount !== 1 ? 's' : ''} and build a complete, stage-by-stage path
                      — showing what you've mastered, what you're building, and where to go next.
                    </p>

                    <div className="flex flex-wrap justify-center gap-1.5 mb-6 mt-4">
                      {enrolledCourses?.slice(0, 5).map((c) => (
                        <span
                          key={c._id}
                          className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full"
                        >
                          {c.courseTitle}
                        </span>
                      ))}
                      {courseCount > 5 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                          +{courseCount - 5} more
                        </span>
                      )}
                    </div>

                    <button
                      onClick={generatePersonal}
                      className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                    >
                      ✨ Generate My Roadmap
                    </button>

                    {personalError && <p className="text-red-500 text-sm mt-4">{personalError}</p>}
                  </div>
                </div>
              ))}

            {personalLoading && <GeneratingSpinner label="Analyzing your learning journey…" />}

            {personalRoadmap && !personalLoading && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{personalRoadmap.title}</h2>
                </div>
                <RoadmapView
                  roadmap={personalRoadmap}
                  onRegenerate={generatePersonal}
                  regenerating={personalLoading}
                />
              </div>
            )}
          </div>
        )}

        {tab === 'custom' && (
          <div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400" />
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Generate a roadmap for any topic
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enter any skill, technology, or career path — the AI will build a structured,
                  stage-by-stage plan.
                </p>
                <div className="flex gap-2">
                  <input
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !customLoading && generateCustom()}
                    placeholder="e.g. Machine Learning, System Design, iOS Development…"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                  <button
                    onClick={generateCustom}
                    disabled={!customTopic.trim() || customLoading}
                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:shadow-md whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 items-center">
                  <span className="text-xs text-gray-400">Try:</span>
                  {EXAMPLE_TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setCustomTopic(t)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition"
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {customError && <p className="text-red-500 text-sm mt-3">{customError}</p>}
              </div>
            </div>

            {customLoading && <GeneratingSpinner label={`Building your ${customTopic} roadmap…`} />}

            {customRoadmap && !customLoading && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{customRoadmap.title}</h2>
                </div>
                <RoadmapView
                  roadmap={customRoadmap}
                  onRegenerate={generateCustom}
                  regenerating={customLoading}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Roadmap
