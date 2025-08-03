const express = require('express')
const router = express.Router()
const userApiController = require('../controllers/auth/apiController')
const patientApiController = require('../controllers/patient/apiController')
const appointmentApiController = require('../controllers/appointment/apiController')

module.exports = router 