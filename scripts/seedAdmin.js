require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
    const username = 'admin';
    const password = 'Admin123'; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ username });
    if (existing) {
        console.log('Admin already exists');
        process.exit();
    }

    await User.create({
        username,
        password: hashedPassword,
        role: 'Admin',
        name: 'System Administrator'
    });

    console.log(' Admin account created:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    process.exit();
}

createAdmin();
