import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { QuickPrompts } from './QuickPrompts'
import { useChats } from '../../hooks/useChats'
import { generateResponse } from '../../lib/gemini'
import { ChevronDown } from 'lucide-react'
import { TextShimmer } from '../ui/text-shimmer'

interface ChatViewProps {
  chatId: string
  onSidebarToggle?: () => void
}

export function ChatView({ chatId }: ChatViewProps) {
  const { chats, updateChatMessages } = useChats()
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [quickActionsOpen, setQuickActionsOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false)

  const chat = chats.find(c => c.id === chatId)

  // Only auto-scroll while streaming, or once when chat is loaded
  useEffect(() => {
    if (isStreaming) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else if (!hasAutoScrolled && chat?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setHasAutoScrolled(true)
    }
  }, [chat?.messages, streamingMessage, isStreaming, hasAutoScrolled])

  // Reset auto-scroll flag when chatId changes
  useEffect(() => {
    setHasAutoScrolled(false)
  }, [chatId])

  const handleSendMessage = async (message: string) => {
    if (!chat) return
    const userMessage = {
      role: 'user' as const,
      content: message,
      created_at: new Date().toISOString()
    }
    const updatedMessages = [...chat.messages, userMessage]
    await updateChatMessages(chatId, updatedMessages)
    setIsStreaming(true)
    setStreamingMessage('')
    try {
      let fullResponse = ''
      for await (const chunk of generateResponse(chat.messages, message)) {
        fullResponse += chunk
        setStreamingMessage(fullResponse)
      }
      const assistantMessage = {
        role: 'assistant' as const,
        content: fullResponse,
        created_at: new Date().toISOString()
      }
      const finalMessages = [...updatedMessages, assistantMessage]
      await updateChatMessages(chatId, finalMessages)
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString()
      }
      const finalMessages = [...updatedMessages, errorMessage]
      await updateChatMessages(chatId, finalMessages)
    } finally {
      setIsStreaming(false)
      setStreamingMessage('')
    }
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Chat not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-2 sm:p-4 flex items-center space-x-2 sm:space-x-3">
        <img
          src={chat.video_thumbnail}
          alt={chat.video_title}
          className="w-12 h-9 sm:w-16 sm:h-12 rounded object-cover"
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-800 leading-tight truncate text-base sm:text-lg">{chat.video_title}</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {chat.messages.length - 1} {chat.messages.length === 2 ? 'message' : 'messages'}
          </p>
        </div>
      </div>
      {/* Quick Actions Collapsible */}
      <div className="border-b border-gray-200 px-2 sm:px-4 py-2 flex items-center justify-between cursor-pointer select-none" onClick={() => setQuickActionsOpen(v => !v)}>
        <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${quickActionsOpen ? 'rotate-0' : '-rotate-90'}`} />
      </div>
      {quickActionsOpen && <QuickPrompts onPromptSelect={handleSendMessage} disabled={isStreaming} />}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {chat.messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            isTranscript={message.role === 'system'}
          />
        ))}
        {isStreaming && (
          <ChatMessage
            role="assistant"
            content={streamingMessage || (
              <TextShimmer 
                className="text-gray-600 font-medium"
                duration={1.5}
              >
                Generating response...
              </TextShimmer>
            )}
            isStreaming={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isStreaming} />
    </div>
  )
}