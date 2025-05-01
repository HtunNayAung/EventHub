import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';

const Signup = ({ isOrganizer = false }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: isOrganizer ? 'ORGANIZER' : 'ATTENDEE',
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
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      // Call the signup API
      const response = await authService.signup(signupData);
      
      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', `${response.data.firstName} ${response.data.lastName}`);
      
      // Redirect to dashboard
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please check your connection and try again.');
      }
    } finally {
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
              <h1 className="text-3xl font-bold text-[#F5EEDC]">
                {isOrganizer ? 'Become an Organizer' : 'Create Account'}
              </h1>
              <p className="text-[#F5EEDC]/80 mt-2">
                {isOrganizer 
                  ? 'Create and manage your own events on our platform' 
                  : 'Join EventHub to discover amazing events'}
              </p>
            </div>
            
            <div className="bg-white rounded-b-lg shadow-lg p-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#183B4E] mb-2">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-[#183B4E]/50" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#183B4E] mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
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
                
                <div>
                  <label className="block text-sm font-medium text-[#183B4E] mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-[#183B4E]/50" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-[#27548A] focus:ring-[#DDA853] border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-[#183B4E]">
                    I agree to the <a href="#" className="text-[#27548A] hover:text-[#DDA853]">Terms of Service</a> and <a href="#" className="text-[#27548A] hover:text-[#DDA853]">Privacy Policy</a>
                  </label>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#27548A] text-[#F5EEDC] py-3 rounded-lg font-medium hover:bg-[#183B4E] transition-colors disabled:opacity-70"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-[#183B4E]/70">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-[#27548A] hover:text-[#DDA853]">
                    Sign in
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

export default Signup;