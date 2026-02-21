import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import {
  SectionCard,
  SectionHeader,
  Field,
  inputCls,
  stripHtml,
} from '../../components/educator/course/CourseFormShared'
import ChapterList from '../../components/educator/course/ChapterList'
import CoursePreview from '../../components/educator/course/CoursePreview'

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [image, setImage] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [descPreview, setDescPreview] = useState('')
  const [chapters, setChapters] = useState([])

  const price = parseFloat(coursePrice) || 0
  const disc = parseFloat(discount) || 0
  const finalPrice = price > 0 ? Math.floor(price - (disc * price) / 100) : 0

  const totalLectures = chapters.reduce((s, c) => s + c.chapterContent.length, 0)
  const step1Complete = courseTitle.trim().length > 0
  const step2Complete = price > 0 && !!image
  const step3Complete = chapters.length > 0 && totalLectures > 0
  const sectionsComplete = [step1Complete, step2Complete, step3Complete].filter(Boolean).length

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) setImage(file)
    else toast.error('Please drop an image file')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!courseTitle.trim()) {
      toast.error('Course title is required')
      return
    }
    if (quillRef.current.getText().trim() === '') {
      toast.error('Course description is empty')
      return
    }
    if (!image) {
      toast.error('Please select a thumbnail')
      return
    }
    if (chapters.length === 0) {
      toast.error('Add at least one chapter')
      return
    }
    if (totalLectures === 0) {
      toast.error('Add at least one lecture')
      return
    }

    setIsSubmitting(true)
    const courseData = {
      courseTitle: courseTitle.trim(),
      courseDescription: quillRef.current.root.innerHTML,
      coursePrice: price,
      discount: disc,
      courseContent: chapters,
    }
    const formData = new FormData()
    formData.append('courseData', JSON.stringify(courseData))
    formData.append('image', image)

    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice('')
        setDiscount('')
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ''
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  // poll Quill content for live preview
  useEffect(() => {
    const id = setInterval(() => {
      if (quillRef.current) setDescPreview(stripHtml(quillRef.current.root.innerHTML).slice(0, 120))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-sm text-gray-500 mt-1">
            Build and publish your course for students worldwide
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: 'Info', done: step1Complete },
            { label: 'Pricing', done: step2Complete },
            { label: 'Content', done: step3Complete },
          ].map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                s.done
                  ? 'bg-teal-50 border-teal-200 text-teal-700'
                  : 'bg-white border-gray-200 text-gray-400'
              }`}
            >
              {s.done && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
              {s.label}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 space-y-5">
            <SectionCard>
              <SectionHeader
                step="1"
                title="Basic Information"
                subtitle="Title and description of your course"
                complete={step1Complete}
              />
              <div className="p-6 space-y-5">
                <Field label="Course Title" hint={`${courseTitle.length} / 80`}>
                  <input
                    type="text"
                    maxLength={80}
                    required
                    placeholder="e.g. The Complete JavaScript Course 2024"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Course Description">
                  <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-400 transition">
                    <div ref={editorRef} className="min-h-[160px]" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Describe what students will learn, prerequisites, and who this is for
                  </p>
                </Field>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                step="2"
                title="Pricing & Thumbnail"
                subtitle="Set your price and upload a cover image"
                complete={step2Complete}
              />
              <div className="p-6 space-y-5">
                <Field label="Course Thumbnail">
                  <label
                    htmlFor="thumbnailImage"
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`block border-2 border-dashed rounded-2xl cursor-pointer transition overflow-hidden ${
                      isDragOver
                        ? 'border-teal-400 bg-teal-50/60'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50/60'
                    }`}
                  >
                    {image ? (
                      <div className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt=""
                          className="w-full max-h-52 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold px-4 py-2 rounded-xl">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="w-4 h-4"
                            >
                              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Change image
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="w-7 h-7 text-teal-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          Drop your thumbnail here
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          or{' '}
                          <span className="text-teal-600 font-medium">click to browse files</span>
                        </p>
                        <p className="text-xs text-gray-300 mt-3">
                          PNG, JPG, WEBP · Recommended 1280 × 720
                        </p>
                      </div>
                    )}
                    <input
                      id="thumbnailImage"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Course Price (₹)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={coursePrice}
                        required
                        onChange={(e) => setCoursePrice(e.target.value)}
                        className={`${inputCls} pl-8`}
                      />
                    </div>
                  </Field>

                  <Field label="Discount (%)">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className={`${inputCls} pr-8`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">
                        %
                      </span>
                    </div>
                  </Field>
                </div>

                {price > 0 && (
                  <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    {disc > 0 ? (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{price.toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-teal-700">
                          ₹{finalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                          {disc}% off
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-bold text-gray-800">
                        ₹{price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      Students will pay this amount
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                step="3"
                title="Course Content"
                subtitle="Organize your course into chapters and lectures"
                complete={step3Complete}
              />
              <div className="p-6">
                <ChapterList chapters={chapters} setChapters={setChapters} />
              </div>
            </SectionCard>

            <SectionCard>
              <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Ready to publish?</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {sectionsComplete} of 3 sections complete
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold rounded-xl transition text-sm shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Publishing…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Publish Course
                    </>
                  )}
                </button>
              </div>
            </SectionCard>
          </div>

          <CoursePreview
            image={image}
            courseTitle={courseTitle}
            descPreview={descPreview}
            price={price}
            finalPrice={finalPrice}
            disc={disc}
            chapters={chapters}
            totalLectures={totalLectures}
          />
        </div>
      </form>
    </div>
  )
}

export default AddCourse
