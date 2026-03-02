import Footer from '../../components/student/Footer'
const posts = [
  {
    category: 'Learning Tips',
    title: 'How to Stay Consistent with Online Learning',
    excerpt:
      'Building a daily learning habit is the single most important factor in completing courses. Here are 7 science-backed techniques to stay on track.',
    author: 'Priya Mehta',
    date: 'Feb 10, 2026',
    readTime: '5 min read',
    initials: 'PM',
  },
  {
    category: 'Career',
    title: 'Top 10 Skills Employers Want in 2026',
    excerpt:
      'The job market is evolving rapidly. From AI literacy to cloud computing, here are the skills that will make you stand out this year.',
    author: 'Rahul Verma',
    date: 'Feb 3, 2026',
    readTime: '7 min read',
    initials: 'RV',
  },
  {
    category: 'Educator Spotlight',
    title: 'From Engineer to Educator: A Story of Impact',
    excerpt:
      "Meet Sneha Kapoor, who left a senior role at a top tech firm to teach 8,000 students on SkillRise. Here's why she made the switch.",
    author: 'SkillRise Team',
    date: 'Jan 27, 2026',
    readTime: '6 min read',
    initials: 'SR',
  },
  {
    category: 'Platform',
    title: 'Introducing AI Tutor: Your 24/7 Learning Assistant',
    excerpt:
      "We've launched a new AI-powered chat assistant that answers questions about your courses, helps debug code, and explains concepts on demand.",
    author: 'Aryan Sharma',
    date: 'Jan 20, 2026',
    readTime: '4 min read',
    initials: 'AS',
  },
  {
    category: 'Learning Tips',
    title: 'The Feynman Technique: Learn Anything Faster',
    excerpt:
      "The Nobel-winning physicist had a simple rule: if you can't explain it simply, you don't understand it yet. Here's how to apply this to your learning.",
    author: 'Priya Mehta',
    date: 'Jan 12, 2026',
    readTime: '4 min read',
    initials: 'PM',
  },
  {
    category: 'Career',
    title: 'Building a Developer Portfolio That Gets Interviews',
    excerpt:
      'Your portfolio is your first impression. Learn the key elements recruiters look for and the common mistakes that cost candidates interviews.',
    author: 'Rahul Verma',
    date: 'Jan 5, 2026',
    readTime: '8 min read',
    initials: 'RV',
  },
]

const categoryColors = {
  'Learning Tips': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Career: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Educator Spotlight': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Platform: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

const Blog = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">SkillRise Blog</h1>
        <p className="text-teal-100 text-lg max-w-xl mx-auto">
          Learning tips, career advice, platform updates, and stories from our educator community.
        </p>
      </section>

      {/* Posts */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              {/* Card header */}
              <div className="bg-gray-50 dark:bg-gray-900 h-36 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-200 dark:text-gray-700">
                  {post.initials}
                </span>
              </div>

              <div className="flex flex-col gap-3 p-5 flex-1">
                <span
                  className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}
                >
                  {post.category}
                </span>

                <h2 className="font-bold text-base leading-snug">{post.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
                  <span>{post.author}</span>
                  <span>
                    {post.date} · {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-12">
          More articles coming soon. Subscribe to our newsletter in the footer to stay updated.
        </p>
      </section>

      <Footer />
    </div>
  )
}

export default Blog
