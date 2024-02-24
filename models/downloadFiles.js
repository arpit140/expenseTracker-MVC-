const mongoose = require("mongoose");

// Define Mongoose schema
const downloadedFilesSchema = new mongoose.Schema({
  link: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

module.exports = mongoose.model("DownloadedFiles", downloadedFilesSchema);