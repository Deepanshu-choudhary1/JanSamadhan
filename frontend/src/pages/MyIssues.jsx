import { useEffect, useState } from "react";

const MyIssues = () => {
  const [myIssues, setMyIssues] = useState([]);

  // Simulate fetching user's issues (replace with API call later)
  useEffect(() => {
    const demoUserIssues = [
      {
        id: 101,
        title: "Streetlight not working",
        category: "Lighting",
        description: "The pole near my house is dark at night.",
        date: "2025-09-10",
        status: "In Progress",
      },
      {
        id: 102,
        title: "Overflowing Garbage Bin",
        category: "Sanitation",
        description: "Garbage not collected for 4 days.",
        date: "2025-09-12",
        status: "Reported",
      },
      {
        id: 103,
        title: "Pothole on main road",
        category: "Road",
        description: "Causing traffic jams near bus stand.",
        date: "2025-09-14",
        status: "Resolved",
      },
    ];
    setMyIssues(demoUserIssues);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Reported Issues</h2>

      {myIssues.length === 0 ? (
        <p className="text-gray-600">You haven’t reported any issues yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {myIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold">{issue.title}</td>
                  <td className="p-3">{issue.category}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {issue.description}
                  </td>
                  <td className="p-3 text-sm">{issue.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        issue.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : issue.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </td>
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
