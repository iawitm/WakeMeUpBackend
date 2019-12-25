const express = require("express");
const router = express.Router();

const RequestController = require('../controllers/request');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, RequestController.getRequests);
router.post('/', checkAuth, RequestController.newRequest);
router.post('/accept', checkAuth, RequestController.acceptRequest);
router.post('/reject', checkAuth, RequestController.rejectRequest);

module.exports = router;
