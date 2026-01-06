import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function TvDisplay() {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  const fetchQueue = async () => {
    try {
      console.log("Fetching new data..."); 
      const res = await axios.get(`${API_URL}/api/queue/current`);
      console.log("Data received:", res.data);      
      const queue = res.data.queue || [];
      const serving = queue.find(p => p.status === 'serving');
      const waiting = queue.filter(p => p.status === 'waiting');

      setCurrentPatient(serving || null);
      setUpcoming(waiting.slice(0, 5)); 
    } catch (err) {
      console.error("Error fetching queue:", err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const socket = io(API_URL || window.location.origin);

    socket.on('connect', () => console.log("TV Connected to Socket!"));
    socket.on('queue_update', () => fetchQueue());

    return () => socket.disconnect();
  }, []);

  return (
    // FIX: Changed flex-row to flex-col (Vertical Layout)
    <div className="h-screen bg-gray-900 text-white p-4 md:p-6 flex flex-col gap-4">
      
      {/* TOP: NOW SERVING (Big Box) - Takes 60% Height */}
      <div className="w-full h-[60%] flex flex-col items-center justify-center bg-gray-800 rounded-3xl border-4 border-green-500 shadow-2xl p-6 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 bg-green-600 text-white px-6 py-2 rounded-br-2xl text-xl font-bold uppercase tracking-widest">
          Now Serving
        </div>
        
        {currentPatient ? (
          <div className="text-center animate-pulse">
             <h1 className="text-gray-400 text-3xl md:text-5xl mb-4 font-light">Patient Name</h1>
             <div className="text-6xl md:text-9xl font-black text-white tracking-tight mb-6 truncate max-w-full px-4">
               {currentPatient.patient_name}
             </div>
             <div className="inline-block bg-gray-700 px-8 py-3 rounded-full text-2xl md:text-4xl text-green-400 font-mono border border-gray-600">
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

      {/* BOTTOM: UPCOMING LIST - Takes Remaining Height */}
      <div className="w-full flex-1 bg-gray-800 rounded-3xl p-6 border border-gray-700 flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 text-blue-400">
          Next in Line
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {upcoming.length > 0 ? (
            upcoming.map((patient, index) => (
              <div key={patient.id} className="flex items-center p-3 bg-gray-700/50 rounded-xl border-l-4 border-blue-500">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm mr-4 shrink-0">
                  {index + 1}
                </div>
                <div className="truncate">
                  <p className="text-lg font-bold truncate">{patient.patient_name}</p>
                  <p className="text-xs text-gray-400">Ticket #{patient.id}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-4 italic">
              No other patients waiting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}