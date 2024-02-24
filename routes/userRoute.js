const express = require("express");


const welcomeController = require("../controllers/welcomeController");
const regController = require("../controllers/signup&loginController");
// const passController = require("../controllers/forgotpassController");
const {
  createExpense,
  getAllPaginatedExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getfilehistory,
  downloadExpense,
} = require("../controllers/ExpanseController");

const verify = require("../middleware/verifyToken");


const router = express.Router();

//route definition for signin and signup
router.post('/signup',regController.processSignUp);
router.post('/signin',regController.processLogin);


// //route definition for password
// router.post('/forgotpassword',passController.requestResetPassword);
// router.get('/reset/:forgotId', passController.resetPasswordForm);
// router.post('/password-reset',passController.resetPassword);


//routes for expense page
router.post("/create", verify, createExpense);
router.get("/paginated", verify, getAllPaginatedExpenses);
router.get("/download", verify, downloadExpense);
router.get("/filehistory", verify, getfilehistory);
router.get("/expenses/:id", verify, getExpenseById);
router.put("/expense/:id", verify, updateExpense);
router.delete("/:id", verify, deleteExpense);


//route for serving the expensePage
router.get("/", welcomeController.getExpensepage);


module.exports = router;