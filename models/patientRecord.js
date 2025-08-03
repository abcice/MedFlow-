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
prescriptions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }
],
labRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Request' }
],
radiologyRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Request' }
]
, 
    privateNote: String // Only visible to the doctor who wrote it
}, { timestamps: true });

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

module.exports = PatientRecord;
