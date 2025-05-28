import { 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

const OrganizerMenu = ({ 
  activeTab, 
  setActiveTab, 
  setShowCreateEvent, 
  user: initialUser, 
  handleLogout 
}) => {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    // Update user data when profile is updated
    const handleProfileUpdate = () => {
      setUser({
        name: localStorage.getItem('userName') || 'Organizer Name',
        email: localStorage.getItem('userEmail') || 'organizer@example.com'
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
      <p className="text-sm text-[#F5EEDC]/70 mb-6">Organizer Dashboard</p>
      
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
          onClick={() => {setActiveTab('events'); setShowCreateEvent(false);}}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-[#DDA853] text-[#183B4E]' : 'hover:bg-white/10'}`}
        >
          <FaCalendarAlt className="mr-3" />
          <span>My Events</span>
        </button>

        
        <button 
          onClick={() => {setActiveTab('analytics'); setShowCreateEvent(false);}}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-[#DDA853] text-[#183B4E]' : 'hover:bg-white/10'}`}
        >
          <FaChartLine className="mr-3" />
          <span>Analytics</span>
        </button>
        
        <button 
          onClick={() => {setActiveTab('settings'); setShowCreateEvent(false);}}
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

export default OrganizerMenu;