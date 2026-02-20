import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { bookingsAPI } from '../../utils/api';
import { useMemberAuth } from '../../context/MemberAuthContext';
import config from '../../config/env';

const EventCard = ({ event }) => {
  const [showRsvp, setShowRsvp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { member, isMemberAuthenticated, isActiveMember } = useMemberAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1,
    notes: ''
  });

  // Auto-fill form when member is logged in
  useEffect(() => {
    if (isMemberAuthenticated && member) {
      setFormData((prev) => ({
        ...prev,
        name: member.name || prev.name,
        email: member.email || prev.email,
        phone: member.phone || prev.phone,
      }));
    }
  }, [isMemberAuthenticated, member]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayPrice = () => {
    if (!event.price && event.price !== 0) return null;
    if (event.price === 0) return 'Free';
    if (isActiveMember && event.memberPrice != null && event.memberPrice < event.price) {
      return { regular: event.price, member: event.memberPrice };
    }
    return { regular: event.price };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { eventId: event._id, ...formData };
      if (isMemberAuthenticated && member?._id) {
        payload.memberId = member._id;
      }
      await bookingsAPI.create(payload);
      toast.success('Registration successful! We will confirm your booking soon.');
      setSubmitted(true);
      setShowRsvp(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const priceInfo = getDisplayPrice();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {event.image && (
        <img
          src={`${config.baseUrl}${event.image}`}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary font-semibold">
            {formatDate(event.date)}
          </div>
          {priceInfo && priceInfo !== 'Free' && typeof priceInfo === 'object' && (
            <div className="text-right">
              {priceInfo.member != null ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">${priceInfo.regular}</span>
                  <span className="text-green-600 font-bold">${priceInfo.member}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Member</span>
                </div>
              ) : (
                <span className="font-semibold text-gray-800">${priceInfo.regular}</span>
              )}
            </div>
          )}
          {priceInfo === 'Free' && (
            <span className="text-green-600 font-semibold text-sm">Free</span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        <div className="flex flex-wrap gap-2">
          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition text-sm"
            >
              Register & Pay
            </a>
          )}

          {event.type === 'upcoming' && !submitted && (
            <button
              onClick={() => setShowRsvp(!showRsvp)}
              className="inline-block bg-secondary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition text-sm"
            >
              {showRsvp ? 'Cancel' : 'RSVP Free'}
            </button>
          )}

          {submitted && (
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium">
              Registered
            </span>
          )}
        </div>

        {showRsvp && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t pt-4">
            {isMemberAuthenticated && (
              <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-md">
                Signed in as {member?.name || member?.email} - form auto-filled
              </div>
            )}
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="tel"
              required
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <select
                  value={formData.tickets}
                  onChange={(e) => setFormData({ ...formData, tickets: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>
            <textarea
              placeholder="Any notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition text-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm RSVP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventCard;
