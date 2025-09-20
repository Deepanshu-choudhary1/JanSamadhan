import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ReportIssue = () => {
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState([28.61, 77.23]); // Default: New Delhi
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Issue submitted ✅ (connect to backend later)");
    // TODO: POST /issues/report
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-blue-700">
        Report an Issue
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        {/* File Upload */}
        <div>
          <label className="block font-semibold mb-2">Upload Image/Video</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="block w-full border p-2 rounded-lg"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Preview:</p>
              {preview.includes("video") ? (
                <video
                  src={preview}
                  controls
                  className="mt-2 rounded-lg w-64 shadow"
                />
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 rounded-lg w-64 shadow"
                />
              )}
            </div>
          )}
        </div>

        {/* Location Picker */}
        <div>
          <label className="block font-semibold mb-2">Location</label>
          <button
            type="button"
            onClick={handleLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Use My Location
          </button>
          <div className="h-64 mt-4 rounded-lg overflow-hidden shadow">
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position} />
            </MapContainer>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">-- Select Category --</option>
            <option value="Road">Road / Pothole</option>
            <option value="Garbage">Garbage / Sanitation</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Water">Water / Drainage</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-lg"
            placeholder="Describe the issue in detail..."
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow"
          >
            Submit Issue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
