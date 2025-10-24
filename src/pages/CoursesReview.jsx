import React, { useEffect, useState } from "react";
import Service from "../appwrite/config";
import authService from "../appwrite/auth";
import RatingForm from "../forms/RatingForm";
import RatingsList from "../forms/RatingList";

export default function CourseRatingsTest() {
  const [courseId, setCourseId] = useState("");
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      if (user) setUserId(user.$id);
    })();
  }, []);

  const loadRatings = async () => {
    if (!courseId) return setError("Enter courseId first");
    setLoading(true);
    setError(null);
    try {
      const res = await Service.getCourseRatings(courseId, [/* optional queries */]);
      setRatings(res.documents || []);
      const ur = await Service.getUserCourseRating(courseId, userId);
      setUserRating(ur);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async ({ stars, reviewText }) => {
    setError(null);
    try {
      await Service.submitCourseRating({ courseId, userId, stars, reviewText });
      await loadRatings();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to submit rating");
    }
  };

  const handleUpdate = async (ratingId, data) => {
    try {
      await Service.updateCourseRating(ratingId, data);
      await loadRatings();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to update rating");
    }
  };

  const handleDelete = async (ratingId) => {
    try {
      await Service.deleteCourseRating(ratingId);
      await loadRatings();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to delete rating");
    }
  };

  const average = ratings.length
    ? (ratings.reduce((s, r) => s + (r.stars || 0), 0) / ratings.length).toFixed(2)
    : "—";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Course Ratings Tester</h2>

      <div className="mb-4 flex gap-2">
        <input
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Enter courseId to test"
          className="border px-3 py-2 rounded w-full"
        />
        <button onClick={loadRatings} className="bg-blue-600 text-white px-4 py-2 rounded">
          Load
        </button>
      </div>

      <div className="mb-4">
        <strong>Average:</strong> {average} · <strong>Total:</strong> {ratings.length}
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 gap-6">
        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">Your rating</h3>
          <RatingForm
            initialData={userRating}
            onSubmit={handleSubmit}
            onUpdate={(data) => handleUpdate(userRating.$id, data)}
            onDelete={() => handleDelete(userRating.$id)}
            disabled={!userId}
          />
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">All ratings</h3>
          {loading ? <div>Loading…</div> : <RatingsList ratings={ratings} currentUserId={userId} onDelete={handleDelete} onUpdate={handleUpdate} />}
        </div>
      </div>
    </div>
  );
}