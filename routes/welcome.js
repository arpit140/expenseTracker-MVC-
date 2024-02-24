const express = require("express");
const welcomeController = require("../controllers/welcomeController");
const router = express.Router();
router.get("/", welcomeController.getWelcomepage);
router.use("/", welcomeController.getErrorpage);
module.exports = router;