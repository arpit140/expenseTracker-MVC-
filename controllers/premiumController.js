const Razorpay = require("razorpay");
const User = require("../models/userModel");
const Expense = require("../models/expanseModel");
const Order = require("../models/orderModel");
const sequelize = require("../util/db");
const Sequelize = require("sequelize");

const premiumPending = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    console.log("keyid",rzp.key_id);

    const user = req.user;
    const amount = 2500;

    // Creating a new payment order in Razorpay
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log('error at creation ',err);
        return res.status(403).json({ message: "Not able to process payment" });
      }

      Order.create({
        orderId: order.id,
        status: "PENDING",
      })
        .then(() => {
          return res
            .status(201)
            .json({ order_id:order.id, key_id:rzp.key_id });
        })
        .catch((err) => {
          console.log('error at inner catch',err);
          return res
            .status(403)
            .json({ message: "Not able to process Payment" });
        });
    });
  } catch (err) {
    console.log("error at outer catch of pending",err);
    res.status(403).json({ message: "Not able to process Payment" });
  }
};

const premiumVerification = async (req, res) => {
  let t;
  try {
    const { payment_id, order_id } = req.body;

    if (!payment_id || !order_id) {
      return res
        .status(403)
        .json({success:false , message: "Payment or order details not found" });
    }

    t = await sequelize.transaction();

    const [order, user] = await Promise.all([
      Order.update(
        { paymentId: payment_id, status: "Success" },
        { where: { orderId: order_id }, transaction: t }
      ),
      User.update(
        { isPremiumuser: true },
        { where: { id: req.user.userId }, transaction: t }
      ),
    ]);

    if (order[0] === 0 || user[0] === 0) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "User or order not found" });
    }
    await t.commit();

    console.log("Order and user updated successfully");

    return res
      .status(202)
      .json({ success: true, message: "Transaction successful" });
  } catch (err) {
    console.log(err);
    if (t) {
      await t.rollback();
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { premiumPending, premiumVerification };