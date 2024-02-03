const express = require('express');
const { premiumPending, premiumVerification } = require('../controllers/premiumController');
const {getUserLeaderBoard , daily , monthly,yearly} = require("../controllers/leadboardController");
const router = express.Router();

router.get('/takepremium',premiumPending);
router.post('/updatetransactionstatus',premiumVerification);
router.get('/leaderboard',getUserLeaderBoard)
router.get('/daily',daily);
router.get('/monthly',monthly);
router.get('/yearly',yearly);

module.exports = router;