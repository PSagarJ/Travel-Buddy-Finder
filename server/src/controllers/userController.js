import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, travelStyle } = req.body;

    // 1. Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the new user in MongoDB
    const user = await User.create({
      name,
      email,
      password, // Note: We will add encryption (bcrypt) to this later!
      travelStyle
    });

    // 3. Send back a success response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      travelStyle: user.travelStyle,
      message: 'Welcome to the Travel Buddy Finder!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};