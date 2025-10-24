import React, { useEffect, useState } from "react";

export default function RatingForm({ initialData = null, onSubmit, onUpdate, onDelete, disabled }) {
  const [stars, setStars] = useState(initialData?.stars || 5);
  const [text, setText] = useState(initialData?.reviewText || "");
  const isEdit = !!initialData;

  useEffect(() => {
    setStars(initialData?.stars || 5);
    setText(initialData?.reviewText || "");
  }, [initialData]);

  const submit = (e) => {
    e.preventDefault();
    if (isEdit) {
      if (onUpdate) onUpdate({ stars, reviewText: text });
    } else {
      if (onSubmit) onSubmit({ stars, reviewText: text });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm">Stars</label>
        <select value={stars} onChange={(e) => setStars(Number(e.target.value))} disabled={disabled} className="border px-2 py-1 rounded">
          {[5,4,3,2,1].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a short review" className="w-full border rounded p-2" rows={3} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">{isEdit ? "Update" : "Submit"}</button>
        {isEdit && onDelete && <button type="button" onClick={onDelete} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>}
      </div>
      {disabled && <div className="text-sm text-gray-600">Login required to submit rating</div>}
    </form>
  );
}