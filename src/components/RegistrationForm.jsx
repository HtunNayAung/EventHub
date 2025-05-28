import React, { useState } from "react";
import { registrationService } from '../services/api';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegistrationForm = ({ event, onBack, userId }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    generalQuantity: 0,
    vipQuantity: 0,
  });

  // Remove errors state as payment validation is removed
  // const [errors, setErrors] = useState({
  //   cardNumber: '',
  //   cardHolder: '',
  //   expiryDate: '',
  //   cvv: ''
  // });

  const handleQuantityChange = (type, change) => {
    const key = `${type.toLowerCase()}Quantity`;
    const currentValue = formData[key];
    let newValue = currentValue + change;

    // Apply the 5-ticket limit
    if (newValue > 5) {
      alert(`You can only select a maximum of 5 ${type} tickets.`);
      newValue = 5;
    }
    newValue = Math.max(0, newValue); // Ensure quantity doesn't go below 0

    setFormData({ ...formData, [key]: newValue });
  };

  // Remove validateForm function
  // const validateForm = () => { /* ... */ };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tickets = [];
    for (let i = 0; i < formData.generalQuantity; i++) {
      tickets.push({ ticketType: "GENERAL" });
    }
    for (let i = 0; i < formData.vipQuantity; i++) {
      tickets.push({ ticketType: "VIP" });
    }

    if (tickets.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const registrationRequestDTO = {
      eventId: event.id,
      attendeeId: userId,
      amountPaid: 0.0, // Initial amount paid is 0.0, payment will be handled separately
      tickets: tickets,
    };

    try {
      const response = await registrationService.registerForEvent(registrationRequestDTO);

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        
        // Redirect to payment page with registration ID
        navigate(`/payment/${data.id}?attendeeId=${userId}`); 
      } else {
        // This block might not be reached if Axios throws an error for non-2xx responses
        // but it's good practice to keep for clarity or if Axios is configured not to throw
        const errorData = response.data;
        console.error('Registration failed:', errorData);
        alert(`Registration failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Registration failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('An error occurred during registration: No response from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('An error occurred during registration: ' + error.message);
      }
    }
  };

  // Remove formatCardNumber function
  // const formatCardNumber = (value) => { /* ... */ };

  const totalPrice = (formData.generalQuantity * (event.generalPrice || 0)) +
                    (formData.vipQuantity * (event.vipPrice || 0));

  const hasSelectedTickets = formData.generalQuantity > 0 || formData.vipQuantity > 0;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#183B4E] mb-2">{event.title}</h2>
        <p className="text-[#183B4E]/70">
          {new Date(event.eventDate).toLocaleDateString()} | {event.startTime} - {event.endTime} @ {event.location}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* General Admission Ticket Selection */}
          <div className="bg-white p-4 rounded-lg border border-[#F5EEDC]">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-bold text-[#183B4E]">General Admission</h4>
                <p className="text-sm text-[#183B4E]/70">
                  ${event.generalPrice?.toFixed(2)} per ticket
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange('general', -1)}
                  className="w-8 h-8 rounded-full bg-[#F5EEDC] text-[#183B4E] flex items-center justify-center hover:bg-[#DDA853] transition-colors"
                  disabled={formData.generalQuantity === 0}
                >
                  -
                </button>
                <span className="w-8 text-center font-medium text-[#183B4E]">
                  {formData.generalQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange('general', 1)}
                  className="w-8 h-8 rounded-full bg-[#F5EEDC] text-[#183B4E] flex items-center justify-center hover:bg-[#DDA853] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            {formData.generalQuantity > 0 && (
              <div className="text-right text-[#183B4E]/80">
                Subtotal: ${(formData.generalQuantity * event.generalPrice).toFixed(2)}
              </div>
            )}
          </div>

          {/* VIP Ticket Selection - Only show if VIP tickets are available */}
          {event.vipPrice > 0 && (
            <div className="bg-white p-4 rounded-lg border border-[#F5EEDC]">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-bold text-[#183B4E]">VIP Access</h4>
                  <p className="text-sm text-[#183B4E]/70">
                    ${event.vipPrice.toFixed(2)} per ticket
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange('vip', -1)}
                    className="w-8 h-8 rounded-full bg-[#F5EEDC] text-[#183B4E] flex items-center justify-center hover:bg-[#DDA853] transition-colors"
                    disabled={formData.vipQuantity === 0}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-[#183B4E]">
                    {formData.vipQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange('vip', 1)}
                    className="w-8 h-8 rounded-full bg-[#F5EEDC] text-[#183B4E] flex items-center justify-center hover:bg-[#DDA853] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              {formData.vipQuantity > 0 && (
                <div className="text-right text-[#183B4E]/80">
                  Subtotal: ${(formData.vipQuantity * event.vipPrice).toFixed(2)}
                </div>
              )}
            </div>
          )}
        </div>


        {/* Payment Information section removed */}

        {/* Total Price Summary */}
        <div className="bg-[#F5EEDC] p-4 rounded-lg">
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-[#183B4E]">Total</span>
            <span className="text-[#183B4E]">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 rounded-lg border-2 border-[#27548A] text-[#27548A] hover:bg-[#27548A] hover:text-white transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!hasSelectedTickets}
            className={`flex-1 px-6 py-3 rounded-lg ${
              hasSelectedTickets
                ? 'bg-[#27548A] text-white hover:bg-[#183B4E]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;