// models/referralLetter.js
const mongoose = require('mongoose');

const referralLetterSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientRecord' },
    
    referredTo: { type: String, default: '' },
    specialty: { type: String, default: '' },
    facility: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },

    reason: { type: String, default: '' },
    clinicalSummary: { type: String, default: '' },
    diagnosis: { type: String, default: '' },
    tests: { type: String, default: '' },

    licenseNumber: { type: String, default: '' },
    clinicName: { type: String, default: '' },

    issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ReferralLetter', referralLetterSchema);
