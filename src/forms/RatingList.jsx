import React from "react";

export default function RatingsList({ ratings = [], currentUserId, onDelete, onUpdate }) {
  if (!ratings.length) return <div className="text-sm text-gray-600">No ratings yet</div>;

  return (
    <div className="space-y-3">
      {ratings.map((r) => (
        <div key={r.$id} className="p-3 border rounded">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">User: {r.userId ?? r.$id}</div>
              <div className="text-sm text-yellow-600">Stars: {r.stars}</div>
            </div>
            <div className="text-sm text-gray-500">{new Date(r.$createdAt).toLocaleString()}</div>
          </div>
          {r.reviewText && <div className="mt-2 text-sm">{r.reviewText}</div>}
          {currentUserId === r.userId && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => onDelete && onDelete(r.$id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              <button onClick={() => onUpdate && onUpdate(r.$id, { stars: Math.min(5, (r.stars||1)+1) })} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Quick +1</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}