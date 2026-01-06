import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  // Don't show the navbar on the TV screen (it should look clean)
  if (location.pathname === '/tv') return null;

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center relative z-50">
      {/* Brand / Logo */}
      <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
        🏥 <span className="hidden sm:inline">Clinic Queue System</span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link 
          to="/" 
          className={`font-semibold hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          🖥️ Kiosk
        </Link>
        
        <Link 
          to="/tv" 
          target="_blank" // Opens TV in new tab (Pro tip!)
          className="font-semibold text-gray-500 hover:text-blue-600"
        >
          📺 TV Display
        </Link>

        <Link 
          to="/login" 
          className={`font-semibold hover:text-blue-600 ${location.pathname.startsWith('/admin') || location.pathname === '/login' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          🔐 Staff Login
        </Link>
      </div>
    </nav>
  );
}