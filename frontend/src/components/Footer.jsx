import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">JanSamadhan</h2>
          <p className="mt-3 text-gray-400">
            Empowering citizens and authorities to work together for a better
            city. Report issues, track progress, and create change.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/report" className="hover:text-white">
                Report Issue
              </Link>
            </li>
            <li>
              <Link to="/issues" className="hover:text-white">
                View Issues
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-white">
                Signup
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-2">
            <li>Email: support@JanSamadhan.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: New Delhi, India</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} JanSamadhan. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
