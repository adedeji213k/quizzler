// app/api/upload-questions/route.ts
import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import csv from 'csv-parser';
import streamifier from 'streamifier';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const quiz_id = formData.get('quiz_id');

    if (!file || !quiz_id) {
      return NextResponse.json({ error: 'Missing file or quiz ID' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const results: any[] = [];

    await new Promise<void>((resolve, reject) => {
      streamifier
        .createReadStream(buffer)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    const db = await createConnection();

    for (const row of results) {
      const {
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        answer,
      } = row;

      if (!question_text || !option_a || !option_b || !option_c || !option_d || !answer) {
        console.warn('Skipping invalid row:', row);
        continue;
      }

      await db.execute(
        `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, answer) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [quiz_id, question_text, option_a, option_b, option_c, option_d, answer]
      );
    }

    return NextResponse.json({ message: 'Questions uploaded successfully' });
  } catch (error: any) {
    console.error('Error uploading questions:', error);
    return NextResponse.json(
      { error: 'Failed to upload questions', details: error.message },
      { status: 500 }
    );
  }
}
