import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, avg_wait: 0 });
  const [newPatient, setNewPatient] = useState("");
  const [currentPatient, setCurrentPatient] = useState(null); // <--- NEW: Stores who is in the room
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Stats & Current Patient
  const fetchData = async () => {
    try {
      // Get Stats
      const statsRes = await axios.get(`${API_URL}/api/queue/stats`);
      setStats(statsRes.data);

      // Get Current Queue (to see who is serving)
      const queueRes = await axios.get(`${API_URL}/api/queue/current`);
      // Find the person with status 'serving'
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
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, [navigate]);

  // 2. ADD PATIENT Logic
  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.trim()) return;
    try {
      await axios.post(`${API_URL}/api/queue/add`, { name: newPatient });
      setNewPatient("");
      fetchData(); // Refresh immediately
      alert("Patient Added!");
    } catch (error) {
      alert("Failed to add patient.");
    }
  };

  // 3. NEW: CALL NEXT Logic
  const handleCallNext = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/queue/call-next`);
      
      if (res.data.patient) {
        alert(`Now Serving: ${res.data.patient.patient_name}`);
      } else {
        alert("Queue is empty!");
      }
      fetchData(); // Refresh screen to show change
    } catch (error) {
      console.error("Error calling next:", error);
      alert("Failed to call next patient.");
    }
  };

  // 4. NEW: FINISH/PAUSE Logic
const handleComplete = async () => {
  try {
    await axios.post(`${API_URL}/api/queue/complete`);
    // We don't need an alert here, just refresh the screen to show the room is empty
    fetchData(); 
  } catch (error) {
    console.error("Error completing patient:", error);
    alert("Failed to complete patient.");
  }
};

  // 5. LOGOUT Logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-indigo-600 text-white font-bold">Loading Dashboard...</div>;

  return (
    // THEME UPDATE: Gradient Background
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 pb-10">
      
      {/* Navbar with transparency to blend in */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-md px-8 py-4 flex justify-between items-center mb-8 sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-indigo-700 flex items-center gap-2">
          👨‍⚕️ Admin Panel
        </h1>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="space-y-6">
          
          {/* Card A: Current Status */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-green-500 text-center transform transition hover:scale-[1.02]">
            <h2 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Currently Serving</h2>
            
            <div className="py-4">
              <div className="text-5xl font-black text-gray-800 h-16 truncate">
                {currentPatient ? currentPatient.patient_name : "No One"}
              </div>
              <p className="text-indigo-500 font-bold mt-2">
                {currentPatient ? `Ticket #${currentPatient.id}` : "Ready for next patient"}
              </p>
            </div>
            
            {/* BUTTONS GROUP */}
            <div className="flex gap-4 mt-6">
              {currentPatient && (
                <button 
                  onClick={handleComplete}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-lg shadow-sm border border-gray-300 transition"
                >
                  ☕ Pause
                </button>
              )}

              <button 
                onClick={handleCallNext}
                className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xl shadow-lg hover:shadow-green-500/50 transition-all transform active:scale-95"
              >
                📢 Call Next
              </button>
            </div>
          </div>

          {/* Card B: Add Patient */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Manual Entry</h3>
            <form onSubmit={handleAddPatient} className="flex gap-3">
              <input 
                type="text" 
                placeholder="Patient Name" 
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition bg-gray-50"
                value={newPatient}
                onChange={(e) => setNewPatient(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition">
                Add
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS */}
        <div className="grid grid-cols-1 gap-6 content-start">
          
          {/* Stat Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">Total Patients</p>
              <p className="text-4xl font-black text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">📊</div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">Waiting Now</p>
              <p className="text-4xl font-black text-gray-800">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">⏳</div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">Avg Wait Time</p>
              <p className="text-4xl font-black text-gray-800">{stats.avg_wait} <span className="text-lg text-gray-400 font-medium">min</span></p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">⏱️</div>
          </div>

        </div>

      </div>
    </div>
  );
}