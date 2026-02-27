import { useEffect, useMemo, useState } from "react";
import { assignIssue, fetchAdminIssues, updateIssueStatus } from "../../services/api";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");

  const loadIssues = async () => setIssues(await fetchAdminIssues());
  useEffect(() => { loadIssues(); }, []);

  const filteredIssues = useMemo(() => (filter === "All" ? issues : issues.filter((i) => i.status === filter)), [issues, filter]);

  const handleAssign = async (id) => { await assignIssue(id, "Municipal Team"); await loadIssues(); };
  const handleStatusUpdate = async (id, status) => { await updateIssueStatus(id, status); await loadIssues(); };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      <div className="flex gap-3">{["All", "Reported", "In Progress", "Resolved"].map((s) => <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg ${filter === s ? "bg-blue-600 text-white" : "bg-gray-200"}`}>{s}</button>)}</div>
      <div className="overflow-x-auto"><table className="min-w-full bg-white rounded-lg shadow border"><thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left">Title</th><th className="px-4 py-2 text-left">Category</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Actions</th></tr></thead><tbody>
      {filteredIssues.map((issue) => <tr key={issue.id} className="border-t"><td className="px-4 py-2">{issue.title}</td><td className="px-4 py-2">{issue.category}</td><td className="px-4 py-2">{issue.status}</td><td className="px-4 py-2 space-x-2"><button onClick={() => handleAssign(issue.id)} className="px-3 py-1 bg-yellow-500 text-white rounded">Assign</button><button onClick={() => handleStatusUpdate(issue.id, "In Progress")} className="px-3 py-1 bg-blue-500 text-white rounded">In Progress</button><button onClick={() => handleStatusUpdate(issue.id, "Resolved")} className="px-3 py-1 bg-green-600 text-white rounded">Resolved</button></td></tr>)}
      </tbody></table></div>
    </div>
  );
};

export default AdminDashboard;
