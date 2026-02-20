import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import ImageUpload from '../../components/admin/ImageUpload';
import { settingsAPI } from '../../utils/api';
import { toast } from 'sonner';
import config from '../../config/env';

const ManageSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    logo: '',
    siteName: 'Srigandha Kannada Koota of Florida',
    taxId: '59-3527606',
    socialLinks: {
      facebook: '',
      youtube: '',
      twitter: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    membershipPortalUrl: '',
    whatsappLink: '',
    membershipPlans: [],
    presidentMessage: {
      name: '',
      title: 'President',
      photo: '',
      message: '',
      messageKannada: ''
    },
    sponsors: []
  });

  const fetchSettings = useCallback(async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data) {
        setFormData({
          logo: response.data.logo || '',
          siteName: response.data.siteName || 'Srigandha Kannada Koota of Florida',
          taxId: response.data.taxId || '59-3527606',
          socialLinks: response.data.socialLinks || { facebook: '', youtube: '', twitter: '' },
          contactInfo: response.data.contactInfo || { email: '', phone: '', address: '' },
          membershipPortalUrl: response.data.membershipPortalUrl || '',
          whatsappLink: response.data.whatsappLink || '',
          membershipPlans: response.data.membershipPlans || [],
          presidentMessage: response.data.presidentMessage || {
            name: '', title: 'President', photo: '', message: '', messageKannada: ''
          },
          sponsors: response.data.sponsors || []
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.update(formData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addSponsor = () => {
    setFormData({
      ...formData,
      sponsors: [...formData.sponsors, { name: '', logo: '', url: '', order: formData.sponsors.length, isActive: true }]
    });
  };

  const removeSponsor = (index) => {
    setFormData({
      ...formData,
      sponsors: formData.sponsors.filter((_, i) => i !== index)
    });
  };

  const updateSponsor = (index, field, value) => {
    const updated = [...formData.sponsors];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, sponsors: updated });
  };

  const addMembershipPlan = () => {
    setFormData({
      ...formData,
      membershipPlans: [...formData.membershipPlans, { name: '', price: 0, duration: '', benefits: [], popular: false, registrationLink: '' }]
    });
  };

  const removeMembershipPlan = (index) => {
    setFormData({
      ...formData,
      membershipPlans: formData.membershipPlans.filter((_, i) => i !== index)
    });
  };

  const updateMembershipPlan = (index, field, value) => {
    const updated = [...formData.membershipPlans];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, membershipPlans: updated });
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'links', label: 'Links & Membership' },
    { id: 'social', label: 'Social Media' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'president', label: "President's Message" },
    { id: 'sponsors', label: 'Sponsors' }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <ImageUpload onUploadSuccess={(url) => setFormData({ ...formData, logo: url })} />
                  {formData.logo && (
                    <img src={`${config.baseUrl}${formData.logo}`} alt="Logo" className="mt-2 max-w-xs" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Links & Membership */}
          {activeTab === 'links' && (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-2xl font-bold mb-4">Links & Membership</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Membership Portal URL</label>
                  <input
                    type="url"
                    value={formData.membershipPortalUrl}
                    onChange={(e) => setFormData({ ...formData, membershipPortalUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="https://app.featsclub.com/membership.html?..."
                  />
                  <p className="text-xs text-gray-500 mt-1">This URL is used for the &quot;LOGIN / MEMBERSHIP&quot; button in the navbar. Leave empty to hide the button.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Group Link</label>
                  <input
                    type="url"
                    value={formData.whatsappLink}
                    onChange={(e) => setFormData({ ...formData, whatsappLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Floating WhatsApp button link. Leave empty to hide the button.</p>
                </div>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Membership Plans</h3>
                <button
                  type="button"
                  onClick={addMembershipPlan}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
                >
                  + Add Plan
                </button>
              </div>

              {formData.membershipPlans.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No membership plans. Click &quot;Add Plan&quot; to create one.</p>
              ) : (
                <div className="space-y-6">
                  {formData.membershipPlans.map((plan, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-700">Plan #{index + 1}</h4>
                        <button type="button" onClick={() => removeMembershipPlan(index)} className="text-red-500 hover:text-red-700 text-sm">
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => updateMembershipPlan(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                            placeholder="e.g. Family"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                          <input
                            type="number"
                            value={plan.price}
                            onChange={(e) => updateMembershipPlan(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                          <input
                            type="text"
                            value={plan.duration}
                            onChange={(e) => updateMembershipPlan(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                            placeholder="e.g. 1 Year Membership"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
                          <input
                            type="url"
                            value={plan.registrationLink}
                            onChange={(e) => updateMembershipPlan(index, 'registrationLink', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (comma-separated)</label>
                        <input
                          type="text"
                          value={(plan.benefits || []).join(', ')}
                          onChange={(e) => updateMembershipPlan(index, 'benefits', e.target.value.split(',').map(b => b.trim()).filter(Boolean))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                          placeholder="Discounted Tickets, Network With Members, ..."
                        />
                      </div>
                      <div className="mt-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={plan.popular}
                            onChange={(e) => updateMembershipPlan(index, 'popular', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Mark as Popular</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Social Media */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Social Media Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => setFormData({
                      ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData({
                      ...formData, socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData, contactInfo: { ...formData.contactInfo, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData, contactInfo: { ...formData.contactInfo, phone: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    rows="3"
                    value={formData.contactInfo.address}
                    onChange={(e) => setFormData({
                      ...formData, contactInfo: { ...formData.contactInfo, address: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* President's Message */}
          {activeTab === 'president' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">President&apos;s Message</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">President Name</label>
                    <input
                      type="text"
                      value={formData.presidentMessage.name}
                      onChange={(e) => setFormData({
                        ...formData, presidentMessage: { ...formData.presidentMessage, name: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Sri Ramesh Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.presidentMessage.title}
                      onChange={(e) => setFormData({
                        ...formData, presidentMessage: { ...formData.presidentMessage, title: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                      placeholder="President"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                  <ImageUpload
                    onUploadSuccess={(url) => setFormData({
                      ...formData, presidentMessage: { ...formData.presidentMessage, photo: url }
                    })}
                  />
                  {formData.presidentMessage.photo && (
                    <img
                      src={`${config.baseUrl}${formData.presidentMessage.photo}`}
                      alt="President"
                      className="mt-2 w-32 h-32 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (English)</label>
                  <textarea
                    rows="6"
                    value={formData.presidentMessage.message}
                    onChange={(e) => setFormData({
                      ...formData, presidentMessage: { ...formData.presidentMessage, message: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="President's message in English..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Kannada)</label>
                  <textarea
                    rows="6"
                    value={formData.presidentMessage.messageKannada}
                    onChange={(e) => setFormData({
                      ...formData, presidentMessage: { ...formData.presidentMessage, messageKannada: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="ಅಧ್ಯಕ್ಷರ ಸಂದೇಶ ಕನ್ನಡದಲ್ಲಿ..."
                    style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Sponsors */}
          {activeTab === 'sponsors' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Sponsors / Partners</h2>
                <button
                  type="button"
                  onClick={addSponsor}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
                >
                  + Add Sponsor
                </button>
              </div>

              {formData.sponsors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sponsors added yet. Click &quot;Add Sponsor&quot; to get started.</p>
              ) : (
                <div className="space-y-6">
                  {formData.sponsors.map((sponsor, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-700">Sponsor #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeSponsor(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={sponsor.name}
                            onChange={(e) => updateSponsor(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                            placeholder="Sponsor name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                          <input
                            type="url"
                            value={sponsor.url}
                            onChange={(e) => updateSponsor(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                          <input
                            type="number"
                            value={sponsor.order}
                            onChange={(e) => updateSponsor(index, 'order', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={sponsor.isActive}
                              onChange={(e) => updateSponsor(index, 'isActive', e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                        <ImageUpload onUploadSuccess={(url) => updateSponsor(index, 'logo', url)} />
                        {sponsor.logo && (
                          <img src={`${config.baseUrl}${sponsor.logo}`} alt={sponsor.name} className="mt-2 h-16 object-contain" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageSettings;
