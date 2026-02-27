import { useEffect, useState } from "react";
import { fetchAdminIssues, updateIssueStatus, uploadIssueProof } from "../../services/api";

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");

  const loadIssues = async () => setIssues(await fetchAdminIssues());
  useEffect(() => { loadIssues(); }, []);

  const handleStatusUpdate = async (id, newStatus) => { await updateIssueStatus(id, newStatus); await loadIssues(); };
  const handleProofUpload = async (id) => { const proofUrl = prompt("Enter proof image URL"); if (proofUrl) { await uploadIssueProof(id, proofUrl); await loadIssues(); } };

  const filteredIssues = filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold">Manage Issues</h2>
      <div className="flex gap-3">{["All", "Reported", "In Progress", "Resolved"].map((s) => <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg ${filter === s ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>{s}</button>)}</div>
      <div className="overflow-x-auto"><table className="min-w-full bg-white rounded-lg shadow border"><thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left">Title</th><th className="px-4 py-2 text-left">Category</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Actions</th></tr></thead><tbody>
      {filteredIssues.map((issue) => <tr key={issue.id} className="border-t"><td className="px-4 py-2">{issue.title}</td><td className="px-4 py-2">{issue.category}</td><td className="px-4 py-2">{issue.status}</td><td className="px-4 py-2 space-x-2"><button onClick={() => handleStatusUpdate(issue.id, "In Progress")} className="px-3 py-1 bg-blue-500 text-white rounded">In Progress</button><button onClick={() => handleStatusUpdate(issue.id, "Resolved")} className="px-3 py-1 bg-green-600 text-white rounded">Resolved</button><button onClick={() => handleProofUpload(issue.id)} className="px-3 py-1 bg-purple-500 text-white rounded">Upload Proof</button></td></tr>)}
      {filteredIssues.length === 0 && <tr><td colSpan="4" className="text-center py-4 text-gray-500">No issues found</td></tr>}
      </tbody></table></div>
    </div>
  );
};

export default ManageIssues;
