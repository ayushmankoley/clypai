import { FileText, BookOpen, HelpCircle, GraduationCap, Zap } from 'lucide-react'

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void
  disabled?: boolean
}

const quickPrompts = [
  {
    icon: FileText,
    label: "Generate Notes",
    prompt: "Generate bullet-point notes from this video",
    color: "bg-blue-500"
  },
  {
    icon: BookOpen,
    label: "Summarize",
    prompt: "Create a summary of the key points",
    color: "bg-green-500"
  },
  {
    icon: HelpCircle,
    label: "Quiz Questions",
    prompt: "Generate quiz questions (MCQs) based on the content",
    color: "bg-purple-500"
  },
  {
    icon: GraduationCap,
    label: "Interview Questions",
    prompt: "Create interview/viva questions about this topic with answers",
    color: "bg-orange-500"
  },
  {
    icon: Zap,
    label: "Flashcards",
    prompt: "Generate flashcards for key concepts",
    color: "bg-pink-500"
  }
]

export function QuickPrompts({ onPromptSelect, disabled = false }: QuickPromptsProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptSelect(prompt.prompt)}
            disabled={disabled}
            className={`p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left`}
          >
            <div className={`${prompt.color} w-6 h-6 rounded mb-2 flex items-center justify-center`}>
              <prompt.icon className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-800">{prompt.label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}