import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Citizen Pages
import LandingPage from "./pages/Landing";
import ReportIssue from "./pages/ReportIssue";
import IssuesPage from "./pages/Issues";
import MyIssues from "./pages/MyIssues";
import IssueDetails from "./pages/IssueDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import ManageIssues from "./pages/admin/ManageIssues";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Citizen navbar/footer should not show in Admin routes */}
      <Routes>
        {/* Citizen-facing routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/issues"
          element={
            <>
              <Navbar />
              <IssuesPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <>
              <Navbar />
              <IssueDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <Signup />
              <Footer />
            </>
          }
        />

        {/* Protected citizen routes */}
        <Route
          path="/report"
          element={
            <ProtectedRoute roles={["Citizen", "Admin"]}>
              <Navbar />
              <ReportIssue />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-issues"
          element={
            <ProtectedRoute roles={["Citizen"]}>
              <Navbar />
              <MyIssues />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Admin routes wrapped in AdminLayout (no Navbar/Footer) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminLayout>
                <ManageIssues />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> 
        
      </Routes>
    </div>
  );
}

export default App;
