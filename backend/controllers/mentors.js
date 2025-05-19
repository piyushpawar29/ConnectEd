const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const Review = require('../models/Review');

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
exports.getMentors = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'query'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Find mentor users
    const mentorUsers = await User.find({ role: 'mentor' });
    const mentorIds = mentorUsers.map(user => user._id);

    // Finding resource
    let query = MentorProfile.find({ user: { $in: mentorIds } })
      .populate({
        path: 'user',
        select: 'name email avatar'
      });

    // Filter by text search
    if (req.query.query) {
      const searchRegex = new RegExp(req.query.query, 'i');
      
      // Find users matching the query
      const matchingUsers = await User.find({
        role: 'mentor',
        $or: [
          { name: searchRegex }
        ]
      });
      
      const matchingUserIds = matchingUsers.map(user => user._id);
      
      // Add to query
      query = query.find({
        $or: [
          { user: { $in: matchingUserIds } },
          { 'expertise': { $in: [searchRegex] } },
          { 'company': searchRegex },
          { 'category': searchRegex }
        ]
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-rating');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await MentorProfile.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const mentors = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: mentors.length,
      pagination,
      data: mentors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single mentor
// @route   GET /api/mentors/:id
// @access  Public
exports.getMentor = async (req, res) => {
  try {
    const mentor = await MentorProfile.findById(req.params.id).populate({
      path: 'user',
      select: 'name email avatar'
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: `Mentor not found with id of ${req.params.id}`
      });
    }

    // Get reviews for this mentor
    const reviews = await Review.find({ mentor: mentor.user._id })
      .populate({
        path: 'mentee',
        select: 'name avatar'
      });

    res.status(200).json({
      success: true,
      data: { mentor, reviews }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update mentor profile
// @route   PUT /api/mentors/profile
// @access  Private (Mentor only)
exports.updateMentorProfile = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOne({ user: req.user.id });

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    // Fields to update
    const fieldsToUpdate = {
      company: req.body.company || mentorProfile.company,
      hourlyRate: req.body.hourlyRate || mentorProfile.hourlyRate,
      expertise: req.body.expertise || mentorProfile.expertise,
      languages: req.body.languages || mentorProfile.languages,
      experience: req.body.experience || mentorProfile.experience,
      availability: req.body.availability || mentorProfile.availability,
      category: req.body.category || mentorProfile.category,
      communicationPreference: req.body.communicationPreference || mentorProfile.communicationPreference,
      socials: req.body.socials || mentorProfile.socials
    };

    // Update user bio if provided
    if (req.body.bio) {
      await User.findByIdAndUpdate(req.user.id, { bio: req.body.bio });
    }

    const updatedProfile = await MentorProfile.findOneAndUpdate(
      { user: req.user.id },
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get mentor profile for logged in user
// @route   GET /api/mentors/profile
// @access  Private (Mentor only)
exports.getMentorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const mentorProfile = await MentorProfile.findOne({ user: req.user.id });

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio
        },
        profile: mentorProfile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 