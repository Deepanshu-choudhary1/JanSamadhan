import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { signupUser } from "../services/api";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Citizen",
    adminSignupKey: "",
    phone: "",
    pushToken: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone || undefined,
        pushToken: form.pushToken || undefined,
      };

      if (form.role === "Admin") {
        payload.adminSignupKey = form.adminSignupKey;
      }

      const data = await signupUser(payload);
      login(data.user, data.token);
      navigate(data.user.role === "Admin" ? "/admin" : "/my-issues");
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        <input type="tel" name="phone" placeholder="Phone (optional for SMS alerts)" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
        <input type="text" name="pushToken" placeholder="Push token (optional)" value={form.pushToken} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
          <option value="Citizen">Citizen</option>
          <option value="Admin">Admin</option>
        </select>
        {form.role === "Admin" && (
          <input
            type="password"
            name="adminSignupKey"
            placeholder="Admin signup key"
            value={form.adminSignupKey}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
