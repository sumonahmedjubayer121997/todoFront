import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Convert to boolean
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove user data as well
    setIsAuthenticated(false);
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <nav>
      <div className="container mx-auto flex items-center justify-between gap-x-6 font-poppins">
        {/* Animated TaskMate Branding */}
        <a href="/" className="flex flex-col items-start gap-1 text-white">
          {/* Animated TaskMate Title */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-yellow-400 text-3xl font-extrabold"
          >
            TaskMate
          </motion.span>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-sm text-gray-400 italic"
          >
            Your Smartest Task Organizer 🎯
          </motion.p>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-x-6 text-white">
          <a href="/todos" className="hover:text-yellow-400 transition">
            Tasks
          </a>
          <a href="/about" className="hover:text-yellow-400 transition">
            About
          </a>
          <a href="/contact" className="hover:text-yellow-400 transition">
            Contact
          </a>

          {/* Login/Logout Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
