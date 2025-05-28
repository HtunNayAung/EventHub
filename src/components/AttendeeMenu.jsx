import { 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaBell, 
  FaCog, 
  FaSignOutAlt,
  FaSearch 
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

const AttendeeMenu = ({ 
  activeTab, 
  setActiveTab, 
  user: initialUser, 
  handleLogout 
}) => {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    // Update user data when profile is updated
    const handleProfileUpdate = () => {
      setUser({
        name: localStorage.getItem('userName') || 'Attendee Name',
        email: localStorage.getItem('userEmail') || 'attendee@example.com'
      });
    };

    // Listen for profile updates
    window.addEventListener('userProfileUpdate', handleProfileUpdate);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('userProfileUpdate', handleProfileUpdate);
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">EventHub</h2>
      <p className="text-sm text-[#F5EEDC]/70 mb-6">Attendee Dashboard</p>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-[#DDA853] flex items-center justify-center text-[#183B4E] font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-[#F5EEDC]/70">{user.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="space-y-2">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'browse' ? 'bg-[#DDA853] text-[#183B4E]' : 'hover:bg-white/10'}`}
        >
          <FaSearch className="mr-3" />
          <span>Browse Events</span>
        </button>

        <button 
          onClick={() => setActiveTab('registrations')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'registrations' ? 'bg-[#DDA853] text-[#183B4E]' : 'hover:bg-white/10'}`}
        >
          <FaTicketAlt className="mr-3" />
          <span>My Registrations</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-[#DDA853] text-[#183B4E]' : 'hover:bg-white/10'}`}
        >
          <FaBell className="mr-3" />
          <span>Notifications</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#DDA853] text-[#183B4E]' : 'hover:bg-white/10'}`}
        >
          <FaCog className="mr-3" />
          <span>Settings</span>
        </button>
      </nav>
      
      <div className="absolute bottom-6 left-0 w-full px-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AttendeeMenu;