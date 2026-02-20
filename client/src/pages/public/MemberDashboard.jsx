import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { useMemberAuth } from '../../context/MemberAuthContext';
import { memberAuthAPI, settingsAPI } from '../../utils/api';
import { toast } from 'sonner';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { member, isMemberAuthenticated, refreshProfile, isActiveMember, isGuestMember } = useMemberAuth();
  const [bookings, setBookings] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', city: '', state: '', zip: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [registeringPlan, setRegisteringPlan] = useState(false);

  useEffect(() => {
    if (!isMemberAuthenticated) {
      navigate('/');
      return;
    }
    fetchBookings();
    fetchPlans();
  }, [isMemberAuthenticated, navigate]);

  useEffect(() => {
    if (member) {
      setProfileForm({
        name: member.name || '',
        phone: member.phone || '',
        city: member.address?.city || '',
        state: member.address?.state || '',
        zip: member.address?.zip || '',
      });
    }
  }, [member]);

  const fetchBookings = async () => {
    try {
      const response = await memberAuthAPI.getBookings();
      setBookings(response.data);
    } catch {
      // silent fail
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await settingsAPI.get();
      setPlans(response.data?.membershipPlans || []);
    } catch {
      // silent fail
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await memberAuthAPI.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        address: { city: profileForm.city, state: profileForm.state, zip: profileForm.zip },
      });
      await refreshProfile();
      setEditMode(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePlanRegister = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    setRegisteringPlan(true);
    try {
      await memberAuthAPI.registerPlan({ plan: selectedPlan });
      await refreshProfile();
      toast.success('Membership application submitted! We will review it shortly.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register plan');
    } finally {
      setRegisteringPlan(false);
    }
  };

  if (!isMemberAuthenticated) return null;

  const statusConfig = {
    active: { label: 'Active Member', color: 'bg-green-100 text-green-800 border-green-300', icon: '&#10003;' },
    pending: { label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '&#9203;' },
    guest: { label: 'Guest', color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '&#9733;' },
    expired: { label: 'Expired', color: 'bg-red-100 text-red-800 border-red-300', icon: '!' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300', icon: 'X' },
  };

  const status = statusConfig[member?.status] || statusConfig.guest;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            {member?.avatar ? (
              <img src={member.avatar} alt="" className="h-16 w-16 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
                {member?.name?.charAt(0)?.toUpperCase() || 'M'}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{member?.name || 'Member'}</h1>
              <p className="text-gray-500">{member?.email}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${status.color}`}>
              <span dangerouslySetInnerHTML={{ __html: status.icon }} /> {status.label}
            </span>
          </div>
          {member?.plan && (
            <div className="mt-3 text-sm text-gray-600">
              Plan: <span className="font-semibold">{member.plan}</span>
              {member?.expiryDate && (
                <span className="ml-3">
                  Expires: {new Date(member.expiryDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {['profile', 'bookings', ...(isGuestMember ? ['membership'] : [])].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'profile' ? 'Profile' : tab === 'bookings' ? 'My Bookings' : 'Become a Member'}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Profile Information</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-primary hover:underline text-sm"
                >
                  Edit
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                    <input
                      type="text"
                      value={profileForm.zip}
                      onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{member?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{member?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{member?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {[member?.address?.city, member?.address?.state, member?.address?.zip].filter(Boolean).join(', ') || '-'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">My Bookings</h2>
            {loadingBookings ? (
              <p className="text-gray-500">Loading...</p>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No bookings yet</p>
                <p className="text-sm">RSVP to an event to see your bookings here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4 hover:shadow-sm transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {booking.event?.title || 'Event'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.event?.date
                            ? new Date(booking.event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : ''}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.tickets} {booking.tickets === 1 ? 'ticket' : 'tickets'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Membership Registration Tab (for guests) */}
        {activeTab === 'membership' && isGuestMember && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-2">Become a Member</h2>
            <p className="text-gray-600 mb-6">
              Choose a membership plan to unlock discounted event tickets and exclusive member benefits.
            </p>

            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {plans.map((plan, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`border-2 rounded-lg p-6 text-center transition ${
                      selectedPlan === plan.name
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <div className="text-3xl font-bold text-primary my-2">${plan.price}</div>
                    <p className="text-sm text-gray-500">{plan.duration}</p>
                    {plan.benefits && (
                      <ul className="text-left text-sm mt-3 space-y-1">
                        {plan.benefits.map((b, i) => (
                          <li key={i} className="text-gray-600">&#10003; {b}</li>
                        ))}
                      </ul>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6">No membership plans available at the moment.</p>
            )}

            {selectedPlan && (
              <button
                onClick={handlePlanRegister}
                disabled={registeringPlan}
                className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {registeringPlan ? 'Submitting...' : `Apply for ${selectedPlan} Membership`}
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MemberDashboard;
