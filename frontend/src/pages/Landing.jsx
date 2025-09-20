import { Link } from "react-router-dom";
import Carousal from "../components/ui/carousal";

const LandingPage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Text */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              JanSamadhan
            </h1>
            <h3 className="text-4xl md:text-3xl font-bold leading-tight">
              Quick Solutions for the People, by the People.
            </h3>
            <p className="text-lg text-blue-100">
              Report civic issues instantly, track progress, and make your city better.  
              Empower citizens and authorities to collaborate.
            </p>
            <Link
              to="/report"
              className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              Report an Issue
            </Link>
          </div>

          {/* Right: Illustration */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Carousal/>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-4xl font-bold text-blue-700">1,245</h2>
            <p className="text-gray-600 mt-2">Issues Reported</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-4xl font-bold text-green-600">876</h2>
            <p className="text-gray-600 mt-2">Resolved</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-4xl font-bold text-yellow-600">369</h2>
            <p className="text-gray-600 mt-2">In Progress</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Be a changemaker in your city 🌍
          </h2>
          <p className="text-blue-200">
            Together, we can build cleaner, safer, and smarter communities.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
