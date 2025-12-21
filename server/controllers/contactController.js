import Contact from '../models/Contact.js';
import { handleMongooseError } from '../utils/errorHandler.js';

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please provide all required fields: name, email, subject, message' });
        }

        const newContact = new Contact({
            name,
            email,
            subject,
            message,
        });

        const savedContact = await newContact.save();

        res.status(201).json(savedContact);
    } catch (error) {
        const { status, message: errorMessage } = handleMongooseError(error);
        res.status(status).json({ message: errorMessage });
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getAllMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        const { status, message } = handleMongooseError(error);
        res.status(status).json({ message });
    }
};

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Message ID is required' });
        }

        const message = await Contact.findById(req.params.id);

        if (message) {
            await Contact.deleteOne({ _id: req.params.id });
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        const { status, message: errorMessage } = handleMongooseError(error);
        res.status(status).json({ message: errorMessage });
    }
};
