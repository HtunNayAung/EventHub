import { useEffect, useState, useRef } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { analyticsService, eventService } from '../services/api';

const COLORS = ['#27548A', '#DDA853'];

export default function AnalyticsTab({ organizerId }) {
  const [overview, setOverview] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [eventName, setEventName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventView, setIsEventView] = useState(false);

  const stompClient = useRef(null);
  const eventSubscription = useRef(null);

  useEffect(() => {
    if (!isEventView) {
      const fetchOverview = async () => {
        try {
          const res = await analyticsService.getOverview(organizerId);
          setOverview(res.data);
        } catch (err) {
          console.error('Error fetching overall overview:', err);
        }
      };
      fetchOverview();
    }
  }, [organizerId, isEventView]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (eventName.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await eventService.getEventByKeyword(eventName);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching event suggestions:', err);
        setSuggestions([]);
      }
    };
    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [eventName]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        if (!isEventView) {
          client.subscribe(`/topic/sales/${organizerId}`, (message) => {
            const newSale = JSON.parse(message.body);
            setSalesData(prev => updateSales(prev, newSale));
          });
          client.subscribe(`/topic/analytics/${organizerId}`, (message) => {
            setOverview(JSON.parse(message.body));
          });
        }
      },
    });
    stompClient.current = client;
    client.activate();
    return () => client.deactivate();
  }, [organizerId, isEventView]);

  const handleSuggestionClick = (event) => {
    setEventName(event.title);
    setSelectedEvent(event);
    setIsEventView(true);
    setSuggestions([]);
    handleGetStats(event.id);
  };

  const handleGetStats = async (id = null) => {
    const eventId = id || selectedEvent?.id;
    if (!eventId) {
      alert('Please select a valid event.');
      return;
    }

    try {
      const overviewRes = await analyticsService.getEventOverview(eventId);
      const salesRes = await analyticsService.getEventSales(eventId);

      setOverview(overviewRes.data);
      setSalesData(salesRes.data);

      if (eventSubscription.current) eventSubscription.current.unsubscribe();

      if (stompClient.current?.connected) {
        eventSubscription.current = stompClient.current.subscribe(
          `/topic/analytics/event/${eventId}`,
          (message) => setOverview(JSON.parse(message.body))
        );

        stompClient.current.subscribe(
          `/topic/sales/event/${eventId}`,
          (message) => {
            const newSale = JSON.parse(message.body);
            setSalesData(prev => updateSales(prev, newSale));
          }
        );
      }
    } catch (err) {
      console.error('Failed to fetch event analytics:', err);
    }
  };

  const updateSales = (prev, newSale) => {
    const index = prev.findIndex(entry => entry.date === newSale.date);
    if (index !== -1) {
      const updated = [...prev];
      updated[index] = newSale;
      return updated;
    }
    return [...prev, newSale];
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="relative flex flex-col md:flex-row gap-4 md:items-end justify-between">
        <div className="w-full relative">
          <input
            type="text"
            value={eventName}
            onChange={(e) => {
              setEventName(e.target.value);
              setSelectedEvent(null);
              setIsEventView(false);
            }}
            placeholder="Search event by name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:border-blue-500"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((event) => (
                <li
                  key={event.id}
                  onClick={() => handleSuggestionClick(event)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {event.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Revenue" value={`$${overview?.totalRevenue?.toFixed(2) || '0.00'}`} />
        <StatCard title="Tickets Sold" value={overview?.totalTickets || 0} />
        <StatCard title="Tickets Refunded" value={overview?.refundedTickets || 0} />
        <StatCard title="Total Events" value={overview?.totalEvents || 0} />
        <StatCard title="Upcoming Events" value={overview?.upcomingEvents || 0} />
        <StatCard title="Cancelled Events" value={overview?.cancelledEvents || 0} />
      </div>

      {salesData.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow h-[400px]">
            <h4 className="font-semibold text-lg mb-4">Ticket Sales Over Time</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="general" stroke={COLORS[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="vip" stroke={COLORS[1]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow h-[400px]">
            <h4 className="font-semibold text-lg mb-4">Revenue by Ticket Type</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overview?.revenueByType || []}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {overview?.revenueByType?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center text-center">
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  );
}