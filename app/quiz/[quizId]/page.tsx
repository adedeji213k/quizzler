'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  answer: string
}

export default function QuizPage() {
  const { quizId } = useParams()
  const router = useRouter()           // <--- add router
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)

  useEffect(() => {
    if (quizId) {
      fetch(`/api/questions?quizId=${quizId}`)
        .then(res => res.json())
        .then(data => setQuestions(data))
    }
  }, [quizId])

  const saveAnswerAndMoveNext = () => {
    if (!selectedChoice) {
      alert('Please select an answer before continuing.')
      return
    }

    const currentQ = questions[currentIndex]
    const newAnswers = {
      ...answers,
      [currentQ.id]: selectedChoice,
    }
    setAnswers(newAnswers)
    setSelectedChoice(null)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      if (!session?.user?.id) {
        alert('You must be logged in to submit the quiz.')
        return
      }

      const answersArray = Object.entries(newAnswers).map(([question_id, selected_option]) => ({
        question_id: Number(question_id),
        selected_option,
      }))

      fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.user.id,
          quiz_id: Number(quizId),
          answers: answersArray,
        }),
      })
        .then(res => res.json())
        .then(data => {
          alert('Quiz submitted successfully!')
          console.log('Submission response:', data)
          router.push('/dashboard')    // <--- redirect here after successful submission
        })
        .catch(err => {
          alert('Failed to submit quiz.')
          console.error('Error submitting quiz:', err)
        })
    }
  }

  if (questions.length === 0) {
    return <div className="p-6">Loading questions...</div>
  }

  const currentQ = questions[currentIndex]
  const options = [
    { key: 'A', text: currentQ.option_a },
    { key: 'B', text: currentQ.option_b },
    { key: 'C', text: currentQ.option_c },
    { key: 'D', text: currentQ.option_d },
  ]

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-xl font-bold">{currentQ.question_text}</h1>
      <div className="mt-4 space-y-2">
        {options.map(option => (
          <button
            key={option.key}
            className={`btn w-full ${
              selectedChoice === option.key ? 'btn-primary' : 'btn-outline'
            }`}
            onClick={() => setSelectedChoice(option.key)}
          >
            {option.text}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <button className="btn btn-success" onClick={saveAnswerAndMoveNext}>
          {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  )
}
