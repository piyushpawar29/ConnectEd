const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  
  console.log('Auth middleware - checking authorization header');
  
  // Debug request headers
  console.log('Request headers:', {
    auth: req.headers.authorization ? `${req.headers.authorization.substring(0, 15)}...` : 'none',
    contentType: req.headers['content-type'],
    cookies: req.cookies ? 'present' : 'none'
  });

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted from Authorization header');
  } else if (req.cookies?.token) {
    // Set token from cookie
    token = req.cookies.token;
    console.log('Token extracted from cookies');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - no token provided'
    });
  }

  try {
    console.log('Verifying JWT token...');
    
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully, decoded payload:', { id: decoded.id });

    // Get user from the token
    const user = await User.findById(decoded.id);
    console.log('User lookup result:', user ? 'Found' : 'Not found');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or invalid token'
      });
    }
    
    // Set the user object on the request
    req.user = user;
    console.log('User authenticated successfully:', { id: user.id, role: user.role });

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: `Authentication failed: ${error.message}`
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
}; 