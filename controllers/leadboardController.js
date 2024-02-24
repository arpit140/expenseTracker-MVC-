const User = require("../models/userModel");
const Expense = require("../models/expanseModel");
const mongoose = require("mongoose");


const getUserLeaderBoard = async (req, res) => {
    try{
    const users = await User.find({}, ["id", "name", "totalCost"]).sort({
      totalCost: -1,
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const daily = async (req, res) => {
    try{
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        console.log(req.user.userId);
        const expenses = await Expense.find({
          userId: req.user.userId,
          updatedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }).sort({ totalCost: -1 });

        res.json(expenses);
    }catch(err) {
        console.log(err);
        res.status(500).json({error: "internal server errror"});
    }
}

const monthly = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    const endDate = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
      userId: req.user.userId,
      updatedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ totalCost: -1 });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const yearly = async (req, res) => {
    try{
        const today = new Date();
        const startDate = new Date(today.getFullYear(), 0 , 1);
        const endDate = new Date(today.getFullYear(), 11,31, 23, 59, 59, 999);

        const expenses = await Expense.find({
          userId: req.user.userId,
          updatedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }).sort({ totalCost: -1 });

    res.json(expenses);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
}

module.exports = {getUserLeaderBoard, daily, monthly, yearly};