const CoursePreview = ({
  image,
  courseTitle,
  descPreview,
  price,
  finalPrice,
  disc,
  chapters,
  totalLectures,
}) => (
  <div className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 shrink-0 sticky top-24">
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Live Preview
        </p>
      </div>

      <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {image ? (
          <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="w-10 h-10 text-gray-300"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
          {courseTitle || <span className="text-gray-300 font-normal italic">Course title…</span>}
        </p>

        {descPreview && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{descPreview}…</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {price > 0 ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                ₹{(disc > 0 ? finalPrice : price).toLocaleString()}
              </span>
              {disc > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{price.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-full">
                    {disc}% off
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-300 italic">Price not set</span>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-gray-400">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
            {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-gray-400">
              <path d="M8 5v14l11-7z" />
            </svg>
            {totalLectures} lecture{totalLectures !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>

    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 space-y-3">
      <p className="text-xs font-bold text-teal-700 uppercase tracking-widest">Tips for success</p>
      <ul className="space-y-2">
        {[
          'Use a specific, keyword-rich title',
          'Thumbnail at 1280×720 looks sharpest',
          'Mark the first lecture as Free Preview',
          'Keep chapters under 10 lectures each',
          'Aim for 5+ hours of total content',
        ].map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-teal-800 leading-relaxed">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3 text-teal-500 mt-0.5 shrink-0"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default CoursePreview
