import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
  }

  try {
    const db = await createConnection()

    // Fetch user from the 'users' table (use your actual table name)
    const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [email])

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No credentials found' }, { status: 401 })
    }

    const user = rows[0]

    // Compare the hashed password with the entered password
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
