import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Kiosk() {
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState(null); // Stores the ticket number after success
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      // 1. Send data to backend
      const res = await axios.post(`${API_URL}/api/queue/add`, { name });
      
      // 2. Show the Success Ticket
      setTicket(res.data);
      setName(""); 
      setError("");

      // 3. Auto-reset the screen after 5 seconds so the next person can use it
      setTimeout(() => {
        setTicket(null);
      }, 5000);

    } catch (err) {
      console.error(err);
      setError("System Offline. Please find a receptionist.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8 text-center transition-all">
        
        {/* VIEW 1: SUCCESS (SHOW TICKET) */}
        {ticket ? (
          <div className="animate-bounce-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">You are in line!</h2>
            <p className="text-gray-500 mb-6">Please watch the TV screen.</p>
            
            <div className="bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-sm uppercase font-bold text-gray-400">Your Ticket Number</p>
              <p className="text-6xl font-black text-blue-600 mt-2">#{ticket.id}</p>
              <p className="text-xl font-bold text-gray-700 mt-2">{ticket.patient_name}</p>
            </div>
            
            <p className="mt-6 text-sm text-gray-400 animate-pulse">Screen will reset in 5s...</p>
          </div>
        ) : (
          
          /* VIEW 2: FORM (ENTER NAME) */
          <form onSubmit={handleSubmit}>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome! 👋</h1>
            <p className="text-gray-500 mb-8">Please enter your name to join the queue.</p>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold">{error}</div>}

            <div className="text-left mb-6">
              <label className="block text-gray-700 font-bold mb-2 ml-1">Your Name</label>
              <input 
                type="text" 
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition bg-gray-50"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition transform active:scale-95"
            >
              Get My Ticket 🎫
            </button>
          </form>
        )}
      </div>
      
      <p className="mt-8 text-white/60 text-sm font-medium">© Clinic Queue System</p>
    </div>
  );
}