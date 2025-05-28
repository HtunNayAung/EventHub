import React, { useEffect, useState } from 'react';
import { registrationService } from '../../../services/api';

export default function MyTicketsAccordion({ userId }) {
  const [eventTickets, setEventTickets] = useState([]);
  const [openEventId, setOpenEventId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await registrationService.getAllTicketsForAttendee(userId);
        setEventTickets(response.data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      }
    };

    fetchTickets();
  }, [userId]);

  const toggleOpen = (eventId) => {
    setOpenEventId(prev => (prev === eventId ? null : eventId));
  };

  return (
    <div className="space-y-6 p-6">
      {eventTickets.map((event) => (
        <div key={event.eventId} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start p-5 cursor-pointer" onClick={() => toggleOpen(event.eventId)}>
            <div>
              <h3 className="text-xl font-bold text-[#183B4E] mb-1">{event.eventTitle}</h3>
              <p className="text-sm text-gray-600">
                📅 {new Date(event.eventDate).toLocaleDateString()} &nbsp;
                ⏰ {event.startTime} - {event.endTime}
              </p>
              <p className="text-sm text-gray-500">📍 {event.location}</p>
              <p className="text-sm text-[#27548A] mt-1 font-medium">
                🧾 {event.tickets.length} {event.tickets.length === 1 ? 'ticket' : 'tickets'} purchased
              </p>
            </div>
            <div className="text-2xl text-[#183B4E] hover:text-[#27548A] transition">
              {openEventId === event.eventId ? '−' : '+'}
            </div>
          </div>

          {openEventId === event.eventId && (
            <div className="px-5 pb-5">
              <ul className="space-y-2 mt-2">
                {event.tickets.map((ticket, index) => (
                  <li key={index} className="border border-[#DDA853] rounded-md p-3 bg-[#FFF8E1]">
                    <p className="text-sm text-gray-800">
                      🎫 <strong>{ticket.ticketType}</strong> Ticket — Code: <span className="font-mono">{ticket.ticketCode}</span>
                    </p>
                    <p className="text-sm text-gray-600">💰 Price: ${ticket.price.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
