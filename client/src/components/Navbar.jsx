import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-white font-bold text-xl">
        Car Management
      </Link>
      <div>
        <Link to="/dashboard" className="text-gray-300 hover:text-white mr-4">
          Dashboard
        </Link>
        <Link to="/create" className="text-gray-300 hover:text-white mr-4">
          Create Car
        </Link>
        <button
          onClick={handleLogout}
          className="text-gray-300 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;