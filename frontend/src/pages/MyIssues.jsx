import { useEffect, useState } from "react";
import { fetchMyIssues } from "../services/api";

const MyIssues = () => {
  const [myIssues, setMyIssues] = useState([]);

  useEffect(() => {
    fetchMyIssues().then(setMyIssues).catch(() => setMyIssues([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Reported Issues</h2>
      {myIssues.length === 0 ? <p className="text-gray-600">You haven’t reported any issues yet.</p> : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead><tr className="bg-primary text-white text-left"><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Description</th><th className="p-3">Date</th><th className="p-3">Status</th></tr></thead>
            <tbody>
              {myIssues.map((issue) => (
                <tr key={issue.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold">{issue.title}</td>
                  <td className="p-3">{issue.category}</td>
                  <td className="p-3 text-sm text-gray-600">{issue.description}</td>
                  <td className="p-3 text-sm">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{issue.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyIssues;
