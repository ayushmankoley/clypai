import { useState } from 'react'
import { MessageCircle, LogOut, Youtube, X, ChevronLeft, ChevronRight, PenLine, Search } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useChats } from '../../hooks/useChats'

interface SidebarProps {
  selectedChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ selectedChatId, onChatSelect, onNewChat, open = false, onClose }: SidebarProps) {
  const { user, signOut } = useAuth()
  const { chats, loading } = useChats()
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  // Sidebar width classes
  const sidebarWidth = collapsed ? 'w-16' : 'w-64'

  // Filtered chats for search
  const filteredChats = chats.filter(chat =>
    chat.video_title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Mobile drawer overlay
  return (
    <>
      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 p-4 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search chats..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg mb-4"
            />
            <div className="max-h-80 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No chats found</div>
              ) : (
                <ul>
                  {filteredChats.map(chat => (
                    <li key={chat.id}>
                      <button
                        className="w-full text-left p-3 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          setSearchOpen(false)
                          onChatSelect(chat.id)
                        }}
                      >
                        <img
                          src={chat.video_thumbnail}
                          alt={chat.video_title}
                          className="w-8 h-6 rounded object-cover flex-shrink-0"
                        />
                        <span className="font-medium text-gray-800 truncate">{truncateTitle(chat.video_title, 32)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-40 transition-opacity md:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`
          fixed z-30 top-0 left-0 h-full bg-gray-900 flex flex-col transform transition-transform duration-200
          md:static md:translate-x-0 md:flex md:h-screen
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarWidth}
        `}
        style={{ maxWidth: '100vw' }}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white z-40"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
        {/* Header with collapse/expand button */}
        <div className={`p-4 border-b border-gray-700 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-2">
            <Youtube className="w-6 h-6 text-purple-400" />
            {!collapsed && <h1 className="text-white font-bold text-lg ml-2">Clyp AI</h1>}
          </div>
          {/* Collapse/Expand button (desktop only) */}
          <button
            className="hidden md:flex items-center justify-center w-8 h-8 ml-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        {/* New Chat & Search (icon and label) */}
        <div className={`p-2 ${collapsed ? 'flex flex-col items-center space-y-2' : ''}`}>
          <button
            onClick={onNewChat}
            className={`text-white py-2 ${collapsed ? 'px-2 rounded-full' : 'px-4 rounded-lg'} flex items-center space-x-2 transition-colors w-full justify-center hover:bg-purple-700 bg-purple-600`}
          >
            <PenLine className="w-5 h-5" />
            {!collapsed && <span>New Chat</span>}
          </button>
          <button
            className={`text-white py-2 mt-2 ${collapsed ? 'px-2 rounded-full' : 'px-4 rounded-lg'} flex items-center space-x-2 transition-colors w-full justify-center hover:bg-gray-800 bg-gray-700`}
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
            {!collapsed && <span>Search chats</span>}
          </button>
        </div>
        {/* Chat List */}
        <div className={`flex-1 overflow-y-auto ${collapsed ? 'p-2' : 'p-4'} space-y-2`}> 
          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              {!collapsed && <><p>No chats yet</p><p className="text-sm mt-1">Paste a YouTube link to start</p></>}
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedChatId === chat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <img
                  src={chat.video_thumbnail}
                  alt={chat.video_title}
                  className={`rounded object-cover flex-shrink-0 ${collapsed ? 'w-7 h-5' : 'w-10 h-8'}`}
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-tight mb-1 truncate">
                      {truncateTitle(chat.video_title)}
                    </h3>
                    <p className="text-xs opacity-75 truncate">
                      {formatDate(chat.updated_at)}
                    </p>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
        {/* User Info */}
        <div className={`p-4 border-t border-gray-700 mt-auto flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate max-w-[8rem] md:max-w-[10rem] lg:max-w-[12rem]">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={signOut}
              className="text-gray-400 hover:text-white transition-colors ml-2"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}