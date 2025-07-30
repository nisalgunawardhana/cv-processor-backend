import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid JWT token in the Authorization header'
    });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ 
          error: 'Token expired',
          message: 'Your session has expired. Please login again.'
        });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          error: 'Invalid token',
          message: 'The provided token is invalid.'
        });
      }
      return res.status(403).json({ 
        error: 'Token verification failed',
        message: 'Unable to verify the provided token.'
      });
    }

    req.user = user;
    next();
  });
};

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { 
    expiresIn: config.jwt.expiresIn 
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw error;
  }
};
