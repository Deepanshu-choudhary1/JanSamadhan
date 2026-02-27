import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addIssueComment, fetchIssueDetails, upvoteIssue } from "../services/api";

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [newComment, setNewComment] = useState("");

  const loadIssue = useCallback(async () => {
    const data = await fetchIssueDetails(id);
    setIssue(data);
  }, [id]);

  useEffect(() => {
    loadIssue();
  }, [loadIssue]);

  const handleUpvote = async () => {
    await upvoteIssue(id);
    await loadIssue();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await addIssueComment(id, newComment);
    setNewComment("");
    await loadIssue();
  };

  if (!issue) return <p className="p-6">Loading issue...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div><h2 className="text-3xl font-bold">{issue.title}</h2><p className="text-gray-600">{issue.category}</p></div>
      {issue.imageUrl && <img src={issue.imageUrl} alt={issue.title} className="rounded-lg shadow max-h-96" />}
      <div className="space-y-3"><p>{issue.description}</p><span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">{issue.status}</span></div>
      <div><button onClick={handleUpvote} className="px-4 py-2 bg-primary text-white rounded-lg">👍 Upvote ({issue.upvotes || 0})</button></div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Comments</h3>
        <div className="space-y-3">{(issue.comments || []).map((c) => <div key={c.id} className="p-3 border rounded-lg bg-gray-50"><p className="font-semibold">{c.user} <span className="text-xs text-gray-500">({c.role})</span></p><p className="text-sm">{c.text}</p></div>)}</div>
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-4"><input type="text" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-grow border px-3 py-2 rounded-lg" /><button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Post</button></form>
      </div>
    </div>
  );
};

export default IssueDetails;
