import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import { eventService } from '../services/api';
import Navbar from '../components/Navbar';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state to track if event is available based on date/status
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error on new fetch
        setIsAvailable(false); // Reset availability
        const response = await eventService.getEventById(id);
        const fetchedEvent = response.data;

        if (fetchedEvent) {
          // Check date and status
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Compare dates only
          const eventDate = new Date(fetchedEvent.eventDate);
          eventDate.setHours(0, 0, 0, 0);

          // Assuming the backend provides an 'eventStatus' field
          const isPublished = fetchedEvent.status === 'PUBLISHED'; 
          const isUpcoming = eventDate >= today;

          if (isPublished && isUpcoming) {
            setEvent(fetchedEvent);
            setIsAvailable(true);
          } else {
            // Event found but not available (past or not published)
            setError('This event is currently not available.'); 
          }
        } else {
          // Event not found by API
          setError('Event not found');
        }

      } catch (err) {
        console.error('Error fetching event details:', err);
        // Handle specific API errors if needed, otherwise generic message
        if (err.response && err.response.status === 404) {
            setError('Event not found');
        } else {
            setError('Failed to load event details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EEDC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#183B4E]">Loading event details...</h2>
        </div>
      </div>
    );
  }

  // Updated condition: Show error/unavailable message if loading is done AND
  // there's an error OR the event is not available
  if (!loading && (error || !isAvailable)) {
    return (
      <> {/* Added Fragment for Navbar */}
      <Navbar/>
      <div className="min-h-screen bg-[#F5EEDC] flex items-center justify-center">
        <div className="text-center">
          {/* Use the specific error message */}
          <h2 className="text-2xl font-bold text-[#183B4E]">{error || 'Event not available'}</h2>
          <p className="text-[#183B4E]/70 mt-2">
            {error === 'Event not found' 
              ? "The event you're looking for doesn't exist." 
              : "This event may have already passed or is not currently published."}
          </p>
          <button 
            onClick={() => navigate('/browse')} // Navigate to browse instead of back
            className="mt-4 px-4 py-2 bg-[#27548A] text-white rounded-lg hover:bg-[#183B4E] transition-colors"
          >
            Browse Events 
          </button>
        </div>
      </div>
      </>
    );
  }
  
  // If loading is done, no error, and event is available, render details
  // No need for isPastEvent check here anymore as it's handled above
  // const isPastEvent = new Date(event.eventDate) < new Date(); 
  
  // Format date and time (only if event is available and rendered)
  const eventDate = new Date(event.eventDate).toLocaleDateString();
  const formattedTime = `${event.startTime || '00:00'} - ${event.endTime || '00:00'}`;

  return (
    <>
    <Navbar/>
    <div className="bg-[#F5EEDC] min-h-screen py-12">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center mb-6 text-[#183B4E] hover:text-[#27548A] transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="relative h-[400px]">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-[#F5EEDC]">
              <div className="flex justify-between items-center">
                <span className="bg-[#F5EEDC] text-[#183B4E] px-4 py-1 rounded-full text-sm font-medium">
                  {event.eventType}
                </span>
                {/* Removed isPastEvent check here */}
              </div>
              <h1 className="text-4xl font-bold mt-4">{event.title}</h1>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <h2 className="text-2xl font-bold text-[#183B4E] mb-4">About This Event</h2>
                <p className="text-[#183B4E]/80 whitespace-pre-line mb-6">{event.description}</p>
                
                <h3 className="text-xl font-bold text-[#183B4E] mb-3">Event Details</h3>
                <div className="bg-[#F5EEDC]/50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-[#183B4E]/80">
                      <FaCalendar className="mr-3 text-[#27548A]" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div>{eventDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-[#183B4E]/80">
                      <FaClock className="mr-3 text-[#27548A]" />
                      <div>
                        <div className="font-medium">Time</div>
                        <div>{formattedTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-[#183B4E]/80">
                      <FaMapMarkerAlt className="mr-3 text-[#27548A]" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div>{event.location}</div>
                      </div>
                    </div>
                    {/* <div className="flex items-center text-[#183B4E]/80">
                      <FaTicketAlt className="mr-3 text-[#27548A]" />
                      <div>
                        <div className="font-medium">Organizer</div>
                        <div>{event.organizerName || 'Event Organizer'}</div>
                      </div>
                    </div> */}
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
                          {event.generalTicketsRemaining ? `${event.generalTicketsRemaining} tickets available` : 'Limited availability'}
                        </p>
                      </div>
                      <div className="text-xl font-bold text-[#183B4E]">
                        ${event.generalPrice ? event.generalPrice.toFixed(2) : '0.00'}
                      </div>
                    </div>
                  </div>
                  
                  {event.vipPrice > 0 && (
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-[#183B4E]">VIP Access</h4>
                          <p className="text-sm text-[#183B4E]/70">
                            {event.vipTicketsRemaining ? `${event.vipTicketsRemaining} tickets available` : 'Limited availability'}
                          </p>
                        </div>
                        <div className="text-xl font-bold text-[#183B4E]">
                          ${event.vipPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                
                <button className="w-full bg-[#27548A] text-[#F5EEDC] py-3 rounded-lg font-medium hover:bg-[#183B4E] transition-colors">
                  Register Now
                </button>
                 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventDetail;