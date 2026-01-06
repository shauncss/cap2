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
    // FIX: Overflow Hidden ensures the page never scrolls, only inner content if needed
    <div className="h-[calc(100vh-80px)] w-full bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col overflow-hidden">
      
      <nav className="bg-white/95 backdrop-blur-sm shadow-md px-6 py-3 flex justify-between items-center z-40 shrink-0 h-16">
        <h1 className="text-xl font-extrabold text-indigo-700 flex items-center gap-2">
          👨‍⚕️ Admin Panel
        </h1>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition text-sm">
          Logout
        </button>
      </nav>

      <div className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 h-full overflow-hidden">
            
            {/* Card A: Current Status */}
            <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-8 border-green-500 text-center flex-1 flex flex-col justify-center transform transition hover:scale-[1.01]">
              <h2 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Currently Serving</h2>
              <div className="py-2 flex-1 flex flex-col justify-center">
                <div className="text-5xl lg:text-6xl font-black text-gray-800 truncate">
                  {currentPatient ? currentPatient.patient_name : "No One"}
                </div>
                <p className="text-indigo-500 font-bold mt-2 text-lg">
                  {currentPatient ? `Ticket #${currentPatient.id}` : "Ready for next patient"}
                </p>
              </div>
              <div className="flex gap-3 mt-4">
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
            <div className="bg-white p-5 rounded-2xl shadow-lg shrink-0">
              <h3 className="font-bold text-gray-700 mb-3 border-b pb-2 text-sm">Manual Entry</h3>
              <form onSubmit={handleAddPatient} className="flex gap-2">
                <input 
                  type="text" placeholder="Patient Name" 
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition bg-gray-50"
                  value={newPatient} onChange={(e) => setNewPatient(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition">Add</button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4 h-full overflow-hidden">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex-1 flex items-center justify-between">
              <div><p className="text-gray-400 text-xs font-bold uppercase">Total Patients</p><p className="text-5xl font-black text-gray-800">{stats.total}</p></div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">📊</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl flex-1 flex items-center justify-between">
              <div><p className="text-gray-400 text-xs font-bold uppercase">Waiting Now</p><p className="text-5xl font-black text-gray-800">{stats.pending}</p></div>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl">⏳</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl flex-1 flex items-center justify-between">
              <div><p className="text-gray-400 text-xs font-bold uppercase">Avg Wait Time</p><p className="text-5xl font-black text-gray-800">{stats.avg_wait} <span className="text-xl text-gray-400 font-medium">min</span></p></div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">⏱️</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}