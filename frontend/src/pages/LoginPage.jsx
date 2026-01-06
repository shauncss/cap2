import { API_URL } from '../config';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  
  // FIX 3: Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

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
      setError(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    // FIX 1: Exact height calculation [100vh - 80px]
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4 overflow-hidden">
      
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all transform hover:scale-[1.01]">
        
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
            {/* FIX 3: Password Input with Eye Icon */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 outline-none text-gray-800 font-medium transition pr-12"
                placeholder="••••••••"
                onChange={handleChange}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
              >
                {showPassword ? (
                  // Open Eye SVG
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  // Closed Eye SVG
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-transform transform active:scale-95"
          >
            Sign In
          </button>
        </form>

      </div>
      
      <div className="absolute bottom-6 text-white/50 text-xs">
        Authorized Personnel Only
      </div>
    </div>
  );
}