import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  created_at: string
}

export async function* generateResponse(
  messages: ChatMessage[],
  userPrompt: string
): AsyncGenerator<string, void, unknown> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // Build context from previous messages
  const context = messages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n\n')

  // Explicitly request markdown output
  const fullPrompt = `${context}\n\nuser: ${userPrompt}\n\nassistant: (Respond in markdown format. Use markdown for all lists, headings, and code blocks if any.)`

  try {
    const result = await model.generateContentStream(fullPrompt)
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      yield chunkText
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    yield 'Sorry, I encountered an error processing your request. Please try again.'
  }
}

export function generateInitialPrompts(): string[] {
  return [
    "Generate bullet-point notes from this video",
    "Create a summary of the key points",
    "Generate quiz questions (MCQs) based on the content",
    "Create interview/viva questions about this topic with answers",
    "Generate flashcards for key concepts"
  ]
}