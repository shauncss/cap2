import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, avg_wait: 0 });
  const [newPatient, setNewPatient] = useState("");
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/api/queue/stats`);
      setStats(statsRes.data);

      const queueRes = await axios.get(`${API_URL}/api/queue/current`);
      const queue = queueRes.data.queue || [];
      const serving = queue.find(p => p.status === 'serving');
      setCurrentPatient(serving || null);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.trim()) return;
    try {
      await axios.post(`${API_URL}/api/queue/add`, { name: newPatient });
      setNewPatient("");
      fetchData();
      alert("Patient Added!");
    } catch (error) {
      alert("Failed to add patient.");
    }
  };

  const handleCallNext = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/queue/call-next`);
      if (res.data.patient) {
        alert(`Now Serving: ${res.data.patient.patient_name}`);
      } else {
        alert("Queue is empty!");
      }
      fetchData();
    } catch (error) {
      console.error("Error calling next:", error);
      alert("Failed to call next patient.");
    }
  };

  const handleComplete = async () => {
    try {
      await axios.post(`${API_URL}/api/queue/complete`);
      fetchData(); 
    } catch (error) {
      console.error("Error completing patient:", error);
      alert("Failed to complete patient.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-indigo-600 text-white font-bold">Loading...</div>;

  return (
    // FIX 1: Exact height calculation [100vh - 80px]
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col overflow-hidden">
      
      {/* Internal Navbar for Dashboard */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-md px-8 py-4 flex justify-between items-center z-40 shrink-0">
        <h1 className="text-2xl font-extrabold text-indigo-700 flex items-center gap-2">
          👨‍⚕️ Admin Panel
        </h1>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">
          Logout
        </button>
      </nav>

      {/* Main Content: Auto overflow if content is too tall */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Card A: Current Status */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-green-500 text-center transform transition hover:scale-[1.01]">
              <h2 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Currently Serving</h2>
              <div className="py-4">
                <div className="text-5xl font-black text-gray-800 h-16 truncate">
                  {currentPatient ? currentPatient.patient_name : "No One"}
                </div>
                <p className="text-indigo-500 font-bold mt-2">
                  {currentPatient ? `Ticket #${currentPatient.id}` : "Ready for next patient"}
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                {currentPatient && (
                  <button onClick={handleComplete} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-lg shadow-sm border border-gray-300 transition">
                    ☕ Pause
                  </button>
                )}
                <button onClick={handleCallNext} className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xl shadow-lg hover:shadow-green-500/50 transition-all transform active:scale-95">
                  📢 Call Next
                </button>
              </div>
            </div>

            {/* Card B: Manual Add */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Manual Entry</h3>
              <form onSubmit={handleAddPatient} className="flex gap-3">
                <input 
                  type="text" placeholder="Patient Name" 
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition bg-gray-50"
                  value={newPatient} onChange={(e) => setNewPatient(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition">Add</button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: STATS */}
          <div className="grid grid-cols-1 gap-6 content-start">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div><p className="text-gray-400 text-xs font-bold uppercase">Total Patients</p><p className="text-4xl font-black text-gray-800">{stats.total}</p></div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">📊</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div><p className="text-gray-400 text-xs font-bold uppercase">Waiting Now</p><p className="text-4xl font-black text-gray-800">{stats.pending}</p></div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">⏳</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div><p className="text-gray-400 text-xs font-bold uppercase">Avg Wait Time</p><p className="text-4xl font-black text-gray-800">{stats.avg_wait} <span className="text-lg text-gray-400 font-medium">min</span></p></div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">⏱️</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}