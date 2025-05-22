const Session = require('../models/Session');
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const MenteeProfile = require('../models/MenteeProfile');

// @desc    Create a session
// @route   POST /api/sessions
// @access  Private (Mentee or Mentor)
exports.createSession = async (req, res) => {
  try {
    req.body.creator = req.user.id;

    // Extract mentee ID from the authenticated user if not provided
    const { mentor: mentorId, title, description, date, duration, communicationType } = req.body;
    const menteeId = req.body.mentee || req.user.id; // Use provided mentee ID or default to the authenticated user

    // Validate mentor
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Validate mentee
    const mentee = await User.findById(menteeId);
    if (!mentee || mentee.role !== 'mentee') {
      return res.status(404).json({
        success: false,
        message: 'Mentee not found'
      });
    }

    // Create session
    const session = await Session.create({
      mentor: mentorId,
      mentee: menteeId,
      title,
      description,
      date,
      duration,
      communicationType,
      status: 'scheduled'
    });

    // Increment session counters
    await MentorProfile.findOneAndUpdate(
      { user: mentorId },
      { $inc: { sessions: 1 } }
    );
    
    await MenteeProfile.findOneAndUpdate(
      { user: menteeId },
      { $inc: { sessionsTaken: 1 } }
    );

    res.status(201).json({
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

// @desc    Get all sessions for logged in user
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
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
        message: 'Access denied'
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