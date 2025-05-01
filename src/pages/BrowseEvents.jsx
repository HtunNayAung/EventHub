// src/pages/BrowseEvents.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { eventService } from '../services/api';

const BrowseEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const stompClientRef = useRef(null);

  // Fetch only PUBLISHED events from the API
  const fetchPublished = async () => {
    setLoading(true);
    try {
      const response = await eventService.getAllEvents();
      const published = (response.data || []).filter(e => e.status === 'PUBLISHED');
      setEvents(published);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublished();

    // Setup WebSocket + STOMP
    const socket = new SockJS('http://localhost:8080/ws'); // backend endpoint
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/events/status', msg => {
        const updated = JSON.parse(msg.body);
        setEvents(prev => {
          // remove any existing with same id
          const without = prev.filter(e => e.id !== updated.id);
          // only keep if it's still PUBLISHED
          return updated.status === 'PUBLISHED'
            ? [...without, updated]
            : without;
        });
      });
    });
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  // Today’s date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter + sort
  const filtered = events
    .filter(e => {
      const d = new Date(e.eventDate);
      d.setHours(0,0,0,0);
      const matchesDate = d >= today;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        e.title?.toLowerCase().includes(term) ||
        e.description?.toLowerCase().includes(term);
      return matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.eventDate) - new Date(b.eventDate);
      }
      return (a.generalPrice || 0) - (b.generalPrice || 0);
    });

  const handleCardClick = id => navigate(`/events/${id}`);

  return (
    <div className="bg-[#F5EEDC] min-h-screen">
      <Navbar />

      {/* Search & Sort */}
      <div className="bg-gradient-to-r from-[#27548A] to-[#183B4E] py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#F5EEDC] mb-8 text-center">
            Browse Events
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-4 max-w-4xl mx-auto">
            {/* Search */}
            <div className="md:w-1/2 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#27548A]" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853] focus:ring-2 focus:ring-[#DDA853]/20 outline-none text-[#183B4E]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                className="appearance-none bg-[#F5EEDC] pl-4 pr-10 py-3 rounded-lg border-2 border-transparent focus:border-[#DDA853] focus:ring-2 focus:ring-[#DDA853]/20 outline-none text-[#183B4E] cursor-pointer"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27548A]" />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-[#183B4E]">Loading events…</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(evt => (
              <EventCard
                key={evt.id}
                event={{
                  id: evt.id,
                  title: evt.title,
                  shortDescription:
                    evt.description?.slice(0, 100) +
                    (evt.description?.length > 100 ? '…' : ''),
                  image: evt.imageUrl || '',
                  category: evt.eventType,
                  date: evt.eventDate,
                  time: `${evt.startTime || '—'} - ${evt.endTime || '—'}`,
                  location: evt.location,
                  price: evt.generalPrice || 0
                }}
                onClick={() => handleCardClick(evt.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-[#183B4E] mb-2">
              No Events Found
            </h3>
            <p className="text-[#183B4E]/70">
              Try adjusting your search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseEvents;
