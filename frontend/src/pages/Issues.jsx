import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import PIC from "../assets/PIC.webp";
import pic2 from "../assets/pic2.webp";
import streetlight from "../assets/streetlight.webp";
import "leaflet/dist/leaflet.css"; // ✅ required for map styling

// Custom marker colors by status
const getMarkerIcon = (status) => {
  const color =
    status === "Resolved"
      ? "green"
      : status === "In Progress"
      ? "orange"
      : "red";

  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2px solid white"></div>`,
  });
};

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({ status: "All", category: "All" });

  // Simulated issues (later → fetch from backend)
  useEffect(() => {
    const demoIssues = [
      {
        id: 1,
        title: "Pothole near Main Street",
        category: "Road",
        description: "Large pothole blocking traffic.",
        location: { lat: 28.6139, lng: 77.209 },
        status: "Reported",
        image:
          PIC,
      },
      {
        id: 2,
        title: "Garbage overflow",
        category: "Sanitation",
        description: "Dustbin not cleared for 3 days.",
        location: { lat: 19.076, lng: 72.8777 },
        status: "In Progress",
        image:
          pic2,
      },
      {
        id: 3,
        title: "Broken streetlight",
        category: "Lighting",
        description: "Dark and unsafe at night.",
        location: { lat: 13.0827, lng: 80.2707 },
        status: "Resolved",
        image:
          streetlight,
      },
    ];
    setIssues(demoIssues);
  }, []);

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    return (
      (filters.status === "All" || issue.status === filters.status) &&
      (filters.category === "All" || issue.category === filters.category)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-3">Filter by Status</h3>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option>All</option>
            <option>Reported</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-3">Filter by Category</h3>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option>All</option>
            <option>Road</option>
            <option>Sanitation</option>
            <option>Lighting</option>
          </select>
        </div>
      </div>

      {/* Map + List */}
      <div className="lg:col-span-3 space-y-6">
        {/* Map */}
        <div className="h-96 rounded-lg overflow-hidden border">
          <MapContainer
            center={[20.5937, 78.9629]} // India default center
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredIssues.map((issue) => (
              <Marker
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={getMarkerIcon(issue.status)}
              >
                <Popup>
                  <div>
                    <h4 className="font-bold">{issue.title}</h4>
                    <p className="text-sm">{issue.category}</p>
                    <p className="text-xs text-gray-600">{issue.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

     {/* List View */}
<div className="grid md:grid-cols-2 gap-6">
  {filteredIssues.length === 0 ? (
    <div className="col-span-2 text-center text-gray-500 py-8">
      No issues found for selected filters.
    </div>
  ) : (
    filteredIssues.map((issue) => (
      <div
        key={issue.id}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
      >
        <img
          src={issue.image}
          alt={issue.title}
          className="h-64 w-full object-cover"  // ⬅️ bigger preview
        />
        <div className="p-6 space-y-2">
          <h4 className="font-bold text-xl">{issue.title}</h4>
          <p className="text-base text-gray-600">{issue.description}</p>
          <span
            className={`inline-block mt-3 px-4 py-1.5 text-sm font-semibold rounded-full ${
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
      </div>
  

            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;
