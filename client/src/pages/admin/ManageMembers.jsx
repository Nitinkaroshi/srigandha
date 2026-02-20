import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import ConfirmModal from '../../components/common/ConfirmModal';
import { membersAPI } from '../../utils/api';
import { toast } from 'sonner';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchMembers();
  }, [filterStatus, filterPlan]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPlan) params.plan = filterPlan;

      const response = await membersAPI.getAll(params);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const update = { status: newStatus };
      if (newStatus === 'active') {
        const now = new Date();
        update.startDate = now.toISOString();
        update.expiryDate = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
      }
      await membersAPI.update(id, update);
      setMembers(members.map(m =>
        m._id === id ? { ...m, ...update } : m
      ));
      toast.success(`Member ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update member status');
    }
  };

  const handleEditSave = async (id) => {
    try {
      await membersAPI.update(id, editData);
      setMembers(members.map(m =>
        m._id === id ? { ...m, ...editData } : m
      ));
      toast.success('Member updated');
      setEditingId(null);
      setEditData({});
    } catch (error) {
      toast.error('Failed to update member');
    }
  };

  const handleDeleteClick = (id) => {
    setMemberToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await membersAPI.delete(memberToDelete);
      setMembers(members.filter(m => m._id !== memberToDelete));
      toast.success('Member deleted');
      setShowConfirmModal(false);
      setMemberToDelete(null);
    } catch (error) {
      toast.error('Failed to delete member');
      setShowConfirmModal(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    expired: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const activeCount = members.filter(m => m.status === 'active').length;
  const pendingCount = members.filter(m => m.status === 'pending').length;
  const expiredCount = members.filter(m => m.status === 'expired').length;

  const uniquePlans = [...new Set(members.map(m => m.plan))];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Membership Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Members</p>
            <p className="text-2xl font-bold">{members.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Expired</p>
            <p className="text-2xl font-bold text-gray-600">{expiredCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
          >
            <option value="">All Plans</option>
            {uniquePlans.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No members found
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <>
                        <tr key={member._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedId(expandedId === member._id ? null : member._id)}>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {new Date(member.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {member.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div>{member.email}</div>
                            <div>{member.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {member.plan}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="capitalize">{member.paymentMethod || '-'}</div>
                            {member.paymentReference && (
                              <div className="text-xs text-gray-400">Ref: {member.paymentReference}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[member.status]}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                            {member.status === 'pending' && (
                              <button
                                onClick={() => handleStatusChange(member._id, 'active')}
                                className="text-green-600 hover:text-green-800 mr-2"
                              >
                                Activate
                              </button>
                            )}
                            {member.status === 'active' && (
                              <button
                                onClick={() => handleStatusChange(member._id, 'expired')}
                                className="text-gray-600 hover:text-gray-800 mr-2"
                              >
                                Expire
                              </button>
                            )}
                            {member.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(member._id, 'cancelled')}
                                className="text-yellow-600 hover:text-yellow-800 mr-2"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingId(editingId === member._id ? null : member._id);
                                setEditData({
                                  paymentMethod: member.paymentMethod || 'online',
                                  paymentReference: member.paymentReference || '',
                                  notes: member.notes || ''
                                });
                              }}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(member._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        {/* Expanded details row */}
                        {expandedId === member._id && (
                          <tr key={`${member._id}-details`} className="bg-gray-50">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                {member.address && (member.address.city || member.address.state || member.address.zip) && (
                                  <div>
                                    <span className="font-medium text-gray-700">Address:</span>{' '}
                                    {[member.address.city, member.address.state, member.address.zip].filter(Boolean).join(', ')}
                                  </div>
                                )}
                                {member.familyMembers && member.familyMembers.length > 0 && (
                                  <div>
                                    <span className="font-medium text-gray-700">Family Members:</span>
                                    <ul className="ml-4 list-disc">
                                      {member.familyMembers.map((fm, i) => (
                                        <li key={i}>{fm.name} ({fm.relation})</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {member.startDate && (
                                  <div>
                                    <span className="font-medium text-gray-700">Membership Period:</span>{' '}
                                    {new Date(member.startDate).toLocaleDateString()} - {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : 'N/A'}
                                  </div>
                                )}
                                {member.notes && (
                                  <div className="md:col-span-3">
                                    <span className="font-medium text-gray-700">Notes:</span> {member.notes}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                        {/* Edit row */}
                        {editingId === member._id && (
                          <tr key={`${member._id}-edit`} className="bg-blue-50">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="flex flex-wrap gap-4 items-end">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Payment Method</label>
                                  <select
                                    value={editData.paymentMethod}
                                    onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  >
                                    <option value="online">Online</option>
                                    <option value="cash">Cash</option>
                                    <option value="check">Check</option>
                                    <option value="zelle">Zelle</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Payment Reference</label>
                                  <input
                                    type="text"
                                    value={editData.paymentReference}
                                    onChange={(e) => setEditData({ ...editData, paymentReference: e.target.value })}
                                    placeholder="Check #, Transaction ID, etc."
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Admin Notes</label>
                                  <input
                                    type="text"
                                    value={editData.notes}
                                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                    placeholder="Internal notes..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  />
                                </div>
                                <button
                                  onClick={() => handleEditSave(member._id)}
                                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Member"
          message="Are you sure you want to delete this member record?"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default ManageMembers;
