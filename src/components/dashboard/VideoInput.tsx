import React, { useState } from 'react'
import { Youtube, Loader2 } from 'lucide-react'

interface VideoInputProps {
  onVideoSubmit: (url: string) => void
  loading?: boolean
  onSidebarToggle?: () => void
}

export function VideoInput({ onVideoSubmit, loading = false }: VideoInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim() && !loading) {
      onVideoSubmit(url.trim())
      setUrl('')
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-purple-100 rounded-full p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
          <Youtube className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Start Your Analysis</h2>
        <p className="text-gray-600 mb-6">
          Paste a YouTube video link to get AI-powered notes, summaries, and quizzes
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Youtube className="w-5 h-5" />
                <span>Analyze Video</span>
              </>
            )}
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-500">
          <p>Supported formats: YouTube videos with captions or audio</p>
        </div>
      </div>
    </div>
  )
}