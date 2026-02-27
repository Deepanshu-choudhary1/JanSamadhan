import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(form);
      login(data.user, data.token);
      navigate(data.user.role === "Admin" ? "/admin" : "/my-issues");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};

export default Login;
