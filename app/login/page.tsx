'use client'

import React from 'react'
import LoginCard from '../components/LoginCard'
import Link from 'next/link'
import Header from '../components/Header'

const LoginPage = () => {
  return (
    <div className='items-center justify-center'>
      <Header />
      <LoginCard />
    </div>
  )
}

export default LoginPage
