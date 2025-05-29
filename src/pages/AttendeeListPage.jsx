import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, registrationService, paymentService } from '../services/api';

export default function AttendeeListPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ticketFilter, setTicketFilter] = useState('ALL');

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'PAID', 'REJECTED', 'REFUNDED'];
  const ticketTypes = ['ALL', 'GENERAL', 'VIP'];

  const filteredAttendees = attendees.filter(a => 
    (statusFilter === 'ALL' || a.registrationStatus === statusFilter) &&
    (ticketFilter === 'ALL' || a.ticketRequested === ticketFilter)
  );

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const res = await eventService.getAttendees(eventId);
        setAttendees(res.data || []);
      } catch (err) {
        console.error('Failed to fetch attendees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  const handleApprove = async (registrationId) => {
    setProcessingId(registrationId);
    try {
      await registrationService.approveRegistration(registrationId);
      setAttendees(prev => prev.map(a =>
        a.registrationId === registrationId
          ? { ...a, registrationStatus: 'APPROVED' }
          : a
      ));
    } catch (err) {
      alert('Failed to approve. Try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (registrationId) => {
    setProcessingId(registrationId);
    try {
      await registrationService.rejectRegistration(registrationId);
      setAttendees(prev => prev.map(a =>
        a.registrationId === registrationId
          ? { ...a, registrationStatus: 'REJECTED' }
          : a
      ));

    } catch (err) {
      alert('Failed to reject. Try again.');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRefund = async (registrationId) => {
    if (!window.confirm('Refund this registration?')) return;
    setProcessingId(registrationId);
    try {
      await paymentService.refundRegistration(registrationId);
      setAttendees(prev => prev.map(a =>
        a.registrationId === registrationId
          ? { ...a, registrationStatus: 'REFUNDED' }
          : a
      ));
    } catch (err) {
      alert('Refund failed. Try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveRefund = async (registrationId) => {
    setProcessingId(registrationId);
    try {
      await paymentService.approveRefund(registrationId);
      setAttendees(prev => prev.map(a =>
        a.registrationId === registrationId
          ? { ...a, registrationStatus: 'REFUNDED' }
          : a
      ));
      // Optionally refresh the data or update state
    } catch (error) {
      console.error('Error approving refund:', error);
      alert('Failed to approve refund.');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRejectRefund = async (registrationId) => {
    setProcessingId(registrationId);
    try {
      await paymentService.rejectRefund(registrationId);
      setAttendees(prev => prev.map(a =>
        a.registrationId === registrationId
          ? { ...a, registrationStatus: 'PAID' }
          : a
      ));
      // Optionally refresh the data or update state
    } catch (error) {
      console.error('Error rejecting refund:', error);
      alert('Failed to reject refund.');
    } finally {
      setProcessingId(null);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#F5EEDC] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white text-[#27548A] border border-[#27548A] rounded-lg hover:bg-[#27548A] hover:text-white transition"
        >
          ← Back to Event
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#183B4E]">
            Attendees for Event #{eventId}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex flex-col">
              <label htmlFor="statusFilter" className="text-xs text-[#183B4E]/70 font-medium mb-1">Filter by Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#27548A] bg-white text-[#183B4E]"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="ticketFilter" className="text-xs text-[#183B4E]/70 font-medium mb-1">Filter by Ticket Type</label>
              <select
                id="ticketFilter"
                value={ticketFilter}
                onChange={(e) => setTicketFilter(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#27548A] bg-white text-[#183B4E]"
              >
                {ticketTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>


        <div className="bg-white border border-gray-200 shadow rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#27548A] text-white">
              <tr>
                <th className="px-6 py-4 font-semibold">Registration ID</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Tickets</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-6">Loading...</td></tr>
              ) : filteredAttendees.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-6 text-gray-500 italic">No matching attendees found.</td></tr>
              ) : (
                filteredAttendees.map(a => 
                  (
                  
                  <tr key={a.registrationId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{a.registrationId}</td>
                    <td className="px-6 py-4">{a.fullName}</td>
                    <td className="px-6 py-4">{a.email}</td>
                    <td className="px-6 py-4">{a.ticketRequested}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        {
                          PENDING: 'bg-yellow-100 text-yellow-800',
                          APPROVED: 'bg-blue-100 text-blue-800',
                          PAID: 'bg-green-200 text-green-900',
                          REJECTED: 'bg-red-100 text-red-700',
                          REFUNDED: 'bg-purple-100 text-purple-800',
                        }[a.registrationStatus] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {a.registrationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.registrationStatus === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(a.registrationId)}
                            disabled={processingId === a.registrationId}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(a.registrationId)}
                            disabled={processingId === a.registrationId}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {a.registrationStatus === 'PAID' && a.amountDue != 0 && (
                        <button
                          onClick={() => handleRefund(a.registrationId)}
                          disabled={processingId === a.registrationId}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-700"
                        >
                          Refund
                        </button>
                      )}

                      { a.registrationStatus === 'PAID' && a.amountDue == 0 && (
                         <span className="text-gray-400 text-sm italic">—</span>

                      )}
                     
                    
                      {a.registrationStatus === 'REFUND_REQUESTED' && (
                        <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRefund(a.registrationId)}
                          disabled={processingId === a.registrationId}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                        >
                          Approve Refund
                        </button>
                        <button
                          onClick={() => handleRejectRefund(a.registrationId)}
                          disabled={processingId === a.registrationId}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                        >
                          Reject Refund
                        </button>
                      </div>
                      )}

                      {['APPROVED', 'REJECTED', 'REFUNDED'].includes(a.registrationStatus) && (
                        <span className="text-gray-400 text-sm italic">—</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
