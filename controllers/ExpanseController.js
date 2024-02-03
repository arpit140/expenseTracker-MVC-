const Expense = require("../models/expanseModel");
const User = require("../models/userModel");
const sequelize = require("../util/db");
const downloadedFiles = require("../models/downloadFiles");

const createExpanse = async (req, res) => {
  let t;
  try {
    const { name, amount, quantity } = req.body;
    // const user = req.user;

    const userId = req.user.userId;

    t = await sequelize.transaction();

    // Validation
    if (!name || !amount || !quantity) {
      return res.status(400).json({ Error: "Missing required fields" });
    }

    const newExpanse = await Expense.create(
      {
        name,
        quantity,
        amount,
        userId: userId,
      },
      { transaction: t }
    );

    await User.update(
      {
        total_cost: sequelize.literal(`total_cost + ${amount}`),
      },
      {
        where: { id: userId },
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json(newExpanse);
  } catch (error) {
    if (t) {
      await t.rollback();
    }

    console.log("Error creating expense:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting the user." });
  }
};

const fetchExpanse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = req.query.page || 1;
    const pageSize = 5;
    const {count, rows} = await Expense.findAndCountAll({ 
      where: { userId:userId },
      attributes:["id","name","quantity","amount"],
      limit:pageSize,
      offset:(page-1)*pageSize,    
    });
    const totalPAges = Math.ceil(count/pageSize);

    res.json({
      totalItems : count,
      totalPAges: totalPAges,
      currentPages:page,
      expenses:rows,
    });
  } catch (error) {
    console.log("error occured while fethcing data", error);
    res.status(500).json({ error: " no data available or server not working" });
  }
};

const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const row = await Expense.findOne({ where: { id: expenseId } });
    if (!row) {
      return res.status(404).json({ error: "Expense Not Found" });
    }
    res.json(row);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ Error: "Internal Server Error while fetching a user." });
  }
};
const deleteExpanse = async (req, res) => {
  let t;
  const expenseId = req.params.id;
  try {
    t = await sequelize.transaction();

    const idMatched = await Expense.findOne({
      where: { id: expenseId },
      attribute: ["id", "amount"],
      transaction: t,
    });
    if (!idMatched) {
      await t.rollback();
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    const amountToDelete = idMatched.amount;
    await User.update(
      {
        total_cost: sequelize.literal(`total_cost-${amountToDelete}`),
      },
      {
        where: { id: req.user.userId },
        transaction: t,
      }
    );
    await Expense.destroy({
      where: { id: expenseId },
      transaction: t,
    });
    await t.commit();

    res.json({
      message: "Expanse deleted Successfully",
    });
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    console.log("error deleting expense:", error);
    res
      .status(500)
      .json({ Error: "An error occurred while deleting the user." });
  }
};

const updateExpense = async (req, res) => {
  let t;
  const expenseId = req.params.id;
  const { name, amount, quantity } = req.body;
  // const user = req.user;

  try {
    const userId = req.user.userId;
    t = await sequelize.transaction();

    const [rowUpdated] = await Expense.update(
      { name, quantity, amount },
      { where: { id: expenseId, userId }, returning: true, transaction: t }
    );
    const updatedExpense = await Expense.findOne({ where: { id: expenseId } });

    if (rowUpdated === 0) {
      throw new Error("Expense not found");
    }

    const updatedExpanse = rowUpdated[1][0];
    const diffAmount = amount - updatedExpanse.amount;

    await User.update(
      { total_cost: sequelize.literal(`total_cost + ${diffAmount}`) },
      { where: { id: userId }, transaction: t }
    );
    await t.commit();

    res.json(updatedExpense);
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    console.error("error updating expense:", error);
    res.status(500).json({
      error: "An error occurred while updating the user.",
    });
  }
};

const downloadedExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    let Expense = await Expense.findAll({ where: { userId: userId } });
    const stringifiedExpenses = JSON.stringify(Expense);
    const filename = `Expenses${userId}/${new Date()}.txt`;
    const fileUrl = await S3services.uploadToS3(stringifiedExpenses, filename);
    console.log(fileUrl);

    const downloadFiles = await downloadedFiles.create({
      link: fileUrl,
      userId: userId,
    });
    res.status(200).json({ fileUrl, success: true });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something not working onbackend side", err: e });
  }
};

const getFileHistory = async (req, res) => {
  try {
    let userId = req.user.userId;
    let files = await downloadedFiles.findAll({ where: { userId: userId } });
    console.log(files);
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "can't find the require files", err: err });
  }
};

module.exports = {
  createExpanse,
  fetchExpanse,
  deleteExpanse,
  getExpenseById,
  updateExpense,
  getFileHistory,
  downloadedExpense,
};