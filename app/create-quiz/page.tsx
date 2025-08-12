'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { useSession } from 'next-auth/react';

const CreateQuizPage = () => {
  const { data: session, status } = useSession();
  const [quizId, setQuizId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleCreateQuiz = async () => {
    if (status !== 'authenticated') {
      alert('You must be logged in to create a quiz');
      return;
    }

    const res = await fetch('/api/createquiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        time_limit_minutes: parseInt(duration),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setQuizId(data.quiz_id);
      alert('Quiz created. Now upload your questions.');
    } else {
      alert('Failed to create quiz: ' + data.error);
    }
  };

  const handleUploadQuestions = async () => {
    if (!file || !quizId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quiz_id', String(quizId));

    const res = await fetch('/api/uploadquestions', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert('Questions uploaded successfully.');
    } else {
      alert('Error uploading questions: ' + data.error);
    }
  };

  return (
    <div className='items-center justify-center'>
      <Header />
      <div className='card items-center mx-auto w-96 bg-base-100 shadow-sm p-5'>
        <label className="label">Title</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="label mt-3">Description</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="label mt-3">Duration (minutes)</label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button className='btn btn-success mt-4 w-full' onClick={handleCreateQuiz}>
          Create Quiz
        </button>

        {quizId && (
          <>
            <div className="divider mt-6 mb-2">Upload Questions</div>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button className="btn btn-primary w-full mt-3" onClick={handleUploadQuestions}>
              Upload CSV
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateQuizPage;
