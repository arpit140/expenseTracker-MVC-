const Razorpay  = require('razorpay');
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Expense = require("../models/expanseModel");
const mongoose = require("mongoose");


const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const premiumpending = async (req, res) => {
  try {
    console.log(req.user);
    const amount = 2500;

    //creating new payment order in the razorpay using razorpay SDK
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.error(err); // Log the error
        return res
          .status(403)
          .json({ message: "Not able to process the payment" });
      }
      try {
        const newOrder = await Order.create({
          orderId: order.id,
          status: "PENDING",  
        });

        return res.status(201).json({ order_id: newOrder.orderId, key_id: rzp.key_id });
      } catch (error) {
        console.error(error); // Log the error
        return res.status(403).json({ message: "Not able to process the payment" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Not able to process the payment" });
  }
};


const premiumverification = async (req, res) => {
  let session;
  try {
    const { payment_id, order_id } = req.body;

    if (!payment_id || !order_id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment or order details are missing",
        });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const [order, user] = await Promise.all([
      Order.findOneAndUpdate(
        { orderId: order_id },
        { paymentId: payment_id, status: "SUCCESSFUL" },
        { new: true, session }
      ),
      User.findOneAndUpdate(
        { _id: req.user.userId },
        { isPremiumUser: true },
        { new: true, session }
      ),
    ]);

    if (!order || !user) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "User or order not found" });
    }

    await session.commitTransaction();
    console.log("order and user updated successfully");
    return res
      .status(202)
      .json({ success: true, message: "Transaction successful" });
  } catch (err) {
    console.error(err);
    if(session){
      await session.abortTransaction();
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  } finally{
    session.endSession();
  }
};

module.exports = { premiumpending, premiumverification };