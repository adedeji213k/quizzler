import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing name, email, or password' }, { status: 400 })
  }

  try {
    const db = await createConnection()

    // Check if user already exists
    const [existingUsers]: any = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const [result]: any = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    return NextResponse.json({
      message: 'User registered successfully',
      userId: result.insertId
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
