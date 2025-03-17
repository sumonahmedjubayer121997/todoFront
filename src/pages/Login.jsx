import { useActionState, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LWSLogo from '../assets/lws-logo-en.svg';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import Eye Icons
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Define the login action
  const loginAction = async (prevState, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch(
        'https://simpleserverapp.vercel.app/api/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include', // ✅ Ensure cookies are sent & received
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // ✅ Store JWT Token
        localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Store User Data

        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  // Initialize useActionState
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    message: '',
  });

  // ✅ Redirect only after successful login and token storage
  if (state.success) {
    setTimeout(() => {
      navigate('/Todos');
    }, 200); // ✅ Ensure token is stored before redirecting
  }

  return (
    <>
      {/* Header */}
      <nav className="py-6 md:py-8 fixed top-0 w-full z-50 font-poppins">
        <div className="container mx-auto flex items-center justify-between gap-x-6">
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
        </div>
      </nav>

      {/* Login Form */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-poppins">
        <form
          action={formAction} // Attach the form action
          className="w-full max-w-md rounded-xl border border-[#FEFBFB]/[36%] bg-[#191D26] p-8 shadow-lg"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Sign In
          </h2>

          <div className="space-y-4 text-white">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="mt-1 block w-full rounded-md bg-[#2D323F] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle Input Type
                id="password"
                name="password"
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-md bg-[#2D323F] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[55%] transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Display error message */}
          {state.message && !state.success && (
            <p className="mt-4 text-center text-sm text-red-500">
              {state.message}
            </p>
          )}

          {/* Buttons & Link */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white transition-all hover:opacity-80"
              disabled={isPending}
            >
              {isPending ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              className="rounded bg-gray-600 px-4 py-2 text-white transition-all hover:opacity-80"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>

          {/* Register Redirect Link */}
          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => navigate('/register')}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
