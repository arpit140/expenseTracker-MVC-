const express = require("express");
const welcomeController = require("../controllers/welcomeController");
const {premiumpending , premiumverification} = require("../controllers/premiumuserController");
const {getUserLeaderBoard, daily, monthly, yearly} = require("../controllers/leadboardController");

const router = express.Router();
const verify = require("../middleware/verifyToken");
router.get("/takepremium", verify, premiumpending);
router.post("/updatetransactionstatus",verify, premiumverification);
router.get("/leaderboard", verify, getUserLeaderBoard);
router.get("/daily", verify, daily);
router.get("/monthly", verify, monthly);
router.get("/yearly", verify, yearly);
router.get("/report", welcomeController.getReportpage);

module.exports = router;