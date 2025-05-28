import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCalendarAlt
} from 'react-icons/fa';
import AttendeeMenu from '../components/AttendeeMenu';
import EventCard from '../components/EventCard';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Settings from '../components/Settings';
import MyRegistrationsPage from './MyRegistrationsPage';

const AttendeeDashboard = () => {
  const navigate = useNavigate();
  const selectedEventRef = useRef(null);
  const [activeTab, setActiveTab] = useState('registrations');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Add these new state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allEvents, setAllEvents] = useState([]);
  const [sortBy, setSortBy] = useState('date-asc'); // Add this state

  // Add this new effect for fetching all events
  useEffect(() => {
    if (activeTab === 'browse') {
      fetchAllEvents();
    }
  }, [activeTab]);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/events');
      const data = await response.json();
      setAllEvents(data || []);
    } catch (err) {
      console.error('Error fetching all events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this computed value for filtered events
  // Modify the filtered events computation to include sorting
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.eventType === selectedCategory;
    const matchesStatus = event.status === 'PUBLISHED' || event.status === 'IN_PROGRESS';
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(`${a.eventDate}T${a.startTime}`) - new Date(`${b.eventDate}T${b.startTime}`);
      case 'date-desc':
        return new Date(`${b.eventDate}T${b.startTime}`) - new Date(`${a.eventDate}T${a.startTime}`);
      case 'price-asc':
        return (a.generalPrice || 0) - (b.generalPrice || 0);
      case 'price-desc':
        return (b.generalPrice || 0) - (a.generalPrice || 0);
      default:
        return 0;
    }
  });

  const user = {
    id: localStorage.getItem('userId') || 'undefined',
    name: localStorage.getItem('userName') || 'Attendee Name',
    email: localStorage.getItem('userEmail') || 'attendee@example.com'
  };
  // useEffect(() => {
  //   // only wire up WebSocket when showing the events list
  //   if (activeTab === 'events' && !showEventDetails) {
  //     // initial load
  //     fetchEvents();
  
  //     // create & configure STOMP over SockJS
  //     const client = new Client({
  //       webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  //       reconnectDelay: 5000,
  //       debug: msg => console.debug('[STOMP]', msg)
  //     });
  
  //     client.onConnect = () => {
  //       // New or updated PUBLISHED events
  //       client.subscribe('/topic/events/published', msg => {
  //         const updated = JSON.parse(msg.body);
  //         setAllEvents(prev => {
  //           const map = new Map(prev.map(e => [e.id, e]));
  //           updated.forEach(e => map.set(e.id, e)); // update or add
  //           return Array.from(map.values());
  //         });
  //       });
      
  //       // Status changed to IN_PROGRESS
  //       client.subscribe('/topic/events/inprogress', msg => {
  //         const updated = JSON.parse(msg.body);
  //         setAllEvents(prev =>
  //           prev.map(e => {
  //             const u = updated.find(x => x.id === e.id);
  //             return u ? { ...e, status: u.status } : e;
  //           })
  //         );
  //       });
  //     };
      
  
  //     // activate the connection
  //     client.activate();
  
  //     // cleanup on unmount or when tabs change
  //     return () => {
  //       client.deactivate();
  //     };
  //   }
  // }, [activeTab, showEventDetails]);

  useEffect(() => {
    selectedEventRef.current = selectedEvent;
  }, [selectedEvent]);
  
  const handleSocketUpdate = (updated) => {
    setAllEvents(prev => {
      const map = new Map(prev.map(e => [e.id, e]));
      updated.forEach(e => map.set(e.id, e));
      return Array.from(map.values());
    });
  
    const currentSelected = selectedEventRef.current;
    if (currentSelected) {
      const found = updated.find(e => e.id === currentSelected.id);
      if (found) {
        setSelectedEvent(found);
      }
    }
  };
  useEffect(() => {
    // create & configure STOMP over SockJS
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: msg => console.debug('[STOMP]', msg)
    });
  
    client.onConnect = () => {
      // PUBLISHED updates
      client.subscribe('/topic/events/published', msg => {
        const updated = JSON.parse(msg.body);
        // setAllEvents(prev => {
        //   const map = new Map(prev.map(e => [e.id, e]));
        //   updated.forEach(e => map.set(e.id, e));
        //   return Array.from(map.values());
        // });
        handleSocketUpdate(updated);
      });
  
      // IN_PROGRESS updates
      client.subscribe('/topic/events/inprogress', msg => {
        const updated = JSON.parse(msg.body);
        // setAllEvents(prev => {
        //   const map = new Map(prev.map(e => [e.id, e]));
        //   updated.forEach(e => map.set(e.id, e)); // replace full event object
        //   return Array.from(map.values());
        // });
        handleSocketUpdate(updated);
      });
      
    };
  
    client.activate();
  
    return () => {
      client.deactivate();
    };
  }, []); 
  
  const handleLogout = () => {
    ['isLoggedIn','userRole','userId','userEmail','userName']
      .forEach(key => localStorage.removeItem(key));
    navigate('/');
  };

  const handleEventClick = event => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleBackToEvents = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex h-screen bg-[#F5EEDC]">
      {/* Sidebar toggle for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-[#27548A] text-white"
        >
          {sidebarOpen ? <FaTimes/> : <FaBars/>}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition duration-200 ease-in-out
        z-10 w-64 bg-gradient-to-b from-[#27548A] to-[#183B4E] text-white
      `}>
        <AttendeeMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            {!showEventDetails ? (
              <h1 className="text-2xl md:text-3xl font-bold text-[#183B4E]">
                {activeTab === 'settings' ? 'Settings' : 
                 activeTab === 'notifications' ? 'Notifications' :
                 activeTab === 'registrations' ? 'My Registrations' : 
                 activeTab === 'browse'? 'Browse Events' :'My Events'
                 }
              </h1>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={handleBackToEvents}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200"
                >
                  <FaArrowLeft className="text-[#183B4E]"/>
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#183B4E]">
                  Event Details
                </h1>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Browse Events View */}
            {activeTab === 'browse' && (
              <>
                {!showEventDetails ? (
                  <>
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <input
                          type="text"
                          placeholder="Search events..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                        />
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-4 py-2 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                        >
                          <option value="all">All Categories</option>
                          <option value="CONFERENCE">Conference</option>
                          <option value="WORKSHOP">Workshop</option>
                          <option value="SEMINAR">Seminar</option>
                          <option value="NETWORKING">Networking</option>
                        </select>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-4 py-2 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                        >
                          <option value="date-asc">Date (Nearest First)</option>
                          <option value="date-desc">Date (Furthest First)</option>
                          <option value="price-asc">Price (Low to High)</option>
                          <option value="price-desc">Price (High to Low)</option>
                        </select>
                      </div>
                    </div>
                    
                    {filteredEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                          <EventCard
                            key={event.id}
                            event={{
                              id: event.id,
                              title: event.title,
                              shortDescription: event.shortDescription,
                              image: event.imageUrl,
                              category: event.eventType,
                              date: event.eventDate,
                              time: `${event.startTime} - ${event.endTime}`,
                              location: event.location,
                              price: event.generalPrice
                            }}
                            onClick={() => handleEventClick(event)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-[#183B4E]/70 text-lg">No events found</p>
                        <p className="text-[#183B4E]/50 mt-2">Try adjusting your search or filter criteria</p>
                      </div>
                    )}
                  </>
                ) : (
                  <EventDetailsView event={selectedEvent} isBrowseMode={true} userId={user.id}/>
                )}
              </>
            )}

            {/* Settings View */}
            {activeTab === 'settings' && <Settings />}

            {/* Notifications View */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <p className="text-gray-500 text-center">No new notifications</p>
              </div>
            )}

            {/* Tickets View */}
            {activeTab === 'registrations' && (
              <MyRegistrationsPage/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;

import RegistrationForm from '../components/RegistrationForm';
const EventDetailsView = ({ event, isBrowseMode = false, userId}) => {
  console.log("EventDetailsView: event =", event);
  const [showRegistration, setShowRegistration] = useState(false);
  if (showRegistration) {
    return <RegistrationForm event={event} onBack={() => setShowRegistration(false)} userId={userId}/>;
  }
  return (
  <div>
    <div className="relative h-[300px] mb-6 rounded-lg overflow-hidden">
      <img
        src={event.imageUrl || 'https://www.creativefabrica.com/wp-content/uploads/2022/01/01/event-organizer-letter-eo-logo-design-Graphics-22712239-1.jpg'}
        alt={event.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F5EEDC]">
        <div className="flex justify-between items-center">
          <span className="bg-[#F5EEDC] text-[#183B4E] px-4 py-1 rounded-full text-sm font-medium">
            {event.eventType}
          </span>
          <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.status}
          </span>
        </div>
        <h1 className="text-3xl font-bold mt-2">
          {event.title}
        </h1>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      <div className="md:col-span-3">
        <h2 className="text-xl font-bold text-[#183B4E] mb-4">About This Event</h2>
        <p className="text-[#183B4E]/80 whitespace-pre-line mb-6">
          {event.description}
        </p>

        <h3 className="text-lg font-bold text-[#183B4E] mb-3">Event Details</h3>
        <div className="bg-[#F5EEDC]/50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-[#183B4E]/80">
              <FaCalendarAlt className="mr-3 text-[#27548A]" />
              <div>
                <div className="font-medium">Date</div>
                <div>{new Date(event.eventDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center text-[#183B4E]/80">
              <FaClock className="mr-3 text-[#27548A]" />
              <div>
                <div className="font-medium">Time</div>
                <div>
                  {`${event.startTime || '00:00'} - ${event.endTime || '00:00'}`}
                </div>
              </div>
            </div>
            <div className="flex items-center text-[#183B4E]/80">
              <FaMapMarkerAlt className="mr-3 text-[#27548A]" />
              <div>
                <div className="font-medium">Location</div>
                <div>{event.location}</div>
              </div>
            </div>
            <div className="flex items-center text-[#183B4E]/80">
              <FaInfoCircle className="mr-3 text-[#27548A]" />
              <div>
                <div className="font-medium">Status / Updated</div>
                <div>
                  {event.status === "IN_PROGRESS" ? "Event STARTED" : "Event Published"}
                  {event.lastUpdatedAt && (
                    <span className="text-xs block text-[#183B4E]/60">
                      (Updated: {new Date(event.lastUpdatedAt).toLocaleString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F5EEDC] p-6 rounded-lg md:col-span-2">
        <h3 className="text-xl font-bold text-[#183B4E] mb-4">
          {isBrowseMode ? 'Ticket Information' : 'Your Ticket'}
        </h3>
        <div className="space-y-4 mb-6">
          {/* General Admission Ticket */}
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-[#183B4E]">General Admission</h4>
                {isBrowseMode ? (
                  <p className="text-sm text-[#183B4E]/70">
                    {event.generalTicketsRemaining
                      ? `${event.generalTicketsRemaining} tickets available`
                      : 'Limited availability'}
                  </p>
                ) : (
                  <p className="text-sm text-[#183B4E]/70">
                    Ticket #{event.ticketId || 'N/A'}
                  </p>
                )}
              </div>
              <div className="text-xl font-bold text-[#183B4E]">
                ${event.generalPrice?.toFixed(2) ?? '0.00'}
              </div>
            </div>
          </div>

          {/* VIP Ticket - Only show if VIP price exists and in browse mode */}
          {isBrowseMode && event.vipPrice > 0 && (
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#183B4E]">VIP Access</h4>
                  <p className="text-sm text-[#183B4E]/70">
                    {event.vipTicketsRemaining
                      ? `${event.vipTicketsRemaining  } tickets available`
                      : 'Limited availability'}
                  </p>
                </div>
                <div className="text-xl font-bold text-[#183B4E]">
                  ${event.vipPrice.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        {isBrowseMode && (
              <button 
                className="mt-4 w-full bg-[#27548A] text-white py-2 px-4 rounded-lg hover:bg-[#183B4E] transition-colors"
                onClick={() => setShowRegistration(true)}
              >
                Register Now
              </button>
            )}
      </div>
      
    </div>
    
  </div>
  );
};
