import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Kiosk() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "", // We will build this from the 3 dropdowns
    phone: "",
    symptoms: "",
    temperature: "36.5",
    spo2: "98",
    heartRate: "75"
  });
  
  // Separate states for the DOB dropdowns
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  // Update main formData whenever the dropdowns change
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
      
      // Reset form
      setFormData({
        name: "", dob: "", phone: "", symptoms: "",
        temperature: "36.5", spo2: "98", heartRate: "75"
      });
      setDobDay(""); setDobMonth(""); setDobYear(""); // Reset dropdowns
      setError("");

      setTimeout(() => {
        setTicket(null);
      }, 5000);

    } catch (err) {
      console.error(err);
      setError("System Offline. Please find a receptionist.");
    }
  };

  // Helper arrays for Date Dropdowns
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
    // FIX 1: Exact height calculation [100vh - 80px Navbar]
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Scrollable Container for the card only */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto max-h-full p-6 text-center transition-all scrollbar-hide">
        
        {ticket ? (
          <div className="animate-bounce-in py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">You are in line!</h2>
            <p className="text-gray-500 mb-6">Please watch the TV screen.</p>
            
            <div className="bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300 mx-auto max-w-sm">
              <p className="text-sm uppercase font-bold text-gray-400">Your Ticket Number</p>
              <p className="text-6xl font-black text-blue-600 mt-2">#{ticket.id}</p>
              <p className="text-xl font-bold text-gray-700 mt-2">{ticket.patient_name}</p>
            </div>
            
            <p className="mt-6 text-sm text-gray-400 animate-pulse">Screen will reset in 5s...</p>
          </div>
        ) : (
          
          <form onSubmit={handleSubmit} className="text-left">
            <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Patient Registration 🏥</h1>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold text-center">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1 ml-1 text-sm">Full Name</label>
                <input 
                  type="text" name="name" required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                  placeholder="e.g. John Doe"
                  value={formData.name} onChange={handleChange}
                />
              </div>

              {/* FIX 2: IMPROVED DATE OF BIRTH (3 Dropdowns) */}
              <div className="md:col-span-1">
                <label className="block text-gray-700 font-bold mb-1 ml-1 text-sm">Date of Birth</label>
                <div className="flex gap-2">
                  {/* Day */}
                  <select 
                    required 
                    className="w-1/3 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                    value={dobDay} onChange={(e) => setDobDay(e.target.value)}
                  >
                    <option value="">Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                  {/* Month */}
                  <select 
                    required 
                    className="w-1/3 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                    value={dobMonth} onChange={(e) => setDobMonth(e.target.value)}
                  >
                    <option value="">Month</option>
                    {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                  </select>

                  {/* Year */}
                  <select 
                    required 
                    className="w-1/3 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                    value={dobYear} onChange={(e) => setDobYear(e.target.value)}
                  >
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-bold mb-1 ml-1 text-sm">Phone Number</label>
                <input 
                  type="tel" name="phone" required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                  placeholder="012-3456789"
                  value={formData.phone} onChange={handleChange}
                />
              </div>
            </div>

            {/* Vitals Section */}
            <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-3 text-sm uppercase">Vitals (Default / Measured)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-600 font-bold mb-1 text-xs">Temp (°C)</label>
                  <input 
                    type="number" name="temperature" step="0.1"
                    className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 text-center font-bold text-lg"
                    value={formData.temperature} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1 text-xs">SpO2 (%)</label>
                  <input 
                    type="number" name="spo2"
                    className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 text-center font-bold text-lg"
                    value={formData.spo2} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1 text-xs">Heart Rate</label>
                  <input 
                    type="number" name="heartRate"
                    className="w-full p-2 border border-blue-200 rounded-lg focus:border-blue-500 text-center font-bold text-lg"
                    value={formData.heartRate} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-1 ml-1 text-sm">Symptoms / Reason</label>
              <textarea 
                name="symptoms" rows="2"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-gray-50"
                placeholder="e.g. Fever, Cough..."
                value={formData.symptoms} onChange={handleChange}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition transform active:scale-[0.98]"
            >
              Get My Ticket 🎫
            </button>
          </form>
        )}
      </div>
      
      <p className="mt-4 text-white/60 text-xs font-medium">© Clinic Queue System</p>
    </div>
  );
}