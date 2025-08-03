const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const VALID_ROLES = ['Doctor', 'FrontDesk', 'Pharmacist', 'LabTech', 'Radiologist', 'Admin'];

// API Authentication middleware 
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, 'secret');
    const user = await User.findOne({ _id: data._id });
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send('Not authorized');
  }
};

// API Create user
exports.createUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.name) {
      return res.status(400).json({ message: 'Name, username, and password are required' });
    }

    let chosenRole = req.body.role;
    if (!VALID_ROLES.includes(chosenRole) || chosenRole === 'Admin') {
      chosenRole = 'FrontDesk';
    }

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      role: chosenRole
    });

    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// API Login
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// API Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// API Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// API Get profile (logged-in user)
exports.getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
