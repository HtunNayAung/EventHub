import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaPlus,
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle
} from 'react-icons/fa';
import EventForm from '../components/EventForm';
import OrganizerMenu from '../components/OrganizerMenu';
import EventCard from '../components/EventCard';
import { eventService } from '../services/api';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Settings from '../components/Settings';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  
  // Add this new state for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false); 
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelPassword, setCancelPassword] = useState('');
  const [cancelError, setCancelError] = useState('');


  // Sub-tabs for "My Events"
  const [eventsSubTab, setEventsSubTab] = useState('upcoming'); // 'upcoming', 'inprogress', 'completed', 'cancelled'

  const user = {
    name: localStorage.getItem('userName') || 'Organizer Name',
    email: localStorage.getItem('userEmail') || 'organizer@example.com'
  };

  useEffect(() => {
    // only wire up WebSocket when showing the events list
    if (activeTab === 'events' && !showCreateEvent && !showEventDetails) {
      // initial load
      fetchEvents();
  
      // create & configure STOMP over SockJS
      const client = new Client({
       // NEW: explicitly target your Spring Boot port
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        reconnectDelay: 5000,                       // try to reconnect every 5s
        debug: msg => console.debug('[STOMP]', msg)
      });
  
      // when connected, subscribe to your topics
      client.onConnect = () => {
        // In‐Progress updates
        client.subscribe('/topic/events/inprogress', msg => {
          const updated = JSON.parse(msg.body);
          setEvents(prev =>
            prev.map(e => {
              const u = updated.find(x => x.id === e.id);
              return u ? { ...e, status: u.status } : e;
            })
          );
        });
  
        // Completed updates
        client.subscribe('/topic/events/completed', msg => {
          const updated = JSON.parse(msg.body);
          setEvents(prev =>
            prev.map(e => {
              const u = updated.find(x => x.id === e.id);
              return u ? { ...e, status: u.status } : e;
            })
          );
        });
      };
  
      // activate the connection
      client.activate();
  
      // cleanup on unmount or when tabs change
      return () => {
        client.deactivate();
      };
    }
  }, [activeTab, showCreateEvent, showEventDetails]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await eventService.getEventsByOrganizer(userId);
      setEvents(response.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    ['isLoggedIn','userRole','userId','userEmail','userName']
      .forEach(key => localStorage.removeItem(key));
    navigate('/');
  };

  const handleEventCreated = newEvent => {
    setEvents(prev => [newEvent, ...prev]);
    setShowCreateEvent(false);
  };


  const handleEditEvent = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowEventDetails(true); // Show details view again when canceling edit
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === updatedEvent.id ? { ...updatedEvent } : event
      )
    );
    setIsEditing(false);
    setSelectedEvent(updatedEvent);
    setShowEventDetails(true);
  };
  

  const handleEventClick = event => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  const handleBackToEvents = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
    setEventsSubTab('upcoming');

    // Reset confirmation UI when leaving details view
    setShowCancelConfirm(false); 
    setCancelPassword('');
    setCancelError('');
    setIsCancelling(false);
  };

  const handleInitiateCancel = () => {
    setShowCancelConfirm(true);
    setCancelError(''); // Clear any previous errors
    setCancelPassword(''); // Clear password field
  };

  const handleConfirmCancel = async (eventId) => {
    if (isCancelling) return; 

    if (!cancelPassword) {
      setCancelError('Password is required.');
      return;
    }
    setCancelError(''); // Clear previous error
    setIsCancelling(true);

    try {
      await eventService.cancelEvent(eventId, cancelPassword); 

      // Update local state on success
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? { ...event, status: 'CANCELLED' } : event
        )
      );
      
      // Close detail view (which also resets state via handleBackToEvents)
      // Optionally add a success toast/notification here if you have a system for it
      handleBackToEvents(); 
      // alert('Event successfully cancelled.'); // Replaced alert

    } catch (err) {
      console.error('Error cancelling event:', err);
      const errorMessage = err.response?.data?.message || 'Failed to cancel event. Please check your password or try again later.';
      // Display error inline instead of alert
      setCancelError(errorMessage); 
      // alert(`Cancellation failed: ${errorMessage}`); // Replaced alert
    } finally {
      setIsCancelling(false);
      // Don't clear password on error, allow retry
    }
  };

  const handleAbortCancel = () => {
    setShowCancelConfirm(false);
    setCancelError('');
    setCancelPassword('');
    setIsCancelling(false); // Ensure cancelling state is reset
  };

  // Compute filtered lists
  const now = new Date();
  const upcomingEvents    = events.filter(e => {
    const start = new Date(`${e.eventDate}T${e.startTime}`);
    return start >= now && e.status !== 'CANCELLED';
  });
  const inProgressEvents  = events.filter(e => e.status === 'IN_PROGRESS');
  console.log(inProgressEvents.length);
  const completedEvents   = events.filter(e => e.status === 'COMPLETED');
  const cancelledEvents   = events.filter(e => e.status === 'CANCELLED');

  // Labels for sub-tabs
  const tabLabels = {
    upcoming:   'Upcoming',
    inprogress:'In Progress',
    completed:  'Completed',
    cancelled:  'Cancelled'
  };

  return (
    <div className="flex h-screen bg-[#F5EEDC]">
      {/* Sidebar toggle for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-[#27548A] text-white"
        >{sidebarOpen ? <FaTimes/> : <FaBars/>}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition duration-200 ease-in-out
        z-10 w-64 bg-gradient-to-b from-[#27548A] to-[#183B4E] text-white
      `}>
        <OrganizerMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowCreateEvent={setShowCreateEvent}
          user={user}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            {!showCreateEvent && !showEventDetails ? (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-[#183B4E]">
                  {activeTab === 'settings' ? 'Settings' : 'My Events'}
                </h1>
                {activeTab === 'events' && (
                  <button
                    onClick={() => setShowCreateEvent(true)}
                    className="flex items-center px-4 py-2 bg-[#27548A] text-white rounded-lg hover:bg-[#183B4E] transition-colors"
                  ><FaPlus className="mr-2"/> Create Event</button>
                )}
              </>
            ) : showEventDetails && !isEditing ? (
              <div className="flex items-center">
                <button
                  onClick={handleBackToEvents}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200"
                ><FaArrowLeft className="text-[#183B4E]"/></button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#183B4E]">
                  Event Details
                </h1>
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={isEditing ? handleCancelEdit : () => setShowCreateEvent(false)}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200"
                ><FaArrowLeft className="text-[#183B4E]"/></button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#183B4E]">
                  {isEditing ? 'Edit Event' : 'Create New Event'}
                </h1>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            {/* Create Event Form */}
            {activeTab === 'events' && showCreateEvent && (
              <EventForm 
                onEventCreated={handleEventCreated} 
                onCancel={() => setShowCreateEvent(false)} 
              />
            )}

            {/* Edit Event Form */}
            {activeTab === 'events' && isEditing && selectedEvent && (
              <EventForm 
                initialData={selectedEvent}
                isEditing={true}
                // onEventCreated={(updatedEvent) => {
                //   setEvents(prev => 
                //     prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
                //   );
                //   setIsEditing(false);
                //   setShowEventDetails(false);
                // }}
                onEventCreated={handleEventUpdated}
                onCancel={handleCancelEdit}
              />
            )}

            {/* Settings View */}
            {activeTab === 'settings' && <Settings />}

            {/* Details view */}
            {activeTab === 'events' && showEventDetails && selectedEvent && !isEditing && (
              <div>
                <div className="relative h-[300px] mb-6 rounded-lg overflow-hidden">
                  <img
                    src={selectedEvent.imageUrl || 'https://www.creativefabrica.com/wp-content/uploads/2022/01/01/event-organizer-letter-eo-logo-design-Graphics-22712239-1.jpg'}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F5EEDC]">
                    <div className="flex justify-between items-center">
                      <span className="bg-[#F5EEDC] text-[#183B4E] px-4 py-1 rounded-full text-sm font-medium">
                        {selectedEvent.eventType}
                      </span>
                      {new Date(selectedEvent.eventDate) < new Date() && (
                        <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {selectedEvent.status || 'Completed'}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mt-2">
                      {selectedEvent.title}
                    </h1>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  <div className="md:col-span-3">
                    <h2 className="text-xl font-bold text-[#183B4E] mb-4">About This Event</h2>
                    <p className="text-[#183B4E]/80 whitespace-pre-line mb-6">
                      {selectedEvent.description}
                    </p>

                    <h3 className="text-lg font-bold text-[#183B4E] mb-3">Event Details</h3>
                    <div className="bg-[#F5EEDC]/50 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-[#183B4E]/80">
                          <FaCalendarAlt className="mr-3 text-[#27548A]" />
                          <div>
                            <div className="font-medium">Date</div>
                            <div>{new Date(selectedEvent.eventDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-[#183B4E]/80">
                          <FaClock className="mr-3 text-[#27548A]" />
                          <div>
                            <div className="font-medium">Time</div>
                            <div>
                              {`${selectedEvent.startTime || '00:00'} - ${selectedEvent.endTime || '00:00'}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-[#183B4E]/80">
                          <FaMapMarkerAlt className="mr-3 text-[#27548A]" />
                          <div>
                            <div className="font-medium">Location</div>
                            <div>{selectedEvent.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-[#183B4E]/80">
                          <FaInfoCircle className="mr-3 text-[#27548A]" />
                          <div>
                            <div className="font-medium">Status / Updated</div>
                            <div>
                              {selectedEvent.status}
                              {selectedEvent.lastUpdatedAt && (
                                <span className="text-xs block text-[#183B4E]/60">
                                  (Updated: {new Date(selectedEvent.lastUpdatedAt).toLocaleString()})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F5EEDC] p-6 rounded-lg md:col-span-2">
                    <h3 className="text-xl font-bold text-[#183B4E] mb-4">Ticket Information</h3>
                    <div className="space-y-4 mb-6">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-[#183B4E]">General Admission</h4>
                            <p className="text-sm text-[#183B4E]/70">
                              {selectedEvent.generalTicketLimit
                                ? `${selectedEvent.generalTicketLimit} tickets available`
                                : 'Limited availability'}
                            </p>
                          </div>
                          <div className="text-xl font-bold text-[#183B4E]">
                            ${selectedEvent.generalPrice?.toFixed(2) ?? '0.00'}
                          </div>
                        </div>
                      </div>

                      {selectedEvent.vipPrice > 0 && (
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-[#183B4E]">VIP Access</h4>
                              <p className="text-sm text-[#183B4E]/70">
                                {selectedEvent.vipTicketLimit
                                  ? `${selectedEvent.vipTicketLimit} tickets available`
                                  : 'Limited availability'}
                              </p>
                            </div>
                            <div className="text-xl font-bold text-[#183B4E]">
                              ${selectedEvent.vipPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons and cancel UI here */}
                    {(() => {
                      const isCompleted = selectedEvent.status === 'COMPLETED';
                      const isCancelled = selectedEvent.status === 'CANCELLED';
                      // Build today midnight for past-check
                      const today = new Date(); today.setHours(0,0,0,0);
                      const evtDate = new Date(selectedEvent.eventDate); evtDate.setHours(0,0,0,0);
                      const isPast = evtDate < today;
                      const isEditableOrCancellable = !(isCompleted || isCancelled || isPast);

                      return (
                        <>
                          <div className="flex space-x-3">
                            {isEditableOrCancellable && (
                              <button
                                onClick={handleEditEvent}
                                className="flex-1 bg-[#27548A] text-[#F5EEDC] py-2 rounded-lg font-medium hover:bg-[#183B4E] transition-colors"
                              >
                                Edit Event
                              </button>
                            )}
                            <button
                              className="flex-1 border border-[#27548A] text-[#27548A] py-2 rounded-lg font-medium hover:bg-[#27548A]/10 transition-colors"
                            >
                              View Attendees
                            </button>
                          </div>

                          {isEditableOrCancellable && !showCancelConfirm && (
                            <button
                              onClick={handleInitiateCancel}
                              className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                              Cancel Event
                            </button>
                          )}

                          {isEditableOrCancellable && showCancelConfirm && (
                            <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg">
                              <p className="text-sm font-medium text-red-800 mb-2">
                                Enter your password to confirm cancellation:
                              </p>
                              <input
                                type="password"
                                value={cancelPassword}
                                onChange={e => { setCancelPassword(e.target.value); setCancelError(''); }}
                                placeholder="Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                                disabled={isCancelling}
                              />
                              {cancelError && (
                                <p className="text-xs text-red-600 mt-1">{cancelError}</p>
                              )}
                              <div className="flex space-x-2 mt-3">
                                <button
                                  onClick={() => handleConfirmCancel(selectedEvent.id)}
                                  disabled={isCancelling || !cancelPassword}
                                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isCancelling || !cancelPassword
                                      ? 'bg-red-300 text-red-700 cursor-not-allowed'
                                      : 'bg-red-600 text-white hover:bg-red-700'
                                  }`}
                                >
                                  {isCancelling ? 'Confirming...' : 'Confirm Cancel'}
                                </button>
                                <button
                                  onClick={handleAbortCancel}
                                  disabled={isCancelling}
                                  className="flex-1 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                  Abort
                                </button>
                              </div>
                            </div>
                          )}

                          {!isEditableOrCancellable && isCompleted && (
                            <div className="mt-3 text-center text-green-600 font-medium bg-gray-200 py-2 rounded-lg">
                              Event Completed
                            </div>
                          )}

                          {!isEditableOrCancellable && isCancelled && (
                            <div className="mt-3 text-center text-red-600 font-medium bg-gray-200 py-2 rounded-lg">
                              Event Cancelled
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Create form view */}
            {/* {activeTab==='events' && showCreateEvent && !showEventDetails && (
              <EventForm onCancel={()=>setShowCreateEvent(false)} onSuccess={handleEventCreated}/>
            )} */}

            {/* List view with sub-tabs */}
            {activeTab==='events' && !showCreateEvent && !showEventDetails && (
              <>  
                {/* Sub-tab nav */}
                <div className="mb-6 flex space-x-4">
                  {Object.entries(tabLabels).map(([key,label]) => (
                    <button
                      key={key}
                      onClick={()=>setEventsSubTab(key)}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors
                        ${eventsSubTab===key
                          ? 'bg-[#27548A] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >{label}</button>
                  ))}
                </div>

                {/* Conditionals for each sub-tab */}
                {isLoading && <p className="text-gray-500 text-center py-10">Loading events…</p>}

                {!isLoading && eventsSubTab==='upcoming' && (
                  <EventGrid events={upcomingEvents} onClick={handleEventClick} />
                )}
                {!isLoading && eventsSubTab==='inprogress' && (
                  <EventGrid events={inProgressEvents} onClick={handleEventClick} />
                )}
                {!isLoading && eventsSubTab==='completed' && (
                  <EventGrid events={completedEvents} onClick={handleEventClick} />
                )}
                {!isLoading && eventsSubTab==='cancelled' && (
                  <EventGrid events={cancelledEvents} onClick={handleEventClick} />
                )}
              </>
            )}

            {/* Placeholder for other tabs (attendees, analytics, settings) */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;


// Helper component for displaying a grid of EventCards
const EventGrid = ({ events, onClick }) => (
  events.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(evt => (
        <div key={evt.id} className="relative">
            <EventCard
                key={evt.id}
                event={{
                id: evt.id,
                title: evt.title,
                shortDescription: evt.shortDescription,
                image: evt.imageUrl || '',
                category: evt.eventType,
                date: evt.eventDate,
                time: `${evt.startTime || '00:00'} - ${evt.endTime || '00:00'}`,
                location: evt.location,
                price: evt.generalPrice || 0
                }}
                onClick={() => onClick(evt)}
            />
            
            <span className="absolute top-0 right-0 m-2 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                {evt.status}
                </span>
            <div className="absolute inset-0 bg-gray-500 opacity-10 rounded-lg pointer-events-none" />
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No {events.length === 0 && 'events'} found.</p>
  )
);


