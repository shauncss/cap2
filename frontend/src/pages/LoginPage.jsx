import { API_URL } from '../config';
import { useState, useEffect } from 'react'; // <--- Added useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // FIX: Check if already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      navigate('/admin');
    } catch (err) {
      console.error("Login Failed:", err);
      setError(err.response?.data?.error || "Login failed. Check server.");
    }
  };

  return (
    // Height adjusted for new navbar size
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      
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
    </div>
  );
}