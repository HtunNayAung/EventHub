import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { userService } from '../services/api';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: localStorage.getItem('userName')?.split(' ')[0] || '',
    lastName: localStorage.getItem('userName')?.split(' ')[1] || '',
    email: localStorage.getItem('userEmail') || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      
      if (activeSection === 'profile') {
        // Handle profile update
        const profileData = {
          firstName: formData.firstName,
          lastName: formData.lastName
        };
        
        const response = await userService.updateProfile(userId, profileData);
        
        // Update localStorage with new name
        const newName = `${response.data.firstName} ${response.data.lastName}`;
        localStorage.setItem('userName', newName);
        
        // Force a re-render of the entire app by dispatching a custom event
        window.dispatchEvent(new Event('userProfileUpdate'));
        
        setSuccess('Profile updated successfully');
      } else {
        // Handle password update
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
        
        const passwordData = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };
        
        try {
          await userService.updatePassword(userId, passwordData);
          
          // Reset password fields
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
          
          setSuccess('Password updated successfully');
        } catch (err) {
          if (err.response?.status === 400 || err.response?.status === 401) {
            setError('Current password is incorrect');
          } else {
            setError('Failed to update password');
          }
          return;
        }
      }
    } catch (err) {
      console.error('Settings update error:', err);
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#183B4E] mb-6">Settings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {/* Settings Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 px-4 ${
            activeSection === 'profile'
              ? 'border-b-2 border-[#27548A] text-[#27548A] font-medium'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('profile')}
        >
          Profile
        </button>
        <button
          className={`pb-2 px-4 ${
            activeSection === 'security'
              ? 'border-b-2 border-[#27548A] text-[#27548A] font-medium'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('security')}
        >
          Security
        </button>
      </div>

      {/* Profile Settings */}
      {activeSection === 'profile' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#183B4E] mb-2">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-[#183B4E]/50" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#183B4E] mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#183B4E] mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-[#183B4E]/50" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border-2 border-transparent text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#27548A] text-[#F5EEDC] py-3 rounded-lg font-medium hover:bg-[#183B4E] transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Security Settings */}
      {activeSection === 'security' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#183B4E] mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#183B4E]/50" />
              </div>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#183B4E] mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#183B4E]/50" />
              </div>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#183B4E] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#183B4E]/50" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#27548A] text-[#F5EEDC] py-3 rounded-lg font-medium hover:bg-[#183B4E] transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;