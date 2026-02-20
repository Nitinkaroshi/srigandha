import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import ConfirmModal from '../../components/common/ConfirmModal';
import { contactAPI } from '../../utils/api';
import { toast } from 'sonner';

const ManageContact = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [expandedMessage, setExpandedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await contactAPI.getAll();
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRead = async (id) => {
        try {
            const response = await contactAPI.toggleRead(id);
            setMessages(messages.map((msg) =>
                msg._id === id ? { ...msg, read: response.data.read } : msg
            ));
        } catch (error) {
            console.error('Error toggling read status:', error);
            toast.error('Failed to update message status');
        }
    };

    const handleDeleteClick = (id) => {
        setMessageToDelete(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await contactAPI.delete(messageToDelete);
            toast.success('Message deleted successfully');
            setMessages(messages.filter((msg) => msg._id !== messageToDelete));
            setShowConfirmModal(false);
            setMessageToDelete(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
            setShowConfirmModal(false);
        }
    };

    const unreadCount = messages.filter((msg) => !msg.read).length;

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-500 mt-1">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {messages.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No messages found
                                            </td>
                                        </tr>
                                    ) : (
                                        messages.map((msg) => (
                                            <tr
                                                key={msg._id}
                                                className={`hover:bg-gray-50 cursor-pointer ${!msg.read ? 'bg-blue-50' : ''}`}
                                                onClick={() => setExpandedMessage(expandedMessage === msg._id ? null : msg._id)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleToggleRead(msg._id); }}
                                                        className={`w-3 h-3 rounded-full ${msg.read ? 'bg-gray-300' : 'bg-blue-500'}`}
                                                        title={msg.read ? 'Mark as unread' : 'Mark as read'}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-900'}`}>{msg.name}</div>
                                                    <div className="text-sm text-gray-500">{msg.email}</div>
                                                </td>
                                                <td className={`px-6 py-4 text-sm ${!msg.read ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                                    {msg.subject}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                    {expandedMessage === msg._id ? (
                                                        <div className="whitespace-pre-wrap">{msg.message}</div>
                                                    ) : (
                                                        <div className="truncate">{msg.message}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleToggleRead(msg._id); }}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        {msg.read ? 'Unread' : 'Read'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(msg._id); }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
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
                    title="Delete Message"
                    message="Are you sure you want to delete this message? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </div>
    );
};

export default ManageContact;
