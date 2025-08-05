const express = require('express');
const router = express.Router();

const authDataController = require('../auth/dataController.js');
const dataController = require('./dataController.js');
const viewController = require('./viewController.js');

const Patient = require('../../models/patient');
const PatientRecord = require('../../models/patientRecord');
const Request = require('../../models/request');
const SickLeave = require('../../models/sickLeave');
const ReferralLetter = require('../../models/referralLetter');

// =============================
// Patient History
// =============================
router.get('/:patientId/history',
    authDataController.auth,
    dataController.showHistory,
    viewController.showHistory
);

// =============================
// List Patients
// =============================
router.get('/',
    authDataController.auth,
    dataController.listPatients,
    viewController.index
);

// =============================
// New Medical Record
// =============================
router.get('/:patientId/history/new',
    authDataController.auth,
    viewController.newView
);

// =============================
// Save New Record
// =============================
router.post('/',
    authDataController.auth,
    dataController.create,
    viewController.redirectToHistory
);

// =============================
// Edit Medical Record
// =============================
router.get('/:id/edit',
    authDataController.auth,
    dataController.showRecord,
    viewController.editView
);

// =============================
// Update Medical Record
// =============================
router.put('/:id',
    authDataController.auth,
    dataController.updateRecord,
    viewController.redirectToHistory
);

// =============================
// Blacklist Toggle
// =============================
router.put('/:id/blacklist', authDataController.auth, async (req, res) => {
    try {
        await Patient.findByIdAndUpdate(req.params.id, { blacklisted: req.body.blacklisted });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Save Draft & Redirect
// =============================
router.post('/saveDraft', authDataController.auth, async (req, res) => {
    try {
        let record;
        if (req.body.recordId) {
            record = await PatientRecord.findByIdAndUpdate(req.body.recordId, req.body, { new: true });
        } else {
            record = await PatientRecord.create(req.body);
        }

        const patientId = req.body.patient;
        const token = req.query.token;
        const action = req.body.action;

        if (['Lab', 'Radiology', 'SickLeave', 'ReferralLetter'].includes(action)) {
            return res.redirect(
                `/patientRecords/${patientId}/createItem?type=${action}&token=${token}&recordId=${record._id}`
            );
        }

        return res.redirect(`/patientRecords/${patientId}/history?token=${token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Unified /createItem
// =============================
router.get('/:patientId/createItem', authDataController.auth, async (req, res) => {
    try {
        const { type, token, recordId } = req.query;
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) return res.status(404).send('Patient not found');

        const doctor = req.user;
        if (!doctor || doctor.role !== 'Doctor') {
            return res.status(403).send('Only doctors can create items');
        }

        let newDoc;

        switch (type) {
            case 'Lab':
            case 'Radiology':
                newDoc = await Request.create({
                    patient: patient._id,
                    doctor: doctor._id,
                    type,
                    details: 'To be filled later'
                });
                return res.redirect(`/patientRecords/${patient._id}/editRequest/${newDoc._id}?token=${token}&recordId=${recordId}`);

            case 'SickLeave':
                newDoc = await SickLeave.create({
                    patient: patient._id,
                    doctor: doctor._id,
                    reason: 'To be filled later',
                    durationDays: 0
                });
                return res.redirect(`/patientRecords/${patient._id}/editSickLeave/${newDoc._id}?token=${token}&recordId=${recordId}`);

            case 'ReferralLetter':
                newDoc = await ReferralLetter.create({
                    patient: patient._id,
                    doctor: doctor._id,
                    referredTo: 'To be filled later',
                    reason: 'To be filled later'
                });
                return res.redirect(`/patientRecords/${patient._id}/editReferralLetter/${newDoc._id}?token=${token}&recordId=${recordId}`);

            default:
                return res.status(400).send('Invalid type');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Edit Lab/Radiology Request
// =============================
router.get('/:patientId/editRequest/:requestId', authDataController.auth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId).populate('patient');
        if (!request) return res.status(404).send('Request not found');

        res.render('patientRecords/EditRequest', {
            request,
            token: req.query.token,
            recordId: req.query.recordId
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:patientId/editRequest/:requestId', authDataController.auth, async (req, res) => {
    try {
        await Request.findByIdAndUpdate(req.params.requestId, req.body);
        res.redirect(`/patientRecords/${req.query.recordId}/edit?token=${req.query.token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Edit Sick Leave
// =============================
router.get('/:patientId/editSickLeave/:sickLeaveId', authDataController.auth, async (req, res) => {
    try {
        const sickLeave = await SickLeave.findById(req.params.sickLeaveId).populate('patient');
        if (!sickLeave) return res.status(404).send('Sick leave not found');

        res.render('patientRecords/EditSickLeave', {
            sickLeave,
            token: req.query.token,
            recordId: req.query.recordId
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:patientId/editSickLeave/:sickLeaveId', authDataController.auth, async (req, res) => {
    try {
        await SickLeave.findByIdAndUpdate(req.params.sickLeaveId, req.body);
        res.redirect(`/patientRecords/${req.query.recordId}/edit?token=${req.query.token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Edit Referral Letter
// =============================
router.get('/:patientId/editReferralLetter/:referralLetterId', authDataController.auth, async (req, res) => {
    try {
        const referralLetter = await ReferralLetter.findById(req.params.referralLetterId).populate('patient');
        if (!referralLetter) return res.status(404).send('Referral letter not found');

        res.render('patientRecords/EditReferralLetter', {
            referralLetter,
            token: req.query.token,
            recordId: req.query.recordId
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:patientId/editReferralLetter/:referralLetterId', authDataController.auth, async (req, res) => {
    try {
        await ReferralLetter.findByIdAndUpdate(req.params.referralLetterId, req.body);
        res.redirect(`/patientRecords/${req.query.recordId}/edit?token=${req.query.token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
