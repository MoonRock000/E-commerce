import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Register
export const signup = async (req, res, next) => {
  const { name, address, username, password } = req.body;
  try {
    const user = await User.create({ name, address, username, password });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = generateToken(user);
    res.status(200).json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};
