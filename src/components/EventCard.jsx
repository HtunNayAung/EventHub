import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

const EventCard = ({ event, onClick }) => {
  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer hover:-translate-y-1 transition-all duration-300"
      onClick={onClick}
    >
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-[360px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F5EEDC]">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold">{event.title}</h3>
          <span className="bg-[#F5EEDC] text-[#183B4E] text-sm px-3 py-1 rounded-full font-medium select-none">
            {event.category}
          </span>
        </div>
        <p className="text-[#F5EEDC]/90 mb-4 line-clamp-2">{event.shortDescription}</p>
        <div className="flex items-center text-[#F5EEDC]/80 mb-2">
          <FaCalendar className="mr-2" />
          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
        </div>
        <div className="flex items-center text-[#F5EEDC]/80 mb-4">
          <FaMapMarkerAlt className="mr-2" />
          <span>{event.location}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[#F5EEDC]/20">
        <span className="text-lg font-bold">
          {event.price.toFixed(2) === "0.00" ? "Free" : `From $${event.price.toFixed(2)}`}
        </span>
          <button className="bg-[#F5EEDC] text-[#183B4E] px-4 py-2 rounded-lg font-medium hover:bg-[#DDA853] transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
