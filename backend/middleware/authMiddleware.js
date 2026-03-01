const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to protect routes using JWT
 */
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            if (!token || token === 'null' || token === 'undefined') {
                console.warn('Backend received a malformed pseudo-null token:', req.headers.authorization);
                return res.status(401).json({ message: 'Not authorized, invalid token format passed' });
            }

            // Verify token
            const secret = process.env.JWT_SECRET || 'rvrjc_library_secret_key';
            const decoded = jwt.verify(token, secret);

            // Attach user info to request object
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT Verification Error Details:', {
                message: error.message,
                name: error.name,
                expiredAt: error.expiredAt,
                tokenReceived: token ? `${token.substring(0, 15)}...` : 'None',
                secretUsed: process.env.JWT_SECRET ? 'From ENV' : 'Fallback string'
            });

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired', isExpired: true });
            }

            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

/**
 * Middleware to restrict access to Admins only
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Administrators only' });
    }
};

module.exports = { protect, adminOnly };
