import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchIssues } from "../services/api";

const getMarkerIcon = (status) => {
  const color = status === "Resolved" ? "green" : status === "In Progress" ? "orange" : "red";
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2px solid white"></div>`,
  });
};

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({ status: "All", category: "All" });

  useEffect(() => {
    const load = async () => {
      const data = await fetchIssues(filters);
      setIssues(data);
    };
    load();
  }, [filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-3">Filter by Status</h3>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full border rounded px-3 py-2">
            <option>All</option><option>Reported</option><option>In Progress</option><option>Resolved</option>
          </select>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-3">Filter by Category</h3>
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full border rounded px-3 py-2">
            <option>All</option><option>Road</option><option>Sanitation</option><option>Lighting</option><option>Water</option><option>Other</option>
          </select>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="h-96 rounded-lg overflow-hidden border">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {issues.filter((i) => i.location?.lat && i.location?.lng).map((issue) => (
              <Marker key={issue.id} position={[issue.location.lat, issue.location.lng]} icon={getMarkerIcon(issue.status)}>
                <Popup><h4 className="font-bold">{issue.title}</h4><p>{issue.category}</p><p>{issue.status}</p></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {issues.length === 0 ? <div className="col-span-2 text-center text-gray-500 py-8">No issues found.</div> : issues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {issue.imageUrl && <img src={issue.imageUrl} alt={issue.title} className="h-64 w-full object-cover" />}
              <div className="p-6 space-y-2">
                <h4 className="font-bold text-xl">{issue.title}</h4>
                <p className="text-base text-gray-600">{issue.description}</p>
                <span className="inline-block mt-3 px-4 py-1.5 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">{issue.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;
