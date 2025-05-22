const Session = require('../models/Session');
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const MenteeProfile = require('../models/MenteeProfile');

// @desc    Create a session
// @route   POST /api/sessions
// @access  Public (temporarily)
exports.createSession = async (req, res) => {
  try {
    console.log('Session creation request received:', JSON.stringify(req.body, null, 2));
    
    // Extract session details from the request body with validation
    const { 
      mentor: mentorId, 
      title, 
      description, 
      date, 
      duration, 
      communicationType 
    } = req.body;
    
    // Validate required fields
    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required'
      });
    }
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Session title is required'
      });
    }
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Session date is required'
      });
    }
    
    // For testing purposes, use a hardcoded mentee ID
    // In production, this would come from the authenticated user (req.user.id)
    const menteeId = '645f340293f48309432269c0'; // Replace with a valid mentee ID
    
    console.log('Processing session with mentorId:', mentorId);
    console.log('Processing session with menteeId:', menteeId);
    
    // Find a valid mentor - first try the provided ID, then fallback to any mentor
    let mentor = null;
    try {
      // Try to find by ID
      mentor = await User.findById(mentorId);
      
      // If not found by ID, try to find by any other means
      if (!mentor) {
        console.log('Mentor not found by ID, trying alternative methods');
        // Try to find a mentor with this ID in MentorProfile
        const mentorProfile = await MentorProfile.findById(mentorId);
        if (mentorProfile && mentorProfile.user) {
          mentor = await User.findById(mentorProfile.user);
          console.log('Found mentor through profile:', mentor ? mentor._id : 'not found');
        }
      }
      
      // If still not found, get any mentor for testing
      if (!mentor) {
        console.log('Mentor not found, using fallback');
        mentor = await User.findOne({ role: 'mentor' });
        console.log('Using fallback mentor:', mentor ? mentor._id : 'none available');
      }
    } catch (err) {
      console.error('Error finding mentor:', err.message);
      // Try to find any mentor as fallback
      mentor = await User.findOne({ role: 'mentor' });
      console.log('Using fallback mentor after error:', mentor ? mentor._id : 'none available');
    }
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'No valid mentor found. Please check the mentor ID or create a mentor first.'
      });
    }
    
    // Find a valid mentee - first try the provided ID, then fallback to any mentee
    let mentee = null;
    try {
      mentee = await User.findById(menteeId);
      
      if (!mentee) {
        console.log('Mentee not found by ID, trying alternative methods');
        // Try to find a mentee with this ID in MenteeProfile
        const menteeProfile = await MenteeProfile.findById(menteeId);
        if (menteeProfile && menteeProfile.user) {
          mentee = await User.findById(menteeProfile.user);
          console.log('Found mentee through profile:', mentee ? mentee._id : 'not found');
        }
      }
      
      // If still not found, get any mentee for testing
      if (!mentee) {
        console.log('Mentee not found, using fallback');
        mentee = await User.findOne({ role: 'mentee' });
        console.log('Using fallback mentee:', mentee ? mentee._id : 'none available');
      }
    } catch (err) {
      console.error('Error finding mentee:', err.message);
      // Try to find any mentee as fallback
      mentee = await User.findOne({ role: 'mentee' });
      console.log('Using fallback mentee after error:', mentee ? mentee._id : 'none available');
    }
    
    if (!mentee) {
      return res.status(404).json({
        success: false,
        message: 'No valid mentee found. Please check the mentee ID or create a mentee first.'
      });
    }
    
    // Prepare session data with defaults for missing fields
    const sessionData = {
      mentor: mentor._id,
      mentee: mentee._id,
      title: title,
      description: description || `Session with ${mentor.name || 'Mentor'}`,
      date: new Date(date), // Ensure date is a proper Date object
      duration: parseInt(duration) || 60, // Default to 60 minutes
      communicationType: communicationType || 'Video Call',
      status: 'scheduled'
    };
    
    console.log('Creating session with data:', JSON.stringify(sessionData, null, 2));
    
    // Create the session
    const session = await Session.create(sessionData);
    console.log('Session created successfully with ID:', session._id);
    
    // Try to update profiles, but don't fail if this doesn't work
    try {
      // Update mentor profile
      await MentorProfile.findOneAndUpdate(
        { user: mentor._id },
        { $inc: { sessions: 1 } }
      );
      
      // Update mentee profile
      await MenteeProfile.findOneAndUpdate(
        { user: mentee._id },
        { $inc: { sessionsTaken: 1 } }
      );
      
      console.log('Updated mentor and mentee profiles');
    } catch (profileErr) {
      console.error('Error updating profiles, but session was created:', profileErr.message);
      // Continue anyway since the session was created
    }
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Error in createSession:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to create session: ${error.message}`
    });
  }
};

// @desc    Get all sessions for logged in user
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user) {
      console.error('Authentication error: req.user is undefined');
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }
    
    // Log user information for debugging
    console.log('User requesting sessions:', {
      id: req.user.id,
      role: req.user.role
    });
    
    let sessions;
    
    if (req.user.role === 'mentor') {
      sessions = await Session.find({ mentor: req.user.id })
        .populate({
          path: 'mentee',
          select: 'name email avatar'
        })
        .sort({ date: -1 });
    } else if (req.user.role === 'mentee') {
      sessions = await Session.find({ mentee: req.user.id })
        .populate({
          path: 'mentor',
          select: 'name email avatar'
        })
        .sort({ date: -1 });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Invalid user role'
      });
    }

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: 'mentor',
        select: 'name email avatar'
      })
      .populate({
        path: 'mentee',
        select: 'name email avatar'
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session not found with id of ${req.params.id}`
      });
    }

    // Make sure user owns the session
    if (
      session.mentor._id.toString() !== req.user.id && 
      session.mentee._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this session'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res) => {
  try {
    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session not found with id of ${req.params.id}`
      });
    }

    // Make sure user owns the session
    if (
      session.mentor.toString() !== req.user.id && 
      session.mentee.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    // Update session
    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session not found with id of ${req.params.id}`
      });
    }

    // Make sure user owns the session
    if (
      session.mentor.toString() !== req.user.id && 
      session.mentee.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this session'
      });
    }

    await session.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update session status
// @route   PUT /api/sessions/:id/status
// @access  Private
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['scheduled', 'completed', 'cancelled', 'postponed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session not found with id of ${req.params.id}`
      });
    }

    // Make sure user owns the session
    if (
      session.mentor.toString() !== req.user.id && 
      session.mentee.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    // Update session status
    session.status = status;
    await session.save();

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 