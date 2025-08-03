const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    },
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    visitDate: { 
        type: Date, 
        default: Date.now 
    },
    complaint: String,
    examination: String,
    diagnosis: String,
    treatmentPlan: String,
    prescriptions: [String], // Can later be linked to a Prescription model
    labRequests: [String],   // Can later be linked to a LabRequest model
    radiologyRequests: [String], // Can later be linked to a RadiologyRequest model
    privateNote: String // Only visible to the doctor who wrote it
}, { timestamps: true });

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

module.exports = PatientRecord;
