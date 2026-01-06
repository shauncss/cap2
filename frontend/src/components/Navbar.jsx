import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  // Don't show the navbar on the TV screen (it should look clean)
  if (location.pathname === '/tv') return null;

  return (
    <nav className="h-16 bg-white shadow-md px-8 py-2 flex justify-between items-center relative z-50">
      <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
        🏥 <span className="hidden sm:inline">Clinic Queue System</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center">
        
        <Link 
          to="/tv" 
          target="_blank" 
          className="mr-24 flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-transparent font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all"
        >
          📺 TV Display
        </Link>
        
        <div className="flex gap-8">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
              location.pathname === '/' 
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200'
            }`}
          >
            🖥️ Kiosk
          </Link>
          
          <Link 
            to="/login" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
              location.pathname.startsWith('/admin') || location.pathname === '/login'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200'
            }`}
          >
            🔐 Staff Login
          </Link>
        </div>

      </div>
    </nav>
  );
}