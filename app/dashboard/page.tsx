'use client'

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import TakeQuizCard from '../components/TakeQuizCard'
import EditQuizCard from '../components/EditQuizCard'
import CreateQuizCard from '../components/CreateQuizCard'
import ShowResultCard from '../components/ShowResultCard'  // <-- import here
import { useSession, signIn } from 'next-auth/react'
import { signOut } from "next-auth/react";

interface Quiz {
  id: number
  title: string
  description: string
}

const DashboardPage = () => {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('Take a Quiz')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  const menuItems = ['Take a Quiz', 'My Quizzes', 'Results']

  // Helper to fetch quizzes
  const getQuizzes = async (filter: 'all' | 'mine') => {
    try {
      const res = await fetch(`/api/getquizzes?filter=${filter}`)
      if (!res.ok) throw new Error('Failed to fetch quizzes')
      const data = await res.json()
      setQuizzes(data.quizzes)
    } catch (err) {
      console.error(`Error fetching ${filter} quizzes:`, err)
    }
  }

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }
  }, [status])

  // Fetch quizzes depending on the active tab
  useEffect(() => {
    if (!session?.user?.id) return
    if (activeTab === 'Take a Quiz') {
      getQuizzes('all')
    }
    if (activeTab === 'My Quizzes') {
      getQuizzes('mine')
    }
  }, [activeTab, session?.user?.id])

  if (status === 'loading') {
    return <p className='p-6'>Loading...</p>
  }

  return (
    <div className='p-6'>
      <Header />
      <p className='text-3xl mb-4'>Dashboard</p>

      <div className="flex gap-8">
        {/* Sidebar Menu */}
        <ul className="menu bg-base-200 w-56 rounded-box">
          {menuItems.map((item) => (
            <li key={item}>
              <a
                className={activeTab === item ? 'menu-active font-bold' : ''}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Active Tab Content */}
        <div className="flex-1 bg-base-100 p-4 rounded-box shadow">
          <h2 className="text-2xl font-semibold">{activeTab}</h2>
          <p className="mt-2 text-gray-600">
            You are viewing the "{activeTab}" section.
          </p>

          {activeTab === 'Take a Quiz' && (
            <div className="flex flex-wrap gap-4 mt-4">
              {quizzes.length === 0 ? (
                <p className="text-gray-500">No quizzes available.</p>
              ) : (
                quizzes.map((quiz) => (
                  <TakeQuizCard
                    key={quiz.id}
                    title={quiz.title}
                    description={quiz.description}
                    quizId={quiz.id}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'My Quizzes' && (
            <div className="flex flex-col gap-4 mt-4">
              <CreateQuizCard />
              {quizzes.length === 0 ? (
                <p className="text-gray-500">
                  You haven’t created any quizzes yet.
                </p>
              ) : (
                quizzes.map((quiz) => (
                  <EditQuizCard
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    description={quiz.description}
                    onEdit={() => {
                      window.location.href = `/quizzes/edit/${quiz.id}`
                    }}
                    onDelete={() => getQuizzes('mine')} // refresh after deletion
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'Results' && (
            <div className="mt-4">
              <ShowResultCard /> {/* <-- Insert results component here */}
            </div>
          )}
        </div>
      </div>
      <div className='btn btn-error rounded-2xl' onClick={() => signOut({ callbackUrl: "/" })}>Log out</div>
    </div>
  )
}

export default DashboardPage
