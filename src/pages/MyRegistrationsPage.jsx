import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService, registrationService } from '../services/api';

export default function MyRegistrationsPage() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleTicketId, setVisibleTicketId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  const [refundRequested, setRefundRequested] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      setLoading(true);
      try {
        const res = await registrationService.getMyRegistrations(userId);
        setRegistrations(res.data || []);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestRefund = async (registrationId) => {
    const confirmed = window.confirm('Are you sure you want to request a refund? This action cannot be undone.');
    if (!confirmed) return;
  
    try {
      await paymentService.requestRefund(registrationId); 
  
      // Update UI: mark registration as REQUESTED or trigger re-fetch
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.registrationId === registrationId
            ? { ...reg, status: 'REFUND_REQUESTED' }
            : reg
        )
      );

      setRefundRequested(true); 
    } catch (err) {
      console.error('Refund request failed:', err);
      alert('Failed to request refund. Please try again later.');
    }
  };
  

  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    APPROVED: 'bg-blue-100 text-blue-800 border-blue-300',
    PAID: 'bg-teal-100 text-teal-800 border-teal-300',
    REJECTED: 'bg-red-100 text-red-700 border-red-300',
    REFUNDED: 'bg-purple-100 text-purple-800 border-purple-300',
  };

  const filteredRegistrations =
    statusFilter === 'ALL'
      ? registrations
      : registrations.filter((reg) => reg.status === statusFilter);

  if (loading) {
    return <p className="text-center text-gray-500 mt-8">Loading...</p>;
  }

  if (registrations.length === 0) {
    return <p className="text-center text-gray-400 italic mt-8">No registrations found.</p>;
  }

  return (
    <div>
      {/* ✅ Filter Dropdown in Top-Right */}
      <div className="flex justify-between items-center mb-6">
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27548A]"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="PAID">Paid</option>
          <option value="REJECTED">Rejected</option>
          <option value="REFUNDED">Refunded</option>
          <option value="REFUND_REQUESTED">Refund Req</option>
          <option value="CANCELLED">Cancelled</option>

        </select>
      </div>

      <div className="space-y-5">
        {filteredRegistrations.map((reg) => (
          <div
            key={reg.registrationId}
            className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4"
          >
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#183B4E] mb-1">{reg.eventTitle}</h2>
              <p className="text-sm text-[#183B4E]/70">
                📍 {reg.location} | 🗓️ {new Date(reg.date).toLocaleDateString()} {reg.time}
              </p>
              <p className="mt-1 text-sm text-[#183B4E]">
                🎟️ Ticket: <strong>{reg.ticketType}</strong> | 💵{' '}
                {reg.amountDue > 0 ? `$${reg.amountDue.toFixed(2)}` : 'Free'}
              </p>
              {visibleTicketId === reg.registrationId && reg.ticketCode && (
                <div className="mt-2 text-sm text-green-700 font-mono border border-green-300 rounded px-3 py-2 bg-green-50">
                  Ticket Code: {reg.ticketCode}
                </div>
              )}
              {reg.status === 'REFUNDED' && reg.cardLastFour && (
                <div className="mt-2 text-sm text-purple-700 border border-purple-300 rounded px-3 py-2 bg-purple-50">
                    Refund has been processed to the card ending with <strong>{reg.cardLastFour}</strong>.
                </div>
               )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 text-xs font-semibold border rounded-full ${
                  statusStyles[reg.status] || 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                {reg.status}
              </span>

              {reg.status === 'APPROVED' && (
                <button
                  onClick={() =>
                    navigate(`/payment/${reg.registrationId}?attendeeId=${reg.attendeeId}`)
                  }
                  className="px-4 py-2 text-sm bg-[#1439a7] text-white rounded hover:bg-[#27548A]"
                >
                  Pay Now
                </button>
              )}

              {reg.status === 'PAID' && (
                <button
                  onClick={() =>
                    setVisibleTicketId((prev) =>
                      prev === reg.registrationId ? null : reg.registrationId
                    )
                  }
                  className="px-4 py-1 text-sm bg-[#27548A] text-white rounded hover:bg-[#183B4E]"
                >
                  {visibleTicketId === reg.registrationId ? 'Hide Ticket' : 'View Ticket'}
                </button>
              )}

              {reg.status === 'PAID' && reg.amountDue != 0 && (
                <button className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                disabled={refundRequested}
                onClick={() => handleRequestRefund(reg.registrationId)}
                >
                  {refundRequested ? "Refund Requested" : "Request Refund"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
