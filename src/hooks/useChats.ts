import { useEffect, useState } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from './useAuth'

type Chat = Database['public']['Tables']['chats']['Row']

export function useChats() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setChats([])
      setLoading(false)
      return
    }

    fetchChats()

    // Polling every 3 seconds
    const interval = setInterval(() => {
      fetchChats()
    }, 3000)
    return () => clearInterval(interval)
  }, [user])

  const fetchChats = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setChats(data || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const createChat = async (
    videoId: string,
    videoTitle: string,
    videoThumbnail: string,
    videoUrl: string,
    transcript: string
  ) => {
    if (!user) return null

    try {
      const initialMessage = {
        role: 'system' as const,
        content: `Video Transcript:\n\n${transcript}`,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          video_id: videoId,
          video_title: videoTitle,
          video_thumbnail: videoThumbnail,
          video_url: videoUrl,
          messages: [initialMessage]
        })
        .select()
        .single()

      if (error) throw error
      setChats(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error creating chat:', error)
      return null
    }
  }

  const updateChatMessages = async (chatId: string, messages: Chat['messages']) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ 
          messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId)

      if (error) throw error

      // Update local state
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages, updated_at: new Date().toISOString() }
          : chat
      ))
    } catch (error) {
      console.error('Error updating chat messages:', error)
    }
  }

  return {
    chats,
    loading,
    createChat,
    updateChatMessages,
    refetch: fetchChats
  }
}