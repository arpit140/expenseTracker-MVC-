const mongoose = require("mongoose");
const { Schema } = mongoose;

const Order = new Schema({
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", 
  },
});

module.exports = mongoose.model("Order", Order);