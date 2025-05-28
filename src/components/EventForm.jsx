import { useState, useEffect } from 'react'; // Import useEffect
import {
  FaImage,
  FaMapMarkerAlt,
  FaCalendarDay,
  FaClock,
  FaDollarSign,
  FaUsers
} from 'react-icons/fa';
import { eventService } from '../services/api';

const EventForm = ({ onEventCreated, onCancel, initialData, isEditing }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasVipTickets, setHasVipTickets] = useState(initialData?.vipTicketLimit > 0 || false);

  // Event form state - initialize with initialData if provided
  const [eventForm, setEventForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || '',
    location: initialData?.location || '',
    date: initialData?.eventDate?.split('T')[0] || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    generalTicketPrice: initialData?.generalPrice?.toString() || '',
    vipTicketPrice: initialData?.vipPrice?.toString() || '', 
    generalTicketCapacity: initialData?.generalTicketLimit?.toString() || '',
    vipTicketCapacity: initialData?.vipTicketLimit?.toString() || '', 
    category: initialData?.eventType || '',
    imageUrl: initialData?.imageUrl || ''
  });

  // Get today's date in YYYY-MM-DD format for the min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEventFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setHasVipTickets(checked);
      // Reset VIP fields if checkbox is unchecked
      if (!checked) {
        setEventForm(prev => ({
          ...prev,
          vipTicketPrice: '',
          vipTicketCapacity: ''
        }));
      }
    } else {
      setEventForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
     // Clear error when user starts typing
     if (error) setError('');
  };

  const validateForm = () => {
    // Basic required fields check (HTML5 required attribute handles most)
    if (!eventForm.title || !eventForm.shortDescription || !eventForm.description ||
        !eventForm.location || !eventForm.date || !eventForm.startTime || !eventForm.endTime ||
        !eventForm.category) {
       setError('Please fill in all required fields.');
       return false;
    }

    // Date check (redundant if min attribute works, but good fallback)
    const today = getTodayDate();
    if (eventForm.date < today) {
      setError('Event date cannot be in the past.');
      return false;
    }

    // General Ticket Price/Capacity Validation
    const generalPrice = parseFloat(eventForm.generalTicketPrice);
    const generalCapacity = parseInt(eventForm.generalTicketCapacity);
    if (isNaN(generalPrice) || generalPrice <= 0) {
        setError('General ticket price must be greater than zero.');
        return false;
    }
     if (isNaN(generalCapacity) || generalCapacity <= 0) {
        setError('General ticket capacity must be greater than zero.');
        return false;
    }

    // VIP Ticket Price/Capacity Validation (only if enabled)
    if (hasVipTickets) {
        const vipPrice = parseFloat(eventForm.vipTicketPrice);
        const vipCapacity = parseInt(eventForm.vipTicketCapacity);
        if (isNaN(vipPrice) || vipPrice <= 0) {
            setError('VIP ticket price must be greater than zero when VIP tickets are offered.');
            return false;
        }
        if (isNaN(vipCapacity) || vipCapacity <= 0) {
            setError('VIP ticket capacity must be greater than zero when VIP tickets are offered.');
            return false;
        }
    }

    setError(''); // Clear error if validation passes
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation before submitting
    if (!validateForm()) {
        return; // Stop submission if validation fails
    }

    setIsLoading(true);

    try {
      // Format the data for the API
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        shortDescription: eventForm.shortDescription,
        location: eventForm.location,
        eventDate: `${eventForm.date}T00:00:00`,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        eventType: eventForm.category,
        status: isEditing && initialData?.status ? initialData.status : 'PUBLISHED',
        generalPrice: parseFloat(eventForm.generalTicketPrice),
        vipPrice: hasVipTickets ? parseFloat(eventForm.vipTicketPrice) : 0,
        generalTicketLimit: parseInt(eventForm.generalTicketCapacity),
        vipTicketLimit: hasVipTickets ? parseInt(eventForm.vipTicketCapacity) : 0,
        imageUrl: eventForm.imageUrl || "https://www.creativefabrica.com/wp-content/uploads/2022/01/01/event-organizer-letter-eo-logo-design-Graphics-22712239-1.jpg",
        organizerId: localStorage.getItem('userId')
      };

      console.log('Sending event data:', eventData);

      // Call the API - handle both create and update
      let response;
      if (isEditing && initialData?.id) {
        response = await eventService.updateEvent(initialData.id, eventData);
        console.log('Event updated successfully:', response.data);
      } else {
        response = await eventService.createEvent(eventData);
        console.log('Event created successfully:', response.data);
      }

      // Reset form on success
      setEventForm({
        title: '', description: '', shortDescription: '', location: '',
        date: '', startTime: '', endTime: '', generalTicketPrice: '',
        vipTicketPrice: '', generalTicketCapacity: '', vipTicketCapacity: '',
        category: '', imageUrl: ''
      });
      setHasVipTickets(false);

      // Notify parent component of success
      if (onEventCreated) onEventCreated(response.data);

    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save event. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          {/* Add red asterisk */}
          <label className="block text-sm font-medium text-[#183B4E] mb-2">Event Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
            placeholder="Enter event title"
            value={eventForm.title}
            onChange={handleEventFormChange}
          />
        </div>

        {/* Short Description */}
        <div>
          {/* Add red asterisk */}
          <label className="block text-sm font-medium text-[#183B4E] mb-2">Short Description <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="shortDescription"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
            placeholder="Brief summary of your event (max 100 characters)"
            maxLength="100"
            value={eventForm.shortDescription}
            onChange={handleEventFormChange}
          />
        </div>

        {/* Full Description */}
        <div>
          {/* Add red asterisk */}
          <label className="block text-sm font-medium text-[#183B4E] mb-2">Full Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            required
            rows="4"
            className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
            placeholder="Describe your event in detail"
            value={eventForm.description}
            onChange={handleEventFormChange}
          ></textarea>
        </div>

        {/* Location and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Add red asterisk */}
            <label className="block text-sm font-medium text-[#183B4E] mb-2">Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-[#183B4E]/50" />
              </div>
              <input
                type="text"
                name="location"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                placeholder="Event location"
                value={eventForm.location}
                onChange={handleEventFormChange}
              />
            </div>
          </div>

          <div>
            {/* Add red asterisk */}
            <label className="block text-sm font-medium text-[#183B4E] mb-2">Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarDay className="text-[#183B4E]/50" />
              </div>
              <input
                type="date"
                name="date"
                required
                min={getTodayDate()}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                value={eventForm.date}
                onChange={handleEventFormChange}
              />
            </div>
          </div>
        </div>

        {/* Start Time and End Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Add red asterisk */}
            <label className="block text-sm font-medium text-[#183B4E] mb-2">Start Time <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaClock className="text-[#183B4E]/50" />
              </div>
              <input
                type="time"
                name="startTime"
                required
                disabled={initialData?.status === 'IN_PROGRESS'}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                value={eventForm.startTime}
                onChange={handleEventFormChange}
              />
            </div>
          </div>

          <div>
            {/* Add red asterisk */}
            <label className="block text-sm font-medium text-[#183B4E] mb-2">End Time <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaClock className="text-[#183B4E]/50" />
              </div>
              <input
                type="time"
                name="endTime"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                value={eventForm.endTime}
                onChange={handleEventFormChange}
              />
            </div>
          </div>
        </div>

        {/* General Ticket Price and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Add red asterisk */}
            <label className="block text-sm font-medium text-[#183B4E] mb-2">General Ticket Price ($) <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="text-[#183B4E]/50" />
              </div>
              <input
                type="number"
                name="generalTicketPrice"
                required
                min="0.1"
                step="0.1"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]" 
                placeholder="Price per ticket"
                value={eventForm.generalTicketPrice}
                onChange={handleEventFormChange}
              />
            </div>
          </div>
           <div>
            {/* Add red asterisk */}
            <label className="block text-sm font-medium text-[#183B4E] mb-2">General Ticket Capacity <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="generalTicketCapacity"
              required
              min="1"
              step="1"
              className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
              placeholder="Number of general tickets"
              value={eventForm.generalTicketCapacity}
              onChange={handleEventFormChange}
            />
          </div>
        </div>

        {/* VIP Ticket Toggle */}
        <div className="flex items-center">
            <input
                id="vip-toggle"
                type="checkbox"
                checked={hasVipTickets}
                onChange={handleEventFormChange}
                className="h-4 w-4 text-[#27548A] focus:ring-[#DDA853] border-gray-300 rounded"
            />
            <label htmlFor="vip-toggle" className="ml-2 block text-sm font-medium text-[#183B4E]">
                Offer VIP Tickets?
            </label>
        </div>

        {/* Conditional VIP Ticket Price and Capacity */}
        {hasVipTickets && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-dashed border-[#DDA853] rounded-lg bg-[#F5EEDC]/50">
            <div>
              {/* Add red asterisk */}
              <label className="block text-sm font-medium text-[#183B4E] mb-2">VIP Ticket Price ($) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-[#183B4E]/50" />
                </div>
                    <input
                        type="number"
                        name="vipTicketPrice"
                        required={hasVipTickets}
                        min="0.1"
                        step="0.1"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]" 
                        placeholder="Price per ticket"
                        value={eventForm.vipTicketPrice}
                        onChange={handleEventFormChange}
                    />
                </div>
            </div>
            <div>
              {/* Add red asterisk */}
              <label className="block text-sm font-medium text-[#183B4E] mb-2">VIP Ticket Capacity <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers className="text-[#183B4E]/50" />
                </div>
                <input
                  type="number"
                  name="vipTicketCapacity"
                  required={hasVipTickets}
                  min="1"
                  step="1"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]" // Add pl-10 for padding
                  placeholder="Number of VIP tickets"
                  value={eventForm.vipTicketCapacity}
                  onChange={handleEventFormChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          {/* Add red asterisk */}
          <label className="block text-sm font-medium text-[#183B4E] mb-2">Category <span className="text-red-500">*</span></label>
          <select
            name="category"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
            value={eventForm.category}
            onChange={handleEventFormChange}
          >
            <option value="">Select a category</option>
            <option value="CONFERENCE">Conference</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="SEMINAR">Seminar</option>
            <option value="CONCERT">Concert</option>
            <option value="MOVIE">Movie</option>
            <option value="SPORTS">Sports</option>
            <option value="SOCIAL">Social</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Image URL */}
        <div>
          {/* No asterisk as it's optional */}
          <label className="block text-sm font-medium text-[#183B4E] mb-2">Event Image URL</label>
          <div className="relative">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaImage className="text-[#183B4E]/50" />
                </div>
                <input
                type="url"
                name="imageUrl"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                placeholder="https://example.com/image.jpg"
                value={eventForm.imageUrl}
                onChange={handleEventFormChange}
                />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Leave empty to use a default image</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#27548A] text-[#F5EEDC] py-3 rounded-lg font-medium hover:bg-[#183B4E] transition-colors disabled:opacity-70"
          >
            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Event' : 'Create Event')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;