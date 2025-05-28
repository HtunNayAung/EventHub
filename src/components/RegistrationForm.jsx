import React, { useState } from "react";
import { registrationService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ event, onBack, userId }) => {
  const navigate = useNavigate(); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType) {
      alert("Please select a ticket type.");
      return;
    }

    const registrationRequestDTO = {
      eventId: event.id,
      attendeeId: userId,
      ticketType: selectedType
    };

    try {
      const response = await registrationService.registerForEvent(registrationRequestDTO);

      if (response.status === 200 || response.status === 201) {
        const data = response.data;

        setShowSuccess(true);
        setTimeout(() => {
          navigate(0);
        }, 3000);
        
      } 
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. You may have already registered or the server encountered an issue.');
    }
  };

  const getPrice = () => {
    if (selectedType === 'GENERAL') return event.generalPrice || 0;
    if (selectedType === 'VIP') return event.vipPrice || 0;
    return 0;
  };

  return (
    <div>
      {showSuccess && (
        <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800 border border-green-300 shadow-sm">
          Registration Submitted! Please wait for approval from the event organizer.
        </div>
      )}

      {!showSuccess && 
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#183B4E] mb-2">{event.title}</h2>
          <p className="text-[#183B4E]/70">
            {new Date(event.eventDate).toLocaleDateString()} | {event.startTime} - {event.endTime} @ {event.location}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Ticket Option: General */}
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedType === 'GENERAL' ? 'border-[#27548A] bg-[#F5F9FF]' : 'border-[#F5EEDC]'
              }`}
              onClick={() => setSelectedType('GENERAL')}
            >
              <h4 className="font-bold text-[#183B4E]">General Admission</h4>
              <p className="text-sm text-[#183B4E]/70">
                ${event.generalPrice?.toFixed(2)} per ticket
              </p>
            </div>

            {/* Ticket Option: VIP */}
            {event.vipPrice > 0 && (
              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedType === 'VIP' ? 'border-[#27548A] bg-[#F5F9FF]' : 'border-[#F5EEDC]'
                }`}
                onClick={() => setSelectedType('VIP')}
              >
                <h4 className="font-bold text-[#183B4E]">VIP Access</h4>
                <p className="text-sm text-[#183B4E]/70">
                  ${event.vipPrice?.toFixed(2)} per ticket
                </p>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-[#F5EEDC] p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-[#183B4E]">Total</span>
              <span className="text-[#183B4E]">${getPrice().toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-[#27548A] text-[#27548A] hover:bg-[#27548A] hover:text-white"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!selectedType}
              className={`flex-1 px-6 py-3 rounded-lg ${
                selectedType
                  ? 'bg-[#27548A] text-white hover:bg-[#183B4E]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Register
            </button>
          </div>
        </form>
      </div>
      }
    </div>
  );
};

export default RegistrationForm;
