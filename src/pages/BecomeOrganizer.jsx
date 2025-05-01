import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaCalendarAlt, FaChartLine, FaTicketAlt, FaUsers, FaCreditCard, FaBullhorn } from 'react-icons/fa';

const BecomeOrganizer = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleGetStarted = () => {
    navigate('/signup/organizer');
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F5EEDC] min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#27548A] to-[#183B4E] text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Become an Event Organizer</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Create, manage, and grow your events with EventHub's powerful platform
            </p>
            <button 
              className={`bg-[#DDA853] hover:bg-[#C89745] text-[#183B4E] font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform ${isHovered ? 'scale-105' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleGetStarted}
            >
              Get Started Now
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#183B4E] mb-12">What You Can Do as an Organizer</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:transform hover:scale-105">
              <div className="text-[#27548A] text-4xl mb-4">
                <FaCalendarAlt />
              </div>
              <h3 className="text-xl font-bold text-[#183B4E] mb-3">Create & Manage Events</h3>
              <p className="text-gray-600">
                Easily create and manage multiple events with our intuitive dashboard. Set dates, locations, and customize event details.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:transform hover:scale-105">
              <div className="text-[#27548A] text-4xl mb-4">
                <FaTicketAlt />
              </div>
              <h3 className="text-xl font-bold text-[#183B4E] mb-3">Ticket Management</h3>
              <p className="text-gray-600">
                Create different ticket types with custom pricing. Control ticket availability and set limits for each category.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:transform hover:scale-105">
              <div className="text-[#27548A] text-4xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold text-[#183B4E] mb-3">Attendee Management</h3>
              <p className="text-gray-600">
                Track registrations, communicate with attendees, and manage check-ins for your events with ease.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:transform hover:scale-105">
              <div className="text-[#27548A] text-4xl mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-bold text-[#183B4E] mb-3">Analytics & Insights</h3>
              <p className="text-gray-600">
                Get detailed analytics on ticket sales, attendee demographics, and event performance to optimize future events.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:transform hover:scale-105">
              <div className="text-[#27548A] text-4xl mb-4">
                <FaCreditCard />
              </div>
              <h3 className="text-xl font-bold text-[#183B4E] mb-3">Payment Processing</h3>
              <p className="text-gray-600">
                Secure payment processing with multiple payment options. Track revenue and manage refunds all in one place.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:transform hover:scale-105">
              <div className="text-[#27548A] text-4xl mb-4">
                <FaBullhorn />
              </div>
              <h3 className="text-xl font-bold text-[#183B4E] mb-3">Marketing Tools</h3>
              <p className="text-gray-600">
                Promote your events with built-in marketing tools. Create custom landing pages and share on social media.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#183B4E] mb-6">Ready to Start Organizing?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of successful event organizers on EventHub and take your events to the next level.
          </p>
          <button 
            className="bg-[#27548A] hover:bg-[#183B4E] text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300"
            onClick={handleGetStarted}
          >
            Sign Up as an Organizer
          </button>
          <p className="mt-4 text-gray-600">
            Already have an account? <a href="/login" className="text-[#27548A] hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default BecomeOrganizer;