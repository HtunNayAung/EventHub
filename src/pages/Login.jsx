import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Make real API call to backend
      const response = await authService.login(formData);
      
      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', `${response.data.firstName} ${response.data.lastName}`);
      localStorage.setItem('token', response.data.token);
      
      // Navigate based on user role
      if (response.data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (response.data.role === 'ORGANIZER') {
        navigate(`/organizer/${response.data.id}/dashboard`);
      } else {
        // Default for ATTENDEE
        navigate(`/attendee/${response.data.id}/dashboard`);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid email or password. Please try again.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F5EEDC] min-h-screen py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-[#27548A] to-[#183B4E] rounded-t-lg p-8 text-center">
              <h1 className="text-3xl font-bold text-[#F5EEDC]">Welcome Back</h1>
              <p className="text-[#F5EEDC]/80 mt-2">Sign in to your EventHub account</p>
            </div>
            
            <div className="bg-white rounded-b-lg shadow-lg p-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#183B4E] mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-[#183B4E]/50" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#183B4E] mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-[#183B4E]/50" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#27548A] focus:ring-[#DDA853] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-[#183B4E]">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-[#27548A] hover:text-[#DDA853]">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#27548A] text-[#F5EEDC] py-3 rounded-lg font-medium hover:bg-[#183B4E] transition-colors disabled:opacity-70"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-[#183B4E]/70">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-[#27548A] hover:text-[#DDA853]">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;