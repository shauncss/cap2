import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function TvDisplay() {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  // 2. FETCH FUNCTION (Same as before)
  const fetchQueue = async () => {
    try {
      console.log("Fetching new data..."); // <--- Debug 1
      const res = await axios.get(`${API_URL}/api/queue/current`);
      console.log("Data received:", res.data); // <--- Debug 2 (Check this in console!)      
      const queue = res.data.queue || [];
      const serving = queue.find(p => p.status === 'serving');
      const waiting = queue.filter(p => p.status === 'waiting');

      setCurrentPatient(serving || null);
      setUpcoming(waiting.slice(0, 5)); // Show next 5
    } catch (err) {
      console.error("Error fetching queue:", err);
    }
  };

  useEffect(() => {
    // A. Initial Load
    fetchQueue();

    // B. CONNECT TO SOCKET
    const socket = io(API_URL || window.location.origin);

    socket.on('connect', () => {
      console.log("TV Connected to Socket!"); // Check your browser console for this!
    });

    // C. LISTEN FOR UPDATES
    socket.on('queue_update', () => {
      console.log("TV Received Update!"); // Debug log
      fetchQueue(); // Re-fetch data instantly
    });

    // D. CLEANUP (Disconnect when page closes)
    return () => socket.disconnect();
  }, []); // Empty dependency array = run once on mount

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex gap-10">
      
      {/* LEFT: NOW SERVING (Big Box) */}
      <div className="w-2/3 flex flex-col items-center justify-center bg-gray-800 rounded-3xl border-4 border-green-500 shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-green-600 text-white px-6 py-2 rounded-br-2xl text-xl font-bold uppercase tracking-widest">
          Now Serving
        </div>
        
        {currentPatient ? (
          <div className="text-center animate-pulse">
             <h1 className="text-gray-400 text-4xl mb-4 font-light">Patient Name</h1>
             <div className="text-8xl font-black text-white tracking-tight mb-6">
               {currentPatient.patient_name}
             </div>
             <div className="bg-gray-700 px-8 py-3 rounded-full text-2xl text-green-400 font-mono border border-gray-600">
               Ticket #{currentPatient.id}
             </div>
          </div>
        ) : (
          <div className="text-center opacity-50">
             <div className="text-6xl mb-4">☕</div>
             <h2 className="text-4xl font-bold">Please Wait</h2>
             <p className="text-xl mt-2">Doctor will be with you shortly</p>
          </div>
        )}
      </div>

      {/* RIGHT: UPCOMING LIST */}
      <div className="w-1/3 bg-gray-800 rounded-3xl p-8 border border-gray-700 flex flex-col">
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4 text-blue-400">
          Next in Line
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {upcoming.length > 0 ? (
            upcoming.map((patient, index) => (
              <div key={patient.id} className="flex items-center p-4 bg-gray-700/50 rounded-xl border-l-4 border-blue-500">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xl font-bold">{patient.patient_name}</p>
                  <p className="text-sm text-gray-400">Ticket #{patient.id}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10 italic">
              No other patients waiting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}