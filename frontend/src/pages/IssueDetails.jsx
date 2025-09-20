import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState(0);

  // Simulate fetching issue details
  useEffect(() => {
    const demoIssue = {
      id,
      title: "Pothole near bus stand",
      description: "Huge pothole causing accidents and traffic jam.",
      category: "Road",
      status: "In Progress",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Potholes_on_Acro_polis_Road_in_India.jpg/320px-Potholes_on_Acro_polis_Road_in_India.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Road_pothole.jpg/320px-Road_pothole.jpg",
      ],
      upvotes: 12,
    };
    setIssue(demoIssue);
    setUpvotes(demoIssue.upvotes);

    const demoComments = [
      { id: 1, user: "Ravi", text: "This needs urgent fixing!", role: "Citizen" },
      { id: 2, user: "Municipal Officer", text: "Work order has been issued.", role: "Authority" },
    ];
    setComments(demoComments);
  }, [id]);

  const handleUpvote = () => {
    setUpvotes((prev) => prev + 1);
    // TODO: Send PUT /issues/:id/upvote
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newEntry = {
      id: Date.now(),
      user: "You",
      text: newComment,
      role: "Citizen",
    };
    setComments([...comments, newEntry]);
    setNewComment("");
    // TODO: POST /issues/:id/comment
  };

  if (!issue) return <p className="p-6">Loading issue...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Title + Category */}
      <div>
        <h2 className="text-3xl font-bold">{issue.title}</h2>
        <p className="text-gray-600">{issue.category}</p>
      </div>

      {/* Image Gallery */}
      <div className="grid md:grid-cols-2 gap-4">
        {issue.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`issue-${idx}`}
            className="rounded-lg shadow"
          />
        ))}
      </div>

      {/* Description + Status */}
      <div className="space-y-3">
        <p>{issue.description}</p>
        <span
          className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
            issue.status === "Resolved"
              ? "bg-green-100 text-green-800"
              : issue.status === "In Progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {issue.status}
        </span>
      </div>

      {/* Upvotes */}
      <div>
        <button
          onClick={handleUpvote}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
        >
          👍 Upvote ({upvotes})
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Comments</h3>
        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-3 border rounded-lg bg-gray-50 shadow-sm"
            >
              <p className="font-semibold">
                {c.user}{" "}
                <span className="text-xs text-gray-500">({c.role})</span>
              </p>
              <p className="text-sm">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border px-3 py-2 rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssueDetails;
