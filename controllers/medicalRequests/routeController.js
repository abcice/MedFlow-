const express = require('express');
const router = express.Router();
const multer = require('multer');
const authDataController = require('../auth/dataController.js');
const Request = require('../../models/request');
const Patient = require('../../models/patient');
const SickLeave = require('../../models/sickLeave');
const ReferralLetter = require('../../models/referralLetter');

const upload = multer({ dest: 'uploads/' });

// Role middlewares
function requireLabOrRadiologist(req, res, next) {
    if (req.user.role !== 'LabTech' && req.user.role !== 'Radiologist') {
        return res.status(403).send('Only LabTech or Radiologist can perform this action.');
    }
    next();
}
function requireDoctor(req, res, next) {
    if (req.user.role !== 'Doctor') {
        return res.status(403).send('Only Doctors can delete.');
    }
    next();
}

// =============================
// Requests Management Landing
// =============================
router.get('/', authDataController.auth, (req, res) => {
    res.render('medicalRequests/ChooseType', { token: req.query.token });
});

// =============================
// Autocomplete Search Suggestions
// =============================
router.get('/searchSuggestions', authDataController.auth, async (req, res) => {
    const { field, query } = req.query;
    if (!['name', 'cpr', 'phone'].includes(field)) {
        return res.status(400).json({ error: 'Invalid field' });
    }
    const patients = await Patient.find({
        [field]: { $regex: '^' + query, $options: 'i' }
    }).limit(10).select(field).lean();
    res.json(patients.map(p => p[field]));
});

// =============================
// Lab Requests List + Search
// =============================
router.get('/lab', authDataController.auth, async (req, res) => {
    const { name, cpr, phone, token } = req.query;
    let requests = [];
    if (name || cpr || phone) {
        const patientMatch = {};
        if (name) patientMatch['patient.name'] = { $regex: '^' + name, $options: 'i' };
        if (cpr) patientMatch['patient.cpr'] = { $regex: '^' + cpr, $options: 'i' };
        if (phone) patientMatch['patient.phone'] = { $regex: '^' + phone, $options: 'i' };

        requests = await Request.aggregate([
            { $match: { type: 'Lab' } },
            { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patient' } },
            { $unwind: '$patient' },
            { $lookup: { from: 'users', localField: 'doctor', foreignField: '_id', as: 'doctor' } },
            { $unwind: '$doctor' },
            { $match: patientMatch }
        ]);
    }
    res.render('medicalRequests/LabRequestsList', { requests, token, userRole: req.user.role });
});

// =============================
// Radiology Requests List + Search
// =============================
router.get('/radiology', authDataController.auth, async (req, res) => {
    const { name, cpr, phone, token } = req.query;
    let requests = [];
    if (name || cpr || phone) {
        const patientMatch = {};
        if (name) patientMatch['patient.name'] = { $regex: '^' + name, $options: 'i' };
        if (cpr) patientMatch['patient.cpr'] = { $regex: '^' + cpr, $options: 'i' };
        if (phone) patientMatch['patient.phone'] = { $regex: '^' + phone, $options: 'i' };

        requests = await Request.aggregate([
            { $match: { type: 'Radiology' } },
            { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patient' } },
            { $unwind: '$patient' },
            { $lookup: { from: 'users', localField: 'doctor', foreignField: '_id', as: 'doctor' } },
            { $unwind: '$doctor' },
            { $match: patientMatch }
        ]);
    }
    res.render('medicalRequests/RadiologyRequestsList', { requests, token, userRole: req.user.role });
});

// =============================
// Sick Leaves List + Search
// =============================
router.get('/sickLeaves', authDataController.auth, async (req, res) => {
    const { name, cpr, phone, token } = req.query;
    let sickLeaves = [];
    if (name || cpr || phone) {
        const patientMatch = {};
        if (name) patientMatch['patient.name'] = { $regex: '^' + name, $options: 'i' };
        if (cpr) patientMatch['patient.cpr'] = { $regex: '^' + cpr, $options: 'i' };
        if (phone) patientMatch['patient.phone'] = { $regex: '^' + phone, $options: 'i' };

        sickLeaves = await SickLeave.aggregate([
            { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patient' } },
            { $unwind: '$patient' },
            { $lookup: { from: 'users', localField: 'doctor', foreignField: '_id', as: 'doctor' } },
            { $unwind: '$doctor' },
            { $match: patientMatch }
        ]);
    }
    res.render('medicalRequests/SickLeavesList', { sickLeaves, token, userRole: req.user.role });
});

// =============================
// Referral Letters List + Search
// =============================
router.get('/referralLetters', authDataController.auth, async (req, res) => {
    const { name, cpr, phone, token } = req.query;
    let referralLetters = [];
    if (name || cpr || phone) {
        const patientMatch = {};
        if (name) patientMatch['patient.name'] = { $regex: '^' + name, $options: 'i' };
        if (cpr) patientMatch['patient.cpr'] = { $regex: '^' + cpr, $options: 'i' };
        if (phone) patientMatch['patient.phone'] = { $regex: '^' + phone, $options: 'i' };

        referralLetters = await ReferralLetter.aggregate([
            { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patient' } },
            { $unwind: '$patient' },
            { $lookup: { from: 'users', localField: 'doctor', foreignField: '_id', as: 'doctor' } },
            { $unwind: '$doctor' },
            { $match: patientMatch }
        ]);
    }
    res.render('medicalRequests/ReferralLettersList', { referralLetters, token, userRole: req.user.role });
});

// =============================
// View & Delete Sick Leaves
// =============================
router.get('/sickLeaves/:id', authDataController.auth, async (req, res) => {
    const sickLeave = await SickLeave.findById(req.params.id).populate('patient').populate('doctor').lean();
    if (!sickLeave) return res.status(404).send('Sick leave not found');
    res.render('medicalRequests/SickLeaveDetail', { sickLeave, token: req.query.token });
});
router.delete('/sickLeaves/:id', authDataController.auth, requireDoctor, async (req, res) => {
    await SickLeave.findByIdAndDelete(req.params.id);
    res.redirect(`/medicalRequests/sickLeaves?token=${req.query.token}`);
});

// =============================
// View & Delete Referral Letters
// =============================
router.get('/referralLetters/:id', authDataController.auth, async (req, res) => {
    const letter = await ReferralLetter.findById(req.params.id).populate('patient').populate('doctor').lean();
    if (!letter) return res.status(404).send('Referral letter not found');
    res.render('medicalRequests/ReferralLetterDetail', { letter, token: req.query.token });
});
router.delete('/referralLetters/:id', authDataController.auth, requireDoctor, async (req, res) => {
    await ReferralLetter.findByIdAndDelete(req.params.id);
    res.redirect(`/medicalRequests/referralLetters?token=${req.query.token}`);
});

// =============================
// Delete Lab/Radiology Requests
// =============================
router.delete('/lab/:id', authDataController.auth, requireDoctor, async (req, res) => {
    await Request.findByIdAndDelete(req.params.id);
    res.redirect(`/medicalRequests/lab?token=${req.query.token}`);
});
router.delete('/radiology/:id', authDataController.auth, requireDoctor, async (req, res) => {
    await Request.findByIdAndDelete(req.params.id);
    res.redirect(`/medicalRequests/radiology?token=${req.query.token}`);
});

module.exports = router;
