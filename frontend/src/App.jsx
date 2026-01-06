import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <--- Import the new Navbar

// Pages
import Kiosk from './pages/kiosk';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TvDisplay from './pages/TvDisplay';

function App() {
  return (
    <>
      {/* Navbar sits outside Routes so it shows on every page (except TV) */}
      <Navbar />

      <Routes>
        {/* 1. Landing Page is now the KIOSK */}
        <Route path="/" element={<Kiosk />} />

        {/* 2. TV Display */}
        <Route path="/tv" element={<TvDisplay />} />

        {/* 3. Staff Area */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;