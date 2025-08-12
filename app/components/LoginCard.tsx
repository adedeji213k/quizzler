'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginCard = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className='card card-body w-96 bg-base-100 shadow-sm items-center mt-5 mx-auto justify-center'>
      <h1 className='card-title mb-2'>Login</h1>

      <form onSubmit={handleSubmit} className='w-full'>
        <fieldset className='fieldset bg-base-200 border-base-300 rounded-box p-4'>
          <label className="label">Email</label>
          <input
            type="text"
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

          <input type="submit" className='btn btn-success mt-4 w-full' value="Login" />
        </fieldset>

        {error && <p className='text-red-500 mt-2 text-center'>{error}</p>}
      </form>
      <div className='flex flex-row'>
        <p>Don't have an account, </p>
        <Link className="text-info" href="/register"> Click here</Link>
      </div>
    </div>
  )
}

export default LoginCard
