import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/api';

const PaymentPage = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const attendeeId = query.get('attendeeId');

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const paymentData = {
        registrationId,
        cardLastFour: cardNumber.slice(-4)
      };

      console.log('Payment data:', paymentData); // Log the payment data t

      const response = await paymentService.makePayment(paymentData);
      console.log('Payment successful:', response.data);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/attendee/${attendeeId}/dashboard`); // Adjust route as needed
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
          <p className="text-lg text-gray-700 mb-2">Thanks for purchasing your tickets.</p>
          <p className="text-sm text-gray-500">You will be redirected to your dashboard shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-[#183B4E] mb-2">Confirm Payment</h1>
        <p className="text-sm text-gray-600 mb-6">
          Proceeding to payment for Registration ID: <strong>{registrationId}</strong>
        </p>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27548A]"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              maxLength={19}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27548A]"
              value={cardNumber}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, ''); // Remove non-digits
                const formatted = raw.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
                setCardNumber(formatted);
              }}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input
                type="text"
                maxLength={5}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27548A]"
                value={expiry}
                onChange={(e) => {
                    let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
                  
                    if (input.length > 4) input = input.slice(0, 4); // Limit to 4 digits (MMYY)
                  
                    if (input.length > 2) {
                      input = `${input.slice(0, 2)}/${input.slice(2)}`; // Insert slash after MM
                    }
                  
                    setExpiry(input);
                  }}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                maxLength={3}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27548A]"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-4 font-semibold rounded-lg text-white transition-colors ${
              isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#27548A] hover:bg-[#183B4E]'
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
