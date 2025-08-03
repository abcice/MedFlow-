const Patient = require('../../models/patient.js');

const dataController = {};

// INDEX 
dataController.index = async (req, res, next) => {
    try {
        res.locals.data.patients = await Patient.find({});
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// DESTROY 
dataController.destroy = async (req, res, next) => {
    try {
        await Patient.findOneAndDelete({ _id: req.params.id });
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// UPDATE — Update patient info
dataController.update = async (req, res, next) => {
    try {
        res.locals.data.patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// CREATE — Add a new patient
dataController.create = async (req, res, next) => {
    try {
        res.locals.data.patient = await Patient.create(req.body);
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// SHOW — Get patient details
dataController.show = async (req, res, next) => {
    try {
        res.locals.data.patient = await Patient.findById(req.params.id);
        if (!res.locals.data.patient) {
            throw new Error(`Could not find patient with ID ${req.params.id}`);
        }
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
// Upload patient photo
dataController.create = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.photo = '/uploads/patients/' + req.file.filename;
        }

        res.locals.data.patient = await Patient.create(req.body);
        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

module.exports = dataController;
