'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

interface TakeQuizCardProps {
  title: string
  description: string
  quizId: number
}

const TakeQuizCard: React.FC<TakeQuizCardProps> = ({ title, description, quizId }) => {
  const router = useRouter()

  const handleStart = () => {
    router.push(`/quiz/${quizId}`)
  }

  return (
    <div className='card w-96 bg-base-100 card-xs shadow-sm p-3'>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="justify-end card-actions">
          <button className="btn btn-success" onClick={handleStart}>Start</button>
        </div>
      </div>
    </div>
  )
}

export default TakeQuizCard
