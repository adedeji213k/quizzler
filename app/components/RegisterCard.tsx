'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const RegisterCard = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await res.json()

    if (res.ok) {
      router.push('/login') // Redirect to dashboard or login
    } else {
      setError(data.error || 'Registration failed')
    }
  }

  return (
    <div className='card card-body w-96 bg-base-100 shadow-sm items-center mt-5 mx-auto justify-center'>
      <h1 className='card-title mb-2'>Register</h1>

      <form onSubmit={handleSubmit} className='w-full'>
        <fieldset className='fieldset bg-base-200 border-base-300 rounded-box p-4'>
          <label className="label">Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="label mt-3">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="label mt-3">Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" className='btn btn-success mt-4 w-full' value="Register" />
        </fieldset>

        {error && <p className='text-red-500 mt-2 text-center'>{error}</p>}
      </form>

      <div className='flex flex-row gap-1 mt-3'>
        <p>Already have an account?</p>
        <Link className="text-info" href="/login">Login here</Link>
      </div>
    </div>
  )
}

export default RegisterCard
