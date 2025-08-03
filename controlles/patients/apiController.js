const Patient = require('../../models/patient.js');

// API Patients controllers - returns JSON responses
const apiController = {
  
  // Get all patients
  index(req, res) {
    res.json(res.locals.data.patients);
  },

  // Get single patient
  show(req, res) {
    res.json(res.locals.data.patient);
  },

  // Create new patient
  create(req, res) {
    res.status(201).json(res.locals.data.patient);
  },

  // Update patient
  update(req, res) {
    res.json(res.locals.data.patient);
  },

  // Delete patient
  destroy(req, res) {
    res.status(200).json({ message: 'Patient successfully deleted' });
  }
};

module.exports = apiController;
