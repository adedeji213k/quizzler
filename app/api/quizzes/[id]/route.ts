import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const db = await createConnection();

  try {
    await db.beginTransaction();

    await db.query("DELETE FROM questions WHERE quiz_id = ?", [params.id]);
    await db.query("DELETE FROM quizzes WHERE id = ?", [params.id]);

    await db.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await db.rollback();
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const db = await createConnection();

  try {
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

    values.push(params.id);

    await db.query(
      `UPDATE quizzes SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}
