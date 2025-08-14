import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { getServerSession } from "next-auth"; // New import
import { authOptions } from "@/lib/auth"; // New import

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await createConnection();

  try {
    // 1. Get the session to verify the user
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizId = params.id;

    // 2. Verify that the logged-in user owns the quiz
    const [quizRows]: any = await db.query(
      "SELECT user_id FROM quizzes WHERE id = ?",
      [quizId]
    );

    if (quizRows.length === 0 || quizRows[0].user_id !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to delete this quiz" },
        { status: 403 }
      );
    }

    await db.beginTransaction();

    await db.query("DELETE FROM questions WHERE quiz_id = ?", [quizId]);
    await db.query("DELETE FROM quizzes WHERE id = ?", [quizId]);

    await db.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await db.rollback();
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const db = await createConnection();

  try {
    // 1. Get the session to verify the user
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizId = params.id;

    // 2. Verify that the logged-in user owns the quiz
    const [quizRows]: any = await db.query(
      "SELECT user_id FROM quizzes WHERE id = ?",
      [quizId]
    );

    if (quizRows.length === 0 || quizRows[0].user_id !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to edit this quiz" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, time_limit_minutes } = body;

    if (!title && !description && time_limit_minutes === undefined) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (title) {
      updateFields.push("title = ?");
      values.push(title);
    }
    if (description) {
      updateFields.push("description = ?");
      values.push(description);
    }
    if (time_limit_minutes !== undefined) {
      updateFields.push("time_limit_minutes = ?");
      values.push(time_limit_minutes);
    }

    values.push(quizId);

    await db.query(
      `UPDATE quizzes SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}