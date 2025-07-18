import { useState } from 'react'
import { Bot, User, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  role: 'system' | 'user' | 'assistant'
  content: string | React.ReactNode
  isStreaming?: boolean
  isTranscript?: boolean
}

export function ChatMessage({ role, content, isStreaming = false, isTranscript = false }: ChatMessageProps) {
  const [expanded, setExpanded] = useState(false)

  if (role === 'system' || isTranscript) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center cursor-pointer select-none" onClick={() => setExpanded(e => !e)}>
            <p className="text-sm font-medium text-blue-800 mr-2 truncate">Video Transcript Loaded</p>
            <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${expanded ? 'rotate-0' : '-rotate-90'}`} />
          </div>
          {expanded && (
            <div className="text-xs text-blue-700 bg-white/50 rounded p-2 max-h-48 overflow-y-auto mt-1 whitespace-pre-line">
              {typeof content === 'string' ? content.replace('Video Transcript:\n\n', '') : content}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-start space-x-3 mb-6 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' && (
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-3xl ${role === 'user' ? 'order-first' : ''}`}>
        <div className={`rounded-lg p-4 ${
          role === 'user' 
            ? 'bg-purple-600 text-white ml-auto' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <div className="whitespace-pre-wrap">
            {role === 'assistant' ? (
              typeof content === 'string' ? (
                <div className="prose prose-sm sm:prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-li:marker:text-gray-500 prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded">
                  <ReactMarkdown>
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                content
              )
            ) : (
              <>
                {content}
                {isStreaming && <span className="animate-pulse">|</span>}
              </>
            )}
          </div>
        </div>
      </div>
      {role === 'user' && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}