const mongoose = require('mongoose');

const referralLetterSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referredTo: { type: String, required: true },
    reason: { type: String, required: true },
    issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ReferralLetter', referralLetterSchema);
