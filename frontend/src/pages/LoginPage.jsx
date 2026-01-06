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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
        
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Staff Login</h2>

        {/* ERROR MESSAGE BOX */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-center border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              name="username"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none text-white"
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none text-white"
              onChange={handleChange}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-500 rounded font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/50"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}