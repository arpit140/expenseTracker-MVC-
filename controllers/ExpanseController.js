const mongoose = require("mongoose");
const Expense = require("../models/expanseModel");
const User = require("../models/userModel");
const DownloadedFiles = require("../models/downloadFiles");
// const S3Services = require("../service/S3services");

const getAllPaginatedExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = req.query.page || 1; // Get the requested page from query parameters
    const pageSize = 4; // Set the page size

    const count = await Expense.countDocuments({ userId });
    const expenses = await Expense.find({ userId })
      .select("id name quantity amount")
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const totalPages = Math.ceil(count / pageSize);

    res.json({
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      expenses: expenses,
    });
  } catch (error) {
    console.error("Error fetching paginated expenses:", error);
    res.status(500).json({
      error: "An error occurred while fetching paginated expenses.",
    });
  }
};
const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    console.error("error fetching expense", error);
    res.status(500).json({
      error: "An error occurred while fetching a user.",
    });
  }
};

const createExpense = async (req, res) => {
  try {
    const { name, quantity, amount } = req.body;

    const newExpense = await Expense.create({
      name,
      quantity,
      amount,
      userId: req.user.userId,
    });

    await User.updateOne(
      { _id: req.user.userId },
      { $inc: { totalCost: quantity*amount } }
    );
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({
      error: "An error occurred while inserting the user.",
    });
  }
};

const deleteExpense = async (req, res) => {
  let t;
  const expenseId = req.params.id;
  // console.log(expenseId);
  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        error: "Expense not found",
      });
    }
    t = await mongoose.startSession();
    t.startTransaction();

    const amountToDelete = expense.amount;
    await User.updateOne(
      { _id: req.user.userId },
      { $inc: { totalCost: -amountToDelete } }
    );

    await Expense.deleteOne({ _id: expenseId });

    await t.commitTransaction();

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    if (t) {
      await t.abortTransaction();
    }
    console.error("error deleting expense:", error);
    res.status(500).json({
      error: "An error occurred while deleting the user.",
    });
  }
};

const updateExpense = async (req, res) => {
  let t;
  const expenseId = req.params.id;
  const { name, quantity, amount } = req.body;

  try {
    const userId = req.user.userId;
    t = await mongoose.startSession();
    t.startTransaction();

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { name, quantity, amount },
      { new: true }
    );
    if (!updatedExpense) {
      await t.abortTransaction();
      return res.status(404).json({
        error: "Expense not found",
      });
    }
    const diffAmount = amount - updatedExpense.amount;

    await User.updateOne({ _id: userId }, { $inc: { totalCost: diffAmount } });

    await t.commitTransaction();
    res.json(updatedExpense);
  } catch (error) {
    if (t) {
      await t.abortTransaction();
    }
    console.error("error updating expense:", error);
    res.status(500).json({
      error: "An error occurred while updating the user.",
    });
  }
};

const downloadExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    let expenses = await Expense.find({ userId });
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expenses${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
    console.log("this is the fileUrl", fileURL);
    const downloadfiles = await DownloadedFiles.create({
      link: fileURL,
      userId: userId,
    });
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong", err: err });
  }
};

const getfilehistory = async (req, res) => {
  try {
    let userId = req.user.userId;
    let files = await DownloadedFiles.find({ userId });
    console.log(files);
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "can't find the require files", err: err });
  }
};

module.exports = {
  createExpense,
  getAllPaginatedExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getfilehistory,
  downloadExpense,
};