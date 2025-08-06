const express = require('express');
const router = express.Router();
const multer = require('multer');
const authDataController = require('../auth/dataController.js');
const Request = require('../../models/request');
const Patient = require('../../models/patient');

// Multer config for uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to check LabTech or Radiologist
function requireLabOrRadiologist(req, res, next) {
    if (req.user.role !== 'LabTech' && req.user.role !== 'Radiologist') {
        return res.status(403).send('Only LabTech or Radiologist can perform this action.');
    }
    next();
}

// =============================
// Choose Request Type
// =============================
router.get('/', authDataController.auth, (req, res) => {
    res.render('medicalRequests/ChooseType', {
        token: req.query.token
    });
});

// =============================
// Search Suggestions (Autocomplete)
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

    const patientMatch = {};
    if (name) patientMatch['patient.name'] = { $regex: '^' + name, $options: 'i' };
    if (cpr) patientMatch['patient.cpr'] = { $regex: '^' + cpr, $options: 'i' };
    if (phone) patientMatch['patient.phone'] = { $regex: '^' + phone, $options: 'i' };

    const requests = await Request.aggregate([
        { $match: { type: 'Lab' } },
        {
            $lookup: {
                from: 'patients',
                localField: 'patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        { $unwind: '$patient' },
        {
            $lookup: {
                from: 'users',
                localField: 'doctor',
                foreignField: '_id',
                as: 'doctor'
            }
        },
        { $unwind: '$doctor' },
        { $match: patientMatch }
    ]);

    res.render('medicalRequests/LabRequestsList', { requests, token });
});

// =============================
// Radiology Requests List + Search
// =============================
router.get('/radiology', authDataController.auth, async (req, res) => {
    const { name, cpr, phone, token } = req.query;

    const patientMatch = {};
    if (name) patientMatch['patient.name'] = { $regex: '^' + name, $options: 'i' };
    if (cpr) patientMatch['patient.cpr'] = { $regex: '^' + cpr, $options: 'i' };
    if (phone) patientMatch['patient.phone'] = { $regex: '^' + phone, $options: 'i' };

    const requests = await Request.aggregate([
        { $match: { type: 'Radiology' } },
        {
            $lookup: {
                from: 'patients',
                localField: 'patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        { $unwind: '$patient' },
        {
            $lookup: {
                from: 'users',
                localField: 'doctor',
                foreignField: '_id',
                as: 'doctor'
            }
        },
        { $unwind: '$doctor' },
        { $match: patientMatch }
    ]);

    res.render('medicalRequests/RadiologyRequestsList', { requests, token });
});

// =============================
// Request Details
// =============================
router.get('/lab/:id', authDataController.auth, async (req, res) => {
    const request = await Request.findById(req.params.id)
        .populate('patient')
        .populate('doctor')
        .lean();
    res.render('medicalRequests/LabRequestDetail', { request, userRole: req.user.role, token: req.query.token });
});

router.get('/radiology/:id', authDataController.auth, async (req, res) => {
    const request = await Request.findById(req.params.id)
        .populate('patient')
        .populate('doctor')
        .lean();
    res.render('medicalRequests/RadiologyRequestDetail', { request, userRole: req.user.role, token: req.query.token });
});

// =============================
// Update Requests (Lab & Radiology)
// =============================
router.post('/lab/:id', authDataController.auth, requireLabOrRadiologist, upload.array('resultFiles'), async (req, res) => {
    const files = req.files.map(f => f.path);
    await Request.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
        resultText: req.body.resultText || undefined,
        $push: { resultFiles: { $each: files } }
    });
    res.redirect(`/medicalRequests/lab?token=${req.query.token}`);
});

router.post('/radiology/:id', authDataController.auth, requireLabOrRadiologist, upload.array('resultFiles'), async (req, res) => {
    const files = req.files.map(f => f.path);
    await Request.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
        $push: { resultFiles: { $each: files } }
    });
    res.redirect(`/medicalRequests/radiology?token=${req.query.token}`);
});

module.exports = router;
