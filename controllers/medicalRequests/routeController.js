const express = require('express');
const router = express.Router();
const multer = require('multer');
const puppeteer = require('puppeteer');
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
// Puppeteer PDF - Sick Leave
// =============================
router.get('/sickLeaves/:id/pdf', authDataController.auth, async (req, res) => {
    try {
        const sickLeave = await SickLeave.findById(req.params.id)
            .populate('patient')
            .populate('doctor')
            .lean();
        if (!sickLeave) return res.status(404).send('Sick leave not found');

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(`
            <html>
            <head><title>Sick Leave</title></head>
            <body style="font-family: Arial; padding: 20px;">
                <h2 style="text-align:center;">Medical Certificate</h2>
                <p><b>Full Name:</b> ${sickLeave.patient.name}</p>
                <p><b>CPR / ID:</b> ${sickLeave.patient.cpr}</p>
                <p><b>Diagnosis:</b> ${sickLeave.reason}</p>
                <p><b>From:</b> ${sickLeave.startDate || '-'} <b>To:</b> ${sickLeave.endDate || '-'}</p>
                <p><b>Total Days:</b> ${sickLeave.durationDays}</p>
                <br/>
                <p><b>Physician:</b> Dr. ${sickLeave.doctor.name}</p>
            </body>
            </html>
        `);

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        res.contentType("application/pdf");
        res.setHeader('Content-Disposition', 'attachment; filename="SickLeave.pdf"');
        res.send(pdfBuffer);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Puppeteer PDF - Referral Letter
// =============================
router.get('/referralLetters/:id/pdf', authDataController.auth, async (req, res) => {
    try {
        const letter = await ReferralLetter.findById(req.params.id)
            .populate('patient')
            .populate('doctor')
            .lean();
        if (!letter) return res.status(404).send('Referral letter not found');

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(`
            <html>
            <head><title>Referral Letter</title></head>
            <body style="font-family: Arial; padding: 20px;">
                <h2 style="text-align:center;">Referral Letter</h2>
                <p><b>Patient Name:</b> ${letter.patient.name}</p>
                <p><b>CPR / ID:</b> ${letter.patient.cpr}</p>
                <p><b>Reason:</b> ${letter.reason}</p>
                <p><b>Referring Doctor:</b> Dr. ${letter.doctor.name}</p>
            </body>
            </html>
        `);

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        res.contentType("application/pdf");
        res.setHeader('Content-Disposition', 'attachment; filename="ReferralLetter.pdf"');
        res.send(pdfBuffer);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// =============================
// OFFICIAL VIEW ROUTES
// =============================

// Official Sick Leave View
router.get('/sickLeaves/:id/official', authDataController.auth, async (req, res) => {
    const sickLeave = await SickLeave.findById(req.params.id)
        .populate('patient')
        .populate('doctor')
        .lean();
    if (!sickLeave) return res.status(404).send('Sick leave not found');
    res.render('medicalRequests/SickLeaveOfficial', { sickLeave, token: req.query.token, userRole: req.user.role });
});

// Official Referral Letter View
router.get('/referralLetters/:id/official', authDataController.auth, async (req, res) => {
    const letter = await ReferralLetter.findById(req.params.id)
        .populate('patient')
        .populate('doctor')
        .lean();
    if (!letter) return res.status(404).send('Referral letter not found');
    res.render('medicalRequests/ReferralLetterOfficial', { letter, token: req.query.token, userRole: req.user.role });
});
//====view lab request details
router.get('/lab/:id', authDataController.auth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('patient')
            .populate('doctor')
            .lean();
        if (!request || request.type !== 'Lab') return res.status(404).send('Lab request not found');
        res.render('medicalRequests/LabRequestDetail', { request, token: req.query.token });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//====view radiology request details
router.get('/radiology/:id', authDataController.auth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('patient')
            .populate('doctor')
            .lean();
        if (!request || request.type !== 'Radiology') return res.status(404).send('Radiology request not found');
        res.render('medicalRequests/RadiologyRequestDetail', { request, token: req.query.token });
    } catch (err) {
        res.status(500).send(err.message);
    }
});



module.exports = router;
