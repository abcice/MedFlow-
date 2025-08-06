const mongoose = require('mongoose');

const referralLetterSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referredTo: { type: String, default: ''  },
    reason: { type: String, default: ''  },
    issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ReferralLetter', referralLetterSchema);
