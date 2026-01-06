import { Routes, Route } from 'react-router-dom';

// 1. IMPORT ALL YOUR PAGES HERE
import Dashboard from './pages/Dashboard';       // The Main Home Page
import TvDisplay from './pages/TvDisplay';       // The TV Screen
import AdminDashboard from './pages/AdminDashboard'; // 
import LoginPage from './pages/LoginPage';       // The Login Page

function App() {
  return (
    <Routes>
       {/* 2. DEFINE THE ROUTES */}
       <Route path="/" element={<Dashboard />} />
       <Route path="/tv" element={<TvDisplay />} />
       <Route path="/admin" element={<AdminDashboard />} />
       <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;