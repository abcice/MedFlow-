const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    cpr: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    phone: String,
    address: String,
    notes: String,
    paymentType: { type: String, enum: ['Cash', 'Insurance'], required: true },
    insuranceProvider: String, 

    records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PatientRecord' }],

    photo: { type: String, default: '/images/default-patient.png' },
    blacklisted: { type: Boolean, default: false }

}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
