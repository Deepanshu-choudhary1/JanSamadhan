import { useEffect, useState } from "react";

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Demo data — replace with GET /admin/issues
    setIssues([
      {
        id: 1,
        title: "Pothole near bus stand",
        category: "Road",
        status: "Reported",
        reporter: "Ravi Kumar",
      },
      {
        id: 2,
        title: "Streetlight not working",
        category: "Streetlight",
        status: "In Progress",
        reporter: "Priya Singh",
      },
      {
        id: 3,
        title: "Garbage overflow",
        category: "Sanitation",
        status: "Resolved",
        reporter: "Ankit Sharma",
      },
    ]);
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    // TODO: PUT /admin/issues/:id/status
  };

  const handleProofUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploading proof for issue ${id}: ${file.name}`);
      // TODO: POST /admin/issues/:id/proof
    }
  };

  const filteredIssues =
    filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold">Manage Issues</h2>

      {/* Filter */}
      <div className="flex gap-3">
        {["All", "Reported", "In Progress", "Resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Reporter</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="border-t">
                <td className="px-4 py-2">{issue.title}</td>
                <td className="px-4 py-2">{issue.category}</td>
                <td className="px-4 py-2">{issue.reporter}</td>
                <td className="px-4 py-2">{issue.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(issue.id, "In Progress")}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(issue.id, "Resolved")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Resolved
                  </button>
                  <label className="px-3 py-1 bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600">
                    Upload Proof
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleProofUpload(issue.id, e)}
                    />
                  </label>
                </td>
              </tr>
            ))}
            {filteredIssues.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No issues found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageIssues;
