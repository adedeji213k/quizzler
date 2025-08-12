'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Result {
  id: number
  quiz_id: number
  score: number
  total_questions: number
  submitted_at: string
  quiz_title: string
}

export default function ShowResultCard() {
  const { data: session, status } = useSession()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'authenticated') return

    async function fetchResults() {
      setLoading(true)
      try {
        const res = await fetch('/api/user-results')
        if (!res.ok) throw new Error('Failed to fetch results')
        const data = await res.json()
        setResults(data.results)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [status])

  if (status === 'loading') {
    return <p>Loading user results...</p>
  }

  if (status === 'unauthenticated') {
    return <p>Please log in to view your results.</p>
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>
  }

  if (results.length === 0) {
    return <p>No quiz results found.</p>
  }

  return (
    <div className="space-y-4">
      {results.map(result => (
        <div key={result.id} className="p-4 border rounded shadow">
          <h3 className="text-lg font-semibold">{result.quiz_title}</h3>
          <p>
            Score: {result.score} / {result.total_questions}
          </p>
          <p className="text-sm text-gray-500">
            Taken on: {new Date(result.submitted_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
