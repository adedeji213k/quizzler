import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("📩 Incoming quiz submission:", body);

    const { user_id, quiz_id, answers } = body;

    if (!user_id || !quiz_id || !Array.isArray(answers)) {
      console.error("❌ Missing or invalid data:", { user_id, quiz_id, answers });
      return NextResponse.json(
        { error: "user_id, quiz_id, and answers array are required" },
        { status: 400 }
      );
    }
    console.log("Answers received:", JSON.stringify(answers, null, 2));

    const connection = await createConnection();

    // 1. Get total questions count for this quiz
    const [questionsResult]: any = await connection.execute(
      `SELECT COUNT(*) as total_questions FROM questions WHERE quiz_id = ?`,
      [quiz_id]
    );
    const totalQuestions = questionsResult[0]?.total_questions || 0;

    // 2. Fetch correct answers for all questions in the quiz
    const [correctAnswersRows]: any = await connection.execute(
      `SELECT id AS question_id, answer AS correct_option FROM questions WHERE quiz_id = ?`,
      [quiz_id]
    );

    // Create a map for quick lookup of correct answers
    const correctAnswersMap = new Map<number, string>();
    for (const row of correctAnswersRows) {
      correctAnswersMap.set(row.question_id, row.correct_option);
    }

    // 3. Calculate score and enrich answers with is_correct
    let score = 0;
    const answersWithCorrectness = answers.map((ans: any) => {
      const correctOption = correctAnswersMap.get(ans.question_id);
      const is_correct = correctOption === ans.selected_option;
      if (is_correct) score++;
      return {
        ...ans,
        is_correct,
      };
    });

    // 4. Insert into quiz_results with score and total_questions
    const [result]: any = await connection.execute(
      `INSERT INTO quiz_results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)`,
      [user_id, quiz_id, score, totalQuestions]
    );
    const quizResultId = result.insertId;

    // 5. Insert each answer into quiz_result_answers with computed is_correct
    for (const ans of answersWithCorrectness) {
      await connection.execute(
        `INSERT INTO quiz_result_answers (quiz_result_id, question_id, selected_option, is_correct)
         VALUES (?, ?, ?, ?)`,
        [quizResultId, ans.question_id, ans.selected_option, ans.is_correct]
      );
    }

    return NextResponse.json({ message: "Quiz submitted successfully", score, totalQuestions });
  } catch (error) {
    console.error("💥 Error submitting quiz:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
