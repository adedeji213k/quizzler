import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';// so we can reuse your NextAuth config

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // "all" or "mine"

    // Get logged-in user from NextAuth session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const db = await createConnection();

    let query = 'SELECT id, title, description FROM quizzes';
    let params: any[] = [];

    if (type === 'mine') {
      if (!userId) {
        return NextResponse.json(
          { error: 'You must be logged in to view your quizzes' },
          { status: 401 }
        );
      }
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [rows] = await db.query(query, params);
    return NextResponse.json({ quizzes: rows });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}
