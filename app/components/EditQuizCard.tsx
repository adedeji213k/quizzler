import React, { useState } from "react";

// The prop names are now updated to match what's used in dashboard/page.tsx
interface EditQuizCardProps {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  onEdit?: () => void;    // Corrected prop name
  onDelete?: () => void;  // Corrected prop name
}

const EditQuizCard: React.FC<EditQuizCardProps> = ({
  id,
  title,
  description = "No description provided.",
  duration = 0,
  onEdit, // Destructured with the new prop name
  onDelete, // Destructured with the new prop name
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editDuration, setEditDuration] = useState(duration);

  // NOTE: You are using `confirm` and `alert` which can cause issues
  // in the Vercel environment. It's recommended to use a custom modal or UI
  // for these interactions.

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quiz? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete quiz");

      alert("Quiz deleted successfully");
      if (onDelete) onDelete(); // Call the corrected prop name
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
      // The `onUpdated` prop no longer exists, so we don't call it here.
      // The logic in your dashboard file handles navigation, which is
      // a different responsibility.
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
          {/* This button will trigger the `onEdit` prop passed from the parent */}
          <button className="btn btn-success btn-sm" onClick={onEdit}>
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
