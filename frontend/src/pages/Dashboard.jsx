import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-8">Clinic Queue System</h1>
      <div className="flex gap-4 justify-center">
        <Link to="/tv" className="bg-blue-600 text-white px-6 py-3 rounded">Open TV Display</Link>
        <Link to="/login" className="bg-green-600 text-white px-6 py-3 rounded">Staff Login</Link>
      </div>
    </div>
  );
}