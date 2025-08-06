const express = require('express');
const router = express.Router();
const multer = require('multer');
const Request = require('../../models/request');
const authDataController = require('../auth/dataController');

// Multer config for uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to check LabTech or Radiologist
function requireLabOrRadiologist(req, res, next) {
    if (!req.user || (req.user.role !== 'LabTech' && req.user.role !== 'Radiologist')) {
        return res.status(403).send('Only LabTech or Radiologist can perform this action.');
    }
    next();
}

/**
 * =============================
 * Choose Request Type
 * =============================
 */
router.get('/', authDataController.auth, (req, res) => {
    res.render('medicalRequests/ChooseType', {
        token: req.query.token
    });
});

/**
 * =============================
 * Lab Requests List + Search
 * =============================
 */
router.get('/lab', authDataController.auth, async (req, res) => {
    const { name, cpr, phone } = req.query;
    const query = { type: 'Lab' };

    if (name) query['patient.name'] = { $regex: name, $options: 'i' };
    if (cpr) query['patient.cpr'] = { $regex: cpr, $options: 'i' };
    if (phone) query['patient.phone'] = { $regex: phone, $options: 'i' };

    const requests = await Request.find(query)
        .populate('patient')
        .populate('doctor')
        .lean();

    res.render('medicalRequests/LabRequestsList', { 
        requests, 
        token: req.query.token 
    });
});

/**
 * =============================
 * Radiology Requests List + Search
 * =============================
 */
router.get('/radiology', authDataController.auth, async (req, res) => {
    const { name, cpr, phone } = req.query;
    const query = { type: 'Radiology' };

    if (name) query['patient.name'] = { $regex: name, $options: 'i' };
    if (cpr) query['patient.cpr'] = { $regex: cpr, $options: 'i' };
    if (phone) query['patient.phone'] = { $regex: phone, $options: 'i' };

    const requests = await Request.find(query)
        .populate('patient')
        .populate('doctor')
        .lean();

    res.render('medicalRequests/RadiologyRequestsList', { 
        requests, 
        token: req.query.token 
    });
});

/**
 * =============================
 * Lab Request Details
 * =============================
 */
router.get('/lab/:id', authDataController.auth, async (req, res) => {
    const request = await Request.findById(req.params.id)
        .populate('patient')
        .populate('doctor')
        .lean();

    if (!request) return res.status(404).send('Lab request not found');

    res.render('medicalRequests/LabRequestDetail', { 
        request, 
        userRole: req.user?.role || '',
        token: req.query.token
    });
});

/**
 * =============================
 * Radiology Request Details
 * =============================
 */
router.get('/radiology/:id', authDataController.auth, async (req, res) => {
    const request = await Request.findById(req.params.id)
        .populate('patient')
        .populate('doctor')
        .lean();

    if (!request) return res.status(404).send('Radiology request not found');

    res.render('medicalRequests/RadiologyRequestDetail', { 
        request, 
        userRole: req.user?.role || '',
        token: req.query.token
    });
});

/**
 * =============================
 * Update Lab Request (Only LabTech)
 * =============================
 */
router.post(
    '/lab/:id', 
    authDataController.auth, 
    requireLabOrRadiologist, 
    upload.array('resultFiles'), 
    async (req, res) => {
        const files = req.files.map(f => f.path);

        await Request.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            resultText: req.body.resultText || undefined,
            $push: { resultFiles: { $each: files } }
        });

        res.redirect(`/medicalRequests/lab?token=${req.query.token}`);
    }
);

/**
 * =============================
 * Update Radiology Request (Only Radiologist)
 * =============================
 */
router.post(
    '/radiology/:id', 
    authDataController.auth, 
    requireLabOrRadiologist, 
    upload.array('resultFiles'), 
    async (req, res) => {
        const files = req.files.map(f => f.path);

        await Request.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            $push: { resultFiles: { $each: files } }
        });

        res.redirect(`/medicalRequests/radiology?token=${req.query.token}`);
    }
);

module.exports = router;
