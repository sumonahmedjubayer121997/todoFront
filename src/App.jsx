import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✨ Import Framer Motion
import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';
import './App.css';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // 👁️ Import Eye Icons

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Track Login Status

  // ✅ Check Login Status on Page Load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // If token exists, user is logged in
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('⚠️ Email and Password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://simpleserverapp.vercel.app/api/user/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '❌ Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setIsLoggedIn(true); // ✅ Update login state
      navigate('/'); // ✅ Redirect after successful login
    } catch (err) {
      console.error('❌ Login Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="flex min-h-screen text-white font-poppins">
        {/* ✅ Show Hero Section as Full Page When Logged In */}
        {isLoggedIn ? (
          <motion.div
            className="w-full flex justify-center items-center bg-[#191D26] min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <HeroSection />
          </motion.div>
        ) : (
          <>
            {/* ✅ Left Section (Login Form) */}
            <motion.div
              className="w-1/4 flex justify-center bg-transparent backdrop-blur-md text-white p-10 min-h-screen shadow-lg rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.form
                onSubmit={handleLogin}
                className="text-center w-full max-w-xs"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-500">
                  Log in to your account
                </h2>

                {/* ✅ Email Input */}
                <motion.div className="mb-4" whileFocus={{ scale: 1.05 }}>
                  <label htmlFor="email" className="block text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="mt-1 block w-full rounded-md bg-[#3A3F50] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>

                {/* ✅ Password Input with Toggle */}
                <motion.div
                  className="relative mb-4"
                  whileFocus={{ scale: 1.05 }}
                >
                  <label htmlFor="password" className="block text-sm">
                    Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="mt-1 block w-full rounded-md bg-[#3A3F50] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[55%] transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </motion.div>

                {/* ✅ Error Message */}
                {error && (
                  <motion.p
                    className="mt-2 text-center text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* ✅ Login Button */}
                <motion.button
                  type="submit"
                  className={`w-full py-3 mt-4 text-white rounded-md transition ${
                    loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                  }`}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </motion.button>

                {/* ✅ Register Redirect */}
                <p className="mt-4 text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <span
                    className="cursor-pointer text-blue-400 hover:underline"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </span>
                </p>
              </motion.form>
            </motion.div>

            {/* ✅ Right Section (Hero Section) */}
            <motion.div
              className="w-3/4 flex justify-center items-center bg-[#191D26] min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <HeroSection />
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default App;
