import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';

export const protectMember = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'member') {
      return res.status(401).json({ message: 'Not authorized, invalid token type' });
    }

    req.member = await Member.findById(decoded.id);

    if (!req.member) {
      return res.status(401).json({ message: 'Not authorized, member not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const optionalMember = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type === 'member') {
        req.member = await Member.findById(decoded.id);
      }
    } catch (error) {
      // Silently fail
    }
  }
  next();
};

export const activeMember = (req, res, next) => {
  if (req.member && req.member.status === 'active') {
    next();
  } else {
    return res.status(403).json({ message: 'Active membership required' });
  }
};
