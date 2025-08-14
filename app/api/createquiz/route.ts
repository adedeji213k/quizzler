import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // adjust path as needed

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, time_limit_minutes } = await req.json();

    if (!title || !description || !time_limit_minutes) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = await createConnection();
    const [result]: any = await db.query(
      'INSERT INTO quizzes (title, description, time_limit_minutes, user_id) VALUES (?, ?, ?, ?)',
      [title, description, time_limit_minutes, session.user.id]
    );

    return NextResponse.json({ quiz_id: result.insertId });
  } catch (error) {
    console.error('Quiz creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
