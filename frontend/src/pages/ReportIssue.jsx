import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { reportIssue } from "../services/api";

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center?.length === 2) map.setView(center, 15);
  }, [center, map]);
  return null;
};

const ReportIssue = () => {
  const [position, setPosition] = useState([28.61, 77.23]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  };

  useEffect(() => {
    handleLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await reportIssue({
      title,
      category,
      description,
      imageUrl: imageUrl || null,
      location: { lat: position[0], lng: position[1] },
    });
    setTitle("");
    setCategory("");
    setDescription("");
    setImageUrl("");
    alert("Issue submitted successfully ✅");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-blue-700">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Issue title" required className="w-full border p-2 rounded-lg" />
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full border p-2 rounded-lg" />
        <div>
          <label className="block font-semibold mb-2">Location</label>
          <button type="button" onClick={handleLocation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Use My Location</button>
          <div className="h-64 mt-4 rounded-lg overflow-hidden shadow">
            <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <RecenterMap center={position} />
              <Marker position={position} />
            </MapContainer>
          </div>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full border p-2 rounded-lg">
          <option value="">-- Select Category --</option><option value="Road">Road / Pothole</option><option value="Sanitation">Garbage / Sanitation</option><option value="Lighting">Streetlight</option><option value="Water">Water / Drainage</option><option value="Other">Other</option>
        </select>
        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border p-2 rounded-lg" placeholder="Describe the issue in detail..." />
        <div className="text-center"><button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow">Submit Issue</button></div>
      </form>
    </div>
  );
};

export default ReportIssue;
