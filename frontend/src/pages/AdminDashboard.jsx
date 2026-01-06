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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clinic Admin</h1>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:underline">Logout</button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="space-y-6">
          
          {/* Card A: Current Status (The Big Display) */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-green-500 text-center">
            <h2 className="text-gray-500 font-bold uppercase tracking-wide mb-2">Currently Serving</h2>
            
            <div className="text-5xl font-extrabold text-gray-800 mb-4 h-16">
              {/* The 'h-16' ensures the box size doesn't jump if text changes */}
              {currentPatient ? currentPatient.patient_name : "No One"}
            </div>
            
            <p className="text-gray-400 mb-6">
              {currentPatient ? `Ticket #${currentPatient.id}` : "Room is empty"}
            </p>
            
            {/* BUTTONS GROUP */}
            <div className="flex gap-4">
              
              {/* Finish / Pause Button (Only show if someone is serving) */}
              {currentPatient && (
                <button 
                  onClick={handleComplete}
                  className="flex-1 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg text-lg shadow transition"
                >
                  ☕ Finish (Pause)
                </button>
              )}

              {/* Call Next Button */}
              <button 
                onClick={handleCallNext}
                className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xl shadow-lg transition-transform transform hover:scale-105"
              >
                📢 Call Next
              </button>
            </div>
          </div>

          {/* Card B: Add Patient */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-gray-700 mb-4">Add New Ticket</h3>
            <form onSubmit={handleAddPatient} className="flex gap-3">
              <input 
                type="text" 
                placeholder="Patient Name" 
                className="flex-1 p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
                value={newPatient}
                onChange={(e) => setNewPatient(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-6 rounded font-bold hover:bg-blue-700">
                Add
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS */}
        <div className="grid grid-cols-1 gap-6 content-start">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Total Patients</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Waiting Now</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Avg Wait Time</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.avg_wait} <span className="text-lg text-gray-400">min</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}