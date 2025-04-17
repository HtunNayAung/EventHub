import { useParams } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { mockEvents } from '../data/mockEvents';

const EventDetail = () => {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === parseInt(id));

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F5EEDC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#183B4E]">Event not found</h2>
          <p className="text-[#183B4E]/70 mt-2">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EEDC] min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="relative h-[400px]">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-[#F5EEDC]">
              <span className="bg-[#F5EEDC] text-[#183B4E] px-4 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold mt-4">{event.title}</h1>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <h2 className="text-2xl font-bold text-[#183B4E] mb-4">About This Event</h2>
                <p className="text-[#183B4E]/80 whitespace-pre-line">{event.description}</p>
              </div>
              
              <div className="bg-[#F5EEDC] p-6 rounded-lg md:col-span-2">
                <div className="text-2xl font-bold text-[#183B4E] mb-4">${event.price.toFixed(2)}</div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-[#183B4E]/80">
                    <FaCalendar className="mr-3" />
                    <div>
                      <div className="font-medium">Date & Time</div>
                      <div>{new Date(event.date).toLocaleDateString()} at {event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-[#183B4E]/80">
                    <FaMapMarkerAlt className="mr-3" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div>{event.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-[#183B4E]/80">
                    <FaTicketAlt className="mr-3" />
                    <div>
                      <div className="font-medium">Availability</div>
                      <div>Limited seats available</div>
                    </div>
                  </div>
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
  );
};

export default EventDetail;