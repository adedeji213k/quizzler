import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db"; // Your existing connection function

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json(
        { error: "quizId is required" },
        { status: 400 }
      );
    }

    const connection = await createConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM questions WHERE quiz_id = ? ORDER BY id ASC`,
      [quizId]
    );


    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
