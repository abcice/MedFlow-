const Request = require('../../models/request');
const SickLeave = require('../../models/sickLeave');
const ReferralLetter = require('../../models/referralLetter');

const viewController = {
    // Edit Lab / Radiology
    async editRequestView(req, res) {
        try {
            const request = await Request.findById(req.params.requestId).populate('patient');
            if (!request) return res.status(404).send('Request not found');

            res.render('medicalRequests/EditRequest', {
                request,
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
    },

    // Edit Sick Leave
    async editSickLeaveView(req, res) {
        try {
            const sickLeave = await SickLeave.findById(req.params.sickLeaveId).populate('patient');
            if (!sickLeave) return res.status(404).send('Sick leave not found');

            res.render('medicalRequests/EditSickLeave', {
                sickLeave,
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
    },

    // Edit Referral Letter
    async editReferralLetterView(req, res) {
        try {
            const referralLetter = await ReferralLetter.findById(req.params.referralLetterId).populate('patient');
            if (!referralLetter) return res.status(404).send('Referral letter not found');

            res.render('medicalRequests/EditReferralLetter', {
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
    }
};

module.exports = viewController;
