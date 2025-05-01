import { useState } from 'react';
import { FaTicketAlt, FaCalendar, FaUser, FaChartLine, FaInbox, FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import { mockEvents } from '../data/mockEvents';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

const AttendeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeInboxTab, setActiveInboxTab] = useState('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Use first 3 mockEvents for demonstration
  const userEvents = mockEvents.slice(0, 3);
  
  // Mock notifications and messages
  const mockNotifications = [
    { id: 1, type: 'event', title: 'Event Reminder', message: 'Tech Conference 2024 is tomorrow!', date: '2024-06-14', read: false },
    { id: 2, type: 'ticket', title: 'Ticket Confirmed', message: 'Your ticket for Music Festival has been confirmed', date: '2024-06-10', read: true },
    { id: 3, type: 'system', title: 'Welcome to EventHub', message: 'Thank you for joining our platform', date: '2024-06-01', read: true }
  ];
  
  const mockMessages = [
    { id: 1, sender: 'Tech Conference Team', subject: 'Important Information', message: 'Here are the details for your upcoming event participation', date: '2024-06-12', read: false },
    { id: 2, sender: 'EventHub Support', subject: 'Your Recent Inquiry', message: 'Thank you for contacting us. We have processed your request.', date: '2024-06-08', read: true }
  ];

  // Filter events for browse tab
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <>
      <Navbar inDashboard={true}/>
    
      <div className="bg-[#F5EEDC] min-h-screen py-12">
        
        <div className="container mx-auto px-6">

          <div className="flex">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white rounded-lg shadow-lg overflow-hidden mr-6 h-fit">
              <div className="p-4 bg-[#27548A] text-[#F5EEDC]">
                <h2 className="font-bold text-xl">John Doe</h2>
                <p className="text-sm opacity-80">john.doe@example.com</p>
              </div>
              <div className="flex flex-col">
                <button
                  className={`flex items-center px-6 py-4 text-left ${
                    activeTab === 'overview' ? 'bg-[#F5EEDC] text-[#27548A] font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <FaChartLine className="mr-3" />
                  Overview
                </button>
                <button
                  className={`flex items-center px-6 py-4 text-left ${
                    activeTab === 'browse' ? 'bg-[#F5EEDC] text-[#27548A] font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('browse')}
                >
                  <FaSearch className="mr-3" />
                  Browse Events
                </button>
                <button
                  className={`flex items-center px-6 py-4 text-left ${
                    activeTab === 'tickets' ? 'bg-[#F5EEDC] text-[#27548A] font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('tickets')}
                >
                  <FaTicketAlt className="mr-3" />
                  My Tickets
                </button>
                <button
                  className={`flex items-center px-6 py-4 text-left ${
                    activeTab === 'events' ? 'bg-[#F5EEDC] text-[#27548A] font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('events')}
                >
                  <FaCalendar className="mr-3" />
                  Registered Events
                </button>
                <button
                  className={`flex items-center px-6 py-4 text-left ${
                    activeTab === 'inbox' ? 'bg-[#F5EEDC] text-[#27548A] font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('inbox')}
                >
                  <FaInbox className="mr-3" />
                  Inbox
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </button>
                <button
                  className={`flex items-center px-6 py-4 text-left ${
                    activeTab === 'profile' ? 'bg-[#F5EEDC] text-[#27548A] font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="mr-3" />
                  Profile
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Existing tabs content */}
              
              {/* New Browse Events Tab */}
              {activeTab === 'browse' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#183B4E] mb-6">Browse Events</h2>
                  
                  {/* Search and Filter */}
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-2/3 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#27548A]" />
                        <input
                          type="text"
                          placeholder="Search events..."
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="md:w-1/3">
                        <select
                          className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="All">All Categories</option>
                          <option value="Conference">Conference</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Concert">Concert</option>
                          <option value="Festival">Festival</option>
                          <option value="Networking">Networking</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Events Grid */}
                  {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredEvents.map(event => (
                        <div key={event.id} className="bg-[#F5EEDC] rounded-lg overflow-hidden shadow-md">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-[#183B4E] text-lg">{event.title}</h3>
                              <span className="bg-[#27548A]/10 text-[#27548A] text-xs px-2 py-1 rounded-full">
                                {event.category}
                              </span>
                            </div>
                            <p className="text-sm text-[#183B4E]/70 mb-3">{event.shortDescription}</p>
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-[#183B4E]/70">
                                <div>{new Date(event.date).toLocaleDateString()}</div>
                                <div>{event.location}</div>
                              </div>
                              <button className="bg-[#27548A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#183B4E]">
                                Register
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaSearch className="mx-auto text-5xl text-[#27548A]/30 mb-4" />
                      <h3 className="text-xl font-medium text-[#183B4E] mb-2">No events found</h3>
                      <p className="text-[#183B4E]/70">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              )}

              {/* Other existing tabs */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendeeDashboard;
