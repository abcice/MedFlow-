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
const moment = require('moment');

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
router.put('/:id/blacklist',
    authDataController.auth,
    async (req, res) => {
        try {
            await Patient.findByIdAndUpdate(req.params.id, { blacklisted: req.body.blacklisted });
            res.sendStatus(200);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
);

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

        // --- Save prescription if provided ---
        if (req.body.drugName) {
            const Prescription = require('../../models/prescription');
            const prescription = await Prescription.create({
                patient: req.body.patient, // Required field
                doctor: req.user._id,      // Required field
                drugs: [{
                    name: req.body.drugName,
                    dose: req.body.dose,
                    route: req.body.route,
                    frequency: req.body.frequency,
                    duration: req.body.duration
                }],
                notes: req.body.notes
            });

            // Link to record if not already linked
            if (!record.prescriptions.includes(prescription._id)) {
                record.prescriptions.push(prescription._id);
                await record.save();
            }
        }

        const patientId = req.body.patient;
        const token = req.query.token;
        const action = req.body.action;

        const quickActions = {
            'Lab': `/patientRecords/${patientId}/createItem?type=Lab&token=${token}&recordId=${record._id}`,
            'Radiology': `/patientRecords/${patientId}/createItem?type=Radiology&token=${token}&recordId=${record._id}`,
            'SickLeave': `/patientRecords/${patientId}/createItem?type=SickLeave&token=${token}&recordId=${record._id}`,
            'ReferralLetter': `/patientRecords/${patientId}/createItem?type=ReferralLetter&token=${token}&recordId=${record._id}`,
            'Favorites': `/patientRecords/${record._id}/favorites?token=${token}`
        };

        if (quickActions[action]) {
            return res.redirect(quickActions[action]);
        }

        return res.redirect(`/patientRecords/${patientId}/history?token=${token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// =============================
// Unified /createItem
// =============================
// =============================
// Unified /createItem
// =============================
router.get('/:patientId/createItem', authDataController.auth, async (req, res) => {
    try {
        const { type, token, recordId } = req.query;
        const prescriptionParams = new URLSearchParams({
            token,
            drugName: req.query.drugName || '',
            dose: req.query.dose || '',
            route: req.query.route || '',
            frequency: req.query.frequency || '',
            duration: req.query.duration || '',
            notes: req.query.notes || ''
        }).toString();

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
                    type
                    // no "details" filled here, leave it empty
                });
                return res.redirect(`/patientRecords/${patient._id}/editRequest/${newDoc._id}?recordId=${recordId}&${prescriptionParams}`);

            case 'SickLeave':
                newDoc = await SickLeave.create({
                    patient: patient._id,
                    doctor: doctor._id
                    // no reason or durationDays yet
                });
                return res.redirect(`/patientRecords/${patient._id}/editSickLeave/${newDoc._id}?recordId=${recordId}&${prescriptionParams}`);

            case 'ReferralLetter':
                newDoc = await ReferralLetter.create({
                    patient: patient._id,
                    doctor: doctor._id
                    // no referredTo or reason yet
                });
                return res.redirect(`/patientRecords/${patient._id}/editReferralLetter/${newDoc._id}?recordId=${recordId}&${prescriptionParams}`);

            default:
                return res.status(400).send('Invalid type');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// =============================
// GET Edit Lab/Radiology Request
// =============================
router.get('/:patientId/editRequest/:requestId', authDataController.auth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId).populate('patient');
        if (!request) return res.status(404).send('Request not found');

        res.render('patientRecords/EditRequest', {
            request,
            token: req.query.token,
            recordId: req.query.recordId, // ✅ pass this to the view
            prescriptionData: {
                drugName: req.query.drugName || '',
                dose: req.query.dose || '',
                route: req.query.route || '',
                frequency: req.query.frequency || '',
                duration: req.query.duration || '',
                notes: req.query.notes || ''
            }
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.post('/:patientId/editRequest/:requestId', authDataController.auth, async (req, res) => {
    try {
        await Request.findByIdAndUpdate(req.params.requestId, req.body);
        const prescriptionParams = new URLSearchParams({
            token: req.query.token,
            drugName: req.query.drugName || '',
            dose: req.query.dose || '',
            route: req.query.route || '',
            frequency: req.query.frequency || '',
            duration: req.query.duration || '',
            notes: req.query.notes || ''
        }).toString();
        res.redirect(`/patientRecords/${req.query.recordId}/edit?${prescriptionParams}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// GET Edit Sick Leave
// =============================
router.get('/:patientId/editSickLeave/:sickLeaveId', authDataController.auth, async (req, res) => {
    try {
        const sickLeave = await SickLeave.findById(req.params.sickLeaveId).populate('patient');
        if (!sickLeave) return res.status(404).send('Sick leave not found');

        const latestRecord = await PatientRecord.findOne({ patient: sickLeave.patient._id }).sort({ createdAt: -1 }).lean();



        if (!sickLeave) return res.status(404).send('Sick leave not found');

            res.render('patientRecords/EditSickLeave', {
        sickLeave,
        token: req.query.token,
        recordId: req.query.recordId,  // <== THIS LINE IS CRITICAL
        latestDiagnosis: latestRecord?.diagnosis || '',
        currentUser: req.user
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.post('/:patientId/editSickLeave/:sickLeaveId', authDataController.auth, async (req, res) => {
    try {
        const recordId = req.body.recordId || req.query.recordId;

        await SickLeave.findByIdAndUpdate(req.params.sickLeaveId, req.body);
        const prescriptionParams = new URLSearchParams({
            token: req.query.token,
            drugName: req.query.drugName || '',
            dose: req.query.dose || '',
            route: req.query.route || '',
            frequency: req.query.frequency || '',
            duration: req.query.duration || '',
            notes: req.query.notes || ''
        }).toString();
if (!recordId) {
  return res.status(400).send("Missing recordId in query parameters.");
}

res.redirect(`/patientRecords/${recordId}/edit?${prescriptionParams}`);    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// GET Edit Referral Letter
// =============================
router.get('/:patientId/editReferralLetter/:referralLetterId', authDataController.auth, async (req, res) => {
    try {
        const referralLetter = await ReferralLetter.findById(req.params.referralLetterId).populate('patient');
        if (!referralLetter) return res.status(404).send('Referral letter not found');

        res.render('patientRecords/EditReferralLetter', {
            referralLetter,
            token: req.query.token,
            recordId: req.query.recordId,
            prescriptionData: {
                drugName: req.query.drugName || '',
                dose: req.query.dose || '',
                route: req.query.route || '',
                frequency: req.query.frequency || '',
                duration: req.query.duration || '',
                notes: req.query.notes || ''
            }
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:patientId/editReferralLetter/:referralLetterId', authDataController.auth, async (req, res) => {
    try {
        await ReferralLetter.findByIdAndUpdate(req.params.referralLetterId, req.body);

        const recordId = req.query.recordId || req.body.recordId;
        if (!recordId) return res.status(400).send("Missing recordId in request.");

        const prescriptionParams = new URLSearchParams({
            token: req.query.token,
            drugName: req.query.drugName || '',
            dose: req.query.dose || '',
            route: req.query.route || '',
            frequency: req.query.frequency || '',
            duration: req.query.duration || '',
            notes: req.query.notes || ''
        }).toString();

        res.redirect(`/patientRecords/${recordId}/edit?${prescriptionParams}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// =============================
// Favorites
// =============================
router.get('/:recordId/favorites', authDataController.auth, async (req, res) => {
    const FavoritePrescription = require('../../models/favoritePrescription');
    const favorites = await FavoritePrescription.find({ doctor: req.user._id }).lean();
    res.render('patientRecords/Favorites', {
        favorites,
        token: req.query.token,
        recordId: req.params.recordId
    });
});

router.post('/:recordId/favorites', authDataController.auth, async (req, res) => {
    const FavoritePrescription = require('../../models/favoritePrescription');
    await FavoritePrescription.create({
        doctor: req.user._id,
        name: req.body.name,
        drugs: [{
            drugName: req.body.drugName,
            dose: req.body.dose,
            route: req.body.route,
            frequency: req.body.frequency,
            duration: req.body.duration,
            notes: req.body.notes
        }]
    });
    res.redirect(`/patientRecords/${req.params.recordId}/favorites?token=${req.query.token}`);
});

router.post('/:recordId/useFavorite/:favId', authDataController.auth, async (req, res) => {
    const FavoritePrescription = require('../../models/favoritePrescription');
    const fav = await FavoritePrescription.findById(req.params.favId).lean();
    if (!fav) return res.status(404).send('Favorite not found');

    const params = new URLSearchParams({
        token: req.query.token,
        drugName: fav.drugs[0]?.drugName || '',
        dose: fav.drugs[0]?.dose || '',
        route: fav.drugs[0]?.route || '',
        frequency: fav.drugs[0]?.frequency || '',
        duration: fav.drugs[0]?.duration || '',
        notes: fav.drugs[0]?.notes || ''
    }).toString();

    res.redirect(`/patientRecords/${req.params.recordId}/edit?${params}`);
});
// =============================
// Delete Lab/Radiology Request
// =============================
router.delete('/:patientId/deleteRequest/:requestId', authDataController.auth, async (req, res) => {
    try {
        if (req.user.role !== 'Doctor') {
            return res.status(403).send('Only doctors can delete requests.');
        }
        await Request.findByIdAndDelete(req.params.requestId);
        res.redirect(`/patientRecords/${req.params.patientId}/edit?token=${req.query.token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Delete Sick Leave
// =============================
router.delete('/:patientId/deleteSickLeave/:sickLeaveId', authDataController.auth, async (req, res) => {
    try {
        if (req.user.role !== 'Doctor') {
            return res.status(403).send('Only doctors can delete sick leaves.');
        }
        await SickLeave.findByIdAndDelete(req.params.sickLeaveId);
        res.redirect(`/patientRecords/${req.params.patientId}/edit?token=${req.query.token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// =============================
// Delete Referral Letter
// =============================
router.delete('/:patientId/deleteReferralLetter/:referralLetterId', authDataController.auth, async (req, res) => {
    try {
        if (req.user.role !== 'Doctor') {
            return res.status(403).send('Only doctors can delete referral letters.');
        }
        await ReferralLetter.findByIdAndDelete(req.params.referralLetterId);
        res.redirect(`/patientRecords/${req.params.patientId}/edit?token=${req.query.token}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// View Sick Leaves List
router.get('/sickLeaves', authDataController.auth, async (req, res) => {
    const sickLeaves = await SickLeave.find()
        .populate('patient')
        .populate('doctor')
        .lean();
    res.render('patientRecords/SickLeavesList', { sickLeaves, token: req.query.token });
});

// View Referral Letters List
router.get('/referralLetters', authDataController.auth, async (req, res) => {
    const referralLetters = await ReferralLetter.find()
        .populate('patient')
        .populate('doctor')
        .lean();
    res.render('patientRecords/ReferralLettersList', { referralLetters, token: req.query.token });
});
// Create New Sick Leave
router.post('/patientRecords/:id/history/newSickLeave', authDataController.auth, async (req, res) => {
    try {
        const { reason, startDate, durationDays, additionalNotes } = req.body;

        if (!startDate || !durationDays || !reason) {
            return res.status(400).send("Start date, reason, and duration are required.");
        }
        console.log("New SickLeave for patient ID:", req.params.id);


        // Get latest diagnosis
        const latestRecord = await PatientRecord.findOne({ patient: req.params.id }).sort({ createdAt: -1 });
        const diagnosis = latestRecord?.diagnosis || reason; // fallback to input if no record

        const sickLeave = new SickLeave({
            patient: req.params.id,
            doctor: req.user._id,
            reason: diagnosis,
            startDate,
            durationDays,
            additionalNotes
        });

        await sickLeave.save();

        res.redirect(`/patientRecords/${req.params.id}/history?token=${req.query.token}`);
    } catch (err) {
        console.error(err);
        res.status(400).send("Failed to create sick leave: " + err.message);
    }
});




module.exports = router;
