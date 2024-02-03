const express = require("express");
const router = express.Router();
const path = require("path");
const { route } = require("./userRoute");


router.get("/welcome" , (req , res )=>{
    const filePath = path.join(__dirname,"..","public","welcome","welcome.html");
    res.sendFile(filePath);
})

router.get("/login" ,(req , res )=> {
    const filePath = path.join(__dirname,"..","public","login","login.html");
    res.sendFile(filePath);
})

router.get("/signup" ,(req , res )=> {
    const filePath = path.join(__dirname,"..","public","signup","signup.html");
    res.sendFile(filePath);
})
router.get("/expenses" , (req, res) => {
    const filePath = path.join(__dirname,"..","public","expanseTracker","expanseTracker.html");
    res.sendFile(filePath);
})
router.get("/forgot",(req, res) =>{
    const filePath = path.join(__dirname,"..","public","forgotPassword","forgotPassword.html");
    res.sendFile(filePath);
})
router.get('/resetPage',(req, res) =>{
    const uuid = req.params.uuid;
    const filePath =path.join(__dirname,"..","public","resetPassword","resetPassword.html");
    res.sendFile(filePath, { query :{uuid}});
})

module.exports = router;