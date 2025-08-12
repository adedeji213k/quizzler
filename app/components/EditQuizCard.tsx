import React, { useState } from "react";

interface EditQuizCardProps {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  onUpdated?: () => void; // Callback after update
  onDeleted?: () => void; // Callback after delete
}

const EditQuizCard: React.FC<EditQuizCardProps> = ({
  id,
  title,
  description = "No description provided.",
  duration = 0,
  onUpdated,
  onDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editDuration, setEditDuration] = useState(duration);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quiz? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete quiz");

      alert("Quiz deleted successfully");
      if (onDeleted) onDeleted();
    } catch (error) {
      console.error(error);
      alert("Error deleting quiz");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          duration: editDuration,
        }),
      });

      if (!res.ok) throw new Error("Failed to update quiz");

      alert("Quiz updated successfully");
      setIsEditing(false);
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error(error);
      alert("Error updating quiz");
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-sm p-3">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <p className="text-sm text-gray-500">Duration: {duration} mins</p>
        <div className="card-actions justify-end">
          <button className="btn btn-success btn-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="btn btn-error btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Edit Quiz</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input input-bordered w-full mb-3"
              placeholder="Quiz Title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Description"
            />
            <input
              type="number"
              value={editDuration}
              onChange={(e) => setEditDuration(Number(e.target.value))}
              className="input input-bordered w-full mb-3"
              placeholder="Duration in minutes"
            />
            <div className="flex justify-end gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditQuizCard;
