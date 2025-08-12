import Link from 'next/link'
import React from 'react'

const CreateQuizCard = () => {
  return (
    <div>
      <div className='btn btn-accent rounded m-5'>
        <Link href="/create-quiz">Create Quiz</Link>
      </div>
    </div>
  )
}

export default CreateQuizCard
