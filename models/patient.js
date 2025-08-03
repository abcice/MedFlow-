const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    cpr: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: String,
    address: String,
    notes: String
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
