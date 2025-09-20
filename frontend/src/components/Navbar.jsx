import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-700">
          <img src={logo} alt="Logo" className="h-16 inline mr-2" />
          JanSamadhan
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="text-gray-700 hover:text-blue-700">
            Home
          </Link>
          <Link to="/report" className="text-gray-700 hover:text-blue-700">
            Report Issue
          </Link>
          <Link to="/issues" className="text-gray-700 hover:text-blue-700">
            View Issues
          </Link>
          {user && user.role === "Citizen" && (
            <Link to="/my-issues" className="text-gray-700 hover:text-blue-700">
              My Issues
            </Link>
          )}
          {user && user.role === "Admin" && (
            <Link to="/admin" className="text-gray-700 hover:text-blue-700">
              Admin
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="space-x-4">
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
