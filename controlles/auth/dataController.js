const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const VALID_ROLES = ['Admin', 'Doctor', 'FrontDesk', 'Pharmacist', 'LabTech', 'Radiologist'];

// ===== Auth Middleware  ===== 
exports.auth = async (req, res, next) => {
  try {
    let token;
    if (req.query.token) {
      token = req.query.token;
    } else if (req.header('Authorization')) {
      token = req.header('Authorization').replace('Bearer ', '');
    } else {
      throw new Error('No token provided');
    }

    const data = jwt.verify(token, 'secret'); 
    const user = await User.findById(data._id);
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send('Not authorized');
  }
};

// ===== Admin Check  =====
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).send('Admin access required');
  }
  next();
};

// ===== Create New User  =====
exports.createUser = async (req, res, next) => {
  try {
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
    res.locals.data = { token };
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===== Login =====
exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send('Invalid login credentials');
    }

    const token = await user.generateAuthToken();
    res.locals.data = { token };
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===== Update User (Admin Only) =====
exports.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===== Update User Role (Admin Only) =====
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).send('Invalid role');
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    user.role = role;
    await user.save();
    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===== Delete User (Admin Only) =====
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
