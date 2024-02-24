const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const {Schema} = mongoose;

// Define Mongoose schema
const forgotPasswordRequestSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    alias: "id", // Use 'id' as an alias for '_id'
  },
  isactive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

module.exports = mongoose.model("forgotpass", forgotPasswordRequestSchema);