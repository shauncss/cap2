import { useState } from 'react';
import axios from 'axios';

export default function Kiosk() {
  // 1. Memory: Store the form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    symptoms: '',
    temp: '',
    spo2: '',
    hr: ''
  });

  const [loading, setLoading] = useState(false);

  // 2. Logic: Handle typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Logic: Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    setLoading(true);

    try {
      // Send data to Backend (Port 5000)
      const response = await axios.post('http://localhost:5000/api/checkin', formData);
      
      alert(`Check-in Successful! Ticket: ${response.data.queueNumber}`);
      
      // Clear form
      setFormData({
        firstName: '', lastName: '', dateOfBirth: '', phone: '',
        symptoms: '', temp: '', spo2: '', hr: ''
      });

    } catch (error) {
      console.error(error);
      alert('Error connecting to server. Is the Backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Patient Check-In</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Doe" />
            </div>
          </div>

          {/* Row 2: Personal Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} 
                className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} 
                className="w-full p-3 border rounded-lg" placeholder="012-3456789" />
            </div>
          </div>

          {/* Row 3: Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Symptoms / Reason</label>
            <textarea required name="symptoms" value={formData.symptoms} onChange={handleChange} rows="3"
              className="w-full p-3 border rounded-lg" placeholder="Fever, cough, checkup..." />
          </div>

          {/* Row 4: Vitals (Optional) */}
          <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
            <div>
              <label className="block text-xs font-bold text-gray-600">Temp (°C)</label>
              <input name="temp" type="number" step="0.1" value={formData.temp} onChange={handleChange} 
                className="w-full p-2 border rounded" placeholder="36.5" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600">SPO2 (%)</label>
              <input name="spo2" type="number" value={formData.spo2} onChange={handleChange} 
                className="w-full p-2 border rounded" placeholder="98" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600">Heart Rate</label>
              <input name="hr" type="number" value={formData.hr} onChange={handleChange} 
                className="w-full p-2 border rounded" placeholder="75" />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            {loading ? 'Registering...' : 'Get Queue Number'}
          </button>

        </form>
      </div>
    </div>
  );
}