const mongoose = require('mongoose');

const sickLeaveSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    durationDays: { type: Number, required: false },
    additionalNotes: String
}, { timestamps: true });

// Automatically calculate endDate before saving
sickLeaveSchema.pre('validate', function(next) {
    if (this.startDate && this.durationDays) {
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + (this.durationDays - 1));
    }
    next();
});

const SickLeave = mongoose.model('SickLeave', sickLeaveSchema);
module.exports = SickLeave;
