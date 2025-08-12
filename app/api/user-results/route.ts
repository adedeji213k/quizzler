import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { getServerSession } from "next-auth/next"; // or your auth helper
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // adjust path

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const connection = await createConnection();

    // Join quiz_results with quizzes to get quiz title
    const [results]: any = await connection.execute(
      `SELECT qr.id, qr.quiz_id, qr.score, qr.total_questions, qr.submitted_at, q.title AS quiz_title
       FROM quiz_results qr
       JOIN quizzes q ON qr.quiz_id = q.id
       WHERE qr.user_id = ?
       ORDER BY qr.submitted_at DESC`,
      [userId]
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching user results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
