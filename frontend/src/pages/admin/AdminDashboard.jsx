import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Demo issues — will later fetch from backend
    setIssues([
      {
        id: 1,
        title: "Pothole near bus stand",
        category: "Road",
        status: "Reported",
        location: { lat: 28.61, lng: 77.23 },
      },
      {
        id: 2,
        title: "Streetlight not working",
        category: "Streetlight",
        status: "In Progress",
        location: { lat: 28.62, lng: 77.22 },
      },
      {
        id: 3,
        title: "Garbage overflow",
        category: "Sanitation",
        status: "Resolved",
        location: { lat: 28.63, lng: 77.21 },
      },
    ]);
  }, []);

  const handleAssign = (id) => {
    alert(`Assigning issue ${id} to department...`);
    // TODO: PUT /admin/issues/:id/assign
  };

  const handleStatusUpdate = (id, newStatus) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    // TODO: PUT /admin/issues/:id/status
  };

  const filteredIssues =
    filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

      {/* Filter */}
      <div className="flex gap-3">
        {["All", "Reported", "In Progress", "Resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg ${
              filter === s
                ? "bg-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="h-80 w-full rounded-lg overflow-hidden shadow">
        <MapContainer
          center={[28.61, 77.23]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.location.lat, issue.location.lng]}
            >
              <Popup>
                <strong>{issue.title}</strong>
                <br />
                {issue.category} - {issue.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="border-t">
                <td className="px-4 py-2">{issue.title}</td>
                <td className="px-4 py-2">{issue.category}</td>
                <td className="px-4 py-2">{issue.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleAssign(issue.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Assign
                  </button>
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
                </td>
              </tr>
            ))}
            {filteredIssues.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
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

export default AdminDashboard;
