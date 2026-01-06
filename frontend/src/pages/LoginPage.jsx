import { API_URL } from '../config';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to move between pages

  // 1. Handle typing in the inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Handle the "Sign In" button click
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh
    setError(null); // Clear previous errors

    try {
      // SEND REQUEST (Matches what we did in Thunder Client)
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);

      // SUCCESS!
      console.log("Login Success:", res.data);
      
      // A. Save the Token in the Browser's "Safe" (LocalStorage)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      // B. Redirect to the Dashboard
      navigate('/admin');

    } catch (err) {
      console.error("Login Failed:", err);
      // Show error message from backend or a default one
      setError(err.response?.data?.error || "Login failed. Check server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      
      <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-md transition-all transform">
        
        <div className="text-center mb-8">
          <span className="text-4xl">🔐</span>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">Staff Access</h2>
          <p className="text-gray-500 text-sm mt-1">Please log in to manage the queue.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center text-sm font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">Username</label>
            <input 
              type="text" 
              name="username"
              className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 outline-none text-gray-800 font-medium transition"
              placeholder="Enter your username"
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 outline-none text-gray-800 font-medium transition"
              placeholder="••••••••"
              onChange={handleChange}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-transform transform active:scale-95"
          >
            Sign In
          </button>
        </form>

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-white/50 text-xs">
        Authorized Personnel Only
      </div>
    </div>
  );
}