import React from 'react'
import Link from 'next/link';

const Header = () => {
  return (
    <div>
      <header className="navbar bg-base-100">
        <div className="navbar-center">
          <h1 className="text-5xl text-success m-6"><Link href="/">QUIZZLER</Link></h1>
        </div>
      </header>
    </div>
  )
}

export default Header
