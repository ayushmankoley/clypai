import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { ChatView } from './ChatView'
import { VideoInput } from './VideoInput'
import { useChats } from '../../hooks/useChats'
import { extractVideoId, fetchVideoMetadata, fetchTranscript } from '../../lib/youtube'

export function Dashboard() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { createChat } = useChats()

  const handleNewChat = () => {
    setSelectedChatId(null)
    setSidebarOpen(false)
  }

  const handleVideoSubmit = async (url: string) => {
    setIsProcessing(true)
    try {
      const videoId = extractVideoId(url)
      if (!videoId) {
        throw new Error('Invalid YouTube URL')
      }
      const [metadata, transcriptData] = await Promise.all([
        fetchVideoMetadata(videoId),
        fetchTranscript(videoId)
      ])
      const chat = await createChat(
        videoId,
        metadata.title,
        metadata.thumbnail,
        url,
        transcriptData.transcript
      )
      if (chat) {
        setSelectedChatId(chat.id)
      }
    } catch (error) {
      console.error('Error processing video:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white z-20">
        <button
          className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span className="font-bold text-lg text-gray-800">Clyp AI</span>
        <span className="w-10" /> {/* Spacer for symmetry */}
      </div>
      <Sidebar
        selectedChatId={selectedChatId}
        onChatSelect={id => { setSelectedChatId(id); setSidebarOpen(false); }}
        onNewChat={handleNewChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-h-0">
        {selectedChatId ? (
          <ChatView chatId={selectedChatId} onSidebarToggle={() => setSidebarOpen(true)} />
        ) : (
          <VideoInput onVideoSubmit={handleVideoSubmit} loading={isProcessing} onSidebarToggle={() => setSidebarOpen(true)} />
        )}
      </div>
    </div>
  )
}