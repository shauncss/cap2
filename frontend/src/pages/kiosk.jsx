import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Kiosk() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "", 
    phone: "",
    symptoms: "",
    temperature: "36.5",
    spo2: "98",
    heartRate: "75"
  });
  
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      setFormData(prev => ({ ...prev, dob: `${dobYear}-${dobMonth}-${dobDay}` }));
    }
  }, [dobDay, dobMonth, dobYear]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/api/queue/add`, formData);
      setTicket(res.data);
      setFormData({
        name: "", dob: "", phone: "", symptoms: "",
        temperature: "36.5", spo2: "98", heartRate: "75"
      });
      setDobDay(""); setDobMonth(""); setDobYear("");
      setError("");

      setTimeout(() => {
        setTicket(null);
      }, 5000);

    } catch (err) {
      console.error(err);
      setError("System Offline. Please find a receptionist.");
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    { val: '01', label: 'Jan' }, { val: '02', label: 'Feb' }, { val: '03', label: 'Mar' },
    { val: '04', label: 'Apr' }, { val: '05', label: 'May' }, { val: '06', label: 'Jun' },
    { val: '07', label: 'Jul' }, { val: '08', label: 'Aug' }, { val: '09', label: 'Sep' },
    { val: '10', label: 'Oct' }, { val: '11', label: 'Nov' }, { val: '12', label: 'Dec' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  return (
    // FIX 1: Main Container is LOCKED (No Scroll)
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* FIX 2: Inner Card Scrolls (max-h-full + overflow-y-auto) */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 text-center transition-all flex flex-col max-h-full overflow-y-auto scrollbar-hide">
        
        {ticket ? (
          <div className="animate-bounce-in py-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">You are in line!</h2>
            <p className="text-gray-500 mb-8 text-lg">Please watch the TV screen.</p>
            
            <div className="bg-gray-100 p-8 rounded-2xl border-2 border-dashed border-gray-300 mx-auto max-w-sm">
              <p className="text-sm uppercase font-bold text-gray-400">Your Ticket Number</p>
              <p className="text-7xl font-black text-blue-600 mt-4">#{ticket.id}</p>
              <p className="text-2xl font-bold text-gray-700 mt-4">{ticket.patient_name}</p>
            </div>
            
            <p className="mt-8 text-sm text-gray-400 animate-pulse">Screen will reset in 5s...</p>
          </div>
        ) : (
          
          <form onSubmit={handleSubmit} className="text-left space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center border-b pb-4">Patient Registration 🏥</h1>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-bold text-center">{error}</div>}

            {/* SINGLE PAGE LAYOUT (Stacked) */}
            
            {/* 1. Name */}
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-sm">Full Name</label>
              <input 
                type="text" name="name" required autoFocus
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                placeholder="e.g. John Doe"
                value={formData.name} onChange={handleChange}
              />
            </div>

            {/* 2. DOB */}
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-sm">Date of Birth</label>
              <div className="flex gap-2">
                <select required className="w-1/3 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50" value={dobDay} onChange={(e) => setDobDay(e.target.value)}>
                  <option value="">Day</option>{days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select required className="w-1/3 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50" value={dobMonth} onChange={(e) => setDobMonth(e.target.value)}>
                  <option value="">Month</option>{months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                </select>
                <select required className="w-1/3 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50" value={dobYear} onChange={(e) => setDobYear(e.target.value)}>
                  <option value="">Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* 3. Phone */}
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-sm">Phone Number</label>
              <input 
                type="tel" name="phone" required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                placeholder="012-3456789"
                value={formData.phone} onChange={handleChange}
              />
            </div>

            {/* 4. Vitals */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2 text-xs uppercase">Vitals</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1 text-xs">Temp (°C)</label>
                  <input type="number" name="temperature" step="0.1" className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 text-center font-bold text-lg" value={formData.temperature} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1 text-xs">SpO2 (%)</label>
                  <input type="number" name="spo2" className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 text-center font-bold text-lg" value={formData.spo2} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1 text-xs">HR (bpm)</label>
                  <input type="number" name="heartRate" className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 text-center font-bold text-lg" value={formData.heartRate} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* 5. Symptoms */}
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-sm">Symptoms / Reason</label>
              <textarea 
                name="symptoms" rows="2"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50 resize-none"
                placeholder="Briefly describe..."
                value={formData.symptoms} onChange={handleChange}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xl shadow-lg hover:shadow-xl transition transform active:scale-[0.98] mt-2"
            >
              Get My Ticket 🎫
            </button>
          </form>
        )}
      </div>
    </div>
  );
}