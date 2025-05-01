import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = ({ inDashboard = false }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // In a real app, you would check authentication status here
  useEffect(() => {
    // This is a mock implementation - replace with actual auth check
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);
  
  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <nav className="bg-[#183B4E] shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div 
            onClick={() => navigate('/')} 
            className="text-2xl font-bold text-[#F5EEDC] select-none cursor-pointer flex items-center"
          >
            <img 
              src="/EventHub_logo_white.png" 
              alt="EventHub Logo" 
              className="h-10"
            />
          </div>
          
          {inDashboard ? (
            // Simplified navbar (for dashboard, etc.)
            <button 
              onClick={handleLogout}
              className="text-[#F5EEDC] hover:text-[#DDA853] transition-colors select-none cursor-pointer"
            >
              Logout
            </button>
          ) : (
            // Full navbar for other pages
            <div className="space-x-6">
              <Link to="/events" className="text-[#F5EEDC] hover:text-[#DDA853] transition-colors select-none cursor-pointer inline-block">
                Browse Events
              </Link>
              <Link to="/become-organizer" className="text-[#F5EEDC] hover:text-[#DDA853] transition-colors select-none cursor-pointer inline-block">
                Become an Organizer
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="text-[#F5EEDC] hover:text-[#DDA853] transition-colors select-none cursor-pointer inline-block">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-[#F5EEDC] hover:text-[#DDA853] transition-colors select-none cursor-pointer inline-block"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-[#F5EEDC] hover:text-[#DDA853] transition-colors select-none cursor-pointer inline-block">
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-[#F5EEDC] text-[#183B4E] px-4 py-2 rounded-lg hover:bg-[#DDA853] transition-colors select-none cursor-pointer inline-block"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;