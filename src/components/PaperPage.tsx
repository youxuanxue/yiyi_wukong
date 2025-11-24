import { useEffect, useState } from 'react'

import { PaperData, PaperSection, PaperMetadata } from '../types/shared';

// --- Types ---
interface PaperListItem {
  id: string;
  meta: PaperMetadata;
}

// --- Components ---

const LogoBadge = () => (
  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/30 backdrop-blur">
    <div className="w-10 h-10 rounded-full bg-white text-indigo-600 font-bold text-xl flex items-center justify-center shadow-inner">
      {'懿'}
    </div>
    <div>
      <p className="text-lg font-semibold tracking-wide">懿起AI</p>
      <p className="text-xs text-white/80">AI 早学早香 · Better Together</p>
    </div>
  </div>
)

const PaperPage = () => {
  const [allPapers, setAllPapers] = useState<PaperListItem[]>([])
  const [papers, setPapers] = useState<PaperListItem[]>([])
  const [paperData, setPaperData] = useState<PaperData | null>(null)
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch paper list
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const url = selectedTag
          ? `http://localhost:3001/api/papers?tag=${encodeURIComponent(selectedTag)}`
          : 'http://localhost:3001/api/papers'
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch papers')
        }
        const data = await response.json()
        setPapers(data)
        // Save all papers on first load (when no tag selected)
        if (!selectedTag) {
          setAllPapers(data)
        }
        // Auto-select first paper if none selected
        if (data.length > 0 && !selectedPaperId) {
          setSelectedPaperId(data[0].id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPapers()
  }, [selectedTag])

  // Fetch selected paper details
  useEffect(() => {
    if (!selectedPaperId) return

    const fetchPaperDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/paper/${selectedPaperId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch paper details')
        }
        const data = await response.json()
        setPaperData(data)
        if (data.sections.length > 0) {
          setActiveSection(data.sections[0].id)
        }
        // Scroll main content to top when paper changes
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchPaperDetails()
  }, [selectedPaperId])

  // Intersection observer for active section
  useEffect(() => {
    if (!paperData) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.3,
      },
    )

    paperData.sections.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [paperData])

  // Get all unique tags from ALL papers (not filtered)
  const allTags = Array.from(
    new Set(allPapers.flatMap(p => p.meta.tags))
  ).sort()

  // Colors for tags
  const tagColors = [
    { bg: 'bg-blue-100', text: 'text-blue-700', hover: 'hover:bg-blue-200' },
    { bg: 'bg-green-100', text: 'text-green-700', hover: 'hover:bg-green-200' },
    { bg: 'bg-purple-100', text: 'text-purple-700', hover: 'hover:bg-purple-200' },
    { bg: 'bg-orange-100', text: 'text-orange-700', hover: 'hover:bg-orange-200' },
  ]

  const renderSectionContent = (section: PaperSection) => {
    if (section.type === 'text') {
      return (
        <div className="prose text-gray-700 leading-relaxed space-y-4">
          {section.content.map((paragraph, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
          {section.id === 'intro' && (
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 inline-block mt-4"
            >
              更多 →
            </a>
          )}
        </div>
      )
    } else if (section.type === 'gallery') {
      return (
        <div className="grid grid-cols-4 gap-4">
          {section.content.map((item, idx) => (
            <div
              key={idx}
              className="aspect-[4/3] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center"
            >
              <span className="text-gray-400 text-sm">图 {item}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>
  if (!paperData) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部 Banner */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-10 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <LogoBadge />
          <div className="md:text-right space-y-2">
            <p className="text-2xl font-semibold">最新研究 · 热门洞察 · 学术速递</p>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* 左侧论文列表 */}
        <div className="w-80">
          <aside className="w-80 bg-white border-r border-gray-200 fixed top-24 left-0 h-[calc(100vh-6rem)] flex flex-col">
            {/* Tag Filter Section - Sticky */}
            <div className="shrink-0">
              <div className="p-6 pb-4 border-b border-gray-200 bg-white">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">筛选标签</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === null
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    全部
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paper List Header - Sticky */}
            <div className="shrink-0 p-6 pb-3 pt-4 bg-white border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">
                论文列表 ({papers.length})
              </h3>
            </div>

            {/* Paper List - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3">
              <div className="space-y-3">
                {papers.map((paper) => {
                  const isSelected = paper.id === selectedPaperId
                  const displayAuthors = paper.meta.authors.slice(0, 3)
                  const hasMore = paper.meta.authors.length > 3

                  return (
                    <div
                      key={paper.id}
                      onClick={() => setSelectedPaperId(paper.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'
                        }`}
                    >
                      <h4 className={`font-semibold text-sm mb-2 line-clamp-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                        {paper.meta.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {displayAuthors.join(', ')}{hasMore ? ' 等' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {paper.meta.tags.map((tag, idx) => {
                          const color = tagColors[idx % tagColors.length]
                          return (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 ${color.bg} ${color.text} rounded text-xs`}
                            >
                              {tag}
                            </span>
                          )
                        })}
                      </div>
                      <p className="text-xs text-gray-500">{paper.meta.date}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* 主内容区域 */}
        <main className="flex-1 max-w-4xl px-8 py-8 pl-10">
          {/* 标题和元信息 */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {paperData.meta.title}
            </h1>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 mb-3">{paperData.meta.authors.join(', ')}</p>
                <div className="flex flex-wrap gap-2">
                  {paperData.meta.tags.map((tag, index) => {
                    const color = tagColors[index % tagColors.length]
                    return (
                      <span
                        key={tag}
                        className={`px-3 py-1 ${color.bg} ${color.text} rounded-full text-sm cursor-pointer ${color.hover}`}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{paperData.meta.date}</p>
              </div>
            </div>
          </header>

          {/* 内容区域 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {paperData.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className={`${index > 0 ? 'mt-10' : ''} scroll-mt-8`}
              >
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                {renderSectionContent(section)}
              </section>
            ))}

            <div className="mt-12 flex items-center gap-3 text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <a
                href={paperData.meta.paperLink}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-semibold underline hover:text-blue-800"
              >
                原味原文
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* 底部操作栏 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span>点赞</span>
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span>收藏</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PaperPage
