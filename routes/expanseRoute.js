const express = require("express");
const router = express.Router();

const {
  createExpanse,
  fetchExpanse,
  deleteExpanse,
  getExpenseById,
  downloadedExpense,
  getFileHistory,
  updateExpense,
} = require("../controllers/ExpanseController");

router.get("/paginated", fetchExpanse);
router.post("/", createExpanse);
router.delete("/:id", deleteExpanse);
router.get("./:id", getExpenseById);
router.get("/download", downloadedExpense);
router.get("/fileHistory", getFileHistory);
router.get("/:id",updateExpense);

module.exports = router;