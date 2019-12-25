const express = require("express");
const router = express.Router();

const CallController = require('../controllers/call');
const checkAuth = require('../middleware/check-auth');

router.post('/send', checkAuth, CallController.sendCall);

module.exports = router;