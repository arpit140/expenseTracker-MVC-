require("dotenv").config();

//importing the modules here in server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const mongoose = require("mongoose");
const url = 'mongodb+srv://arpit:YRROKS89QWbHULpv@cluster0.lvujxxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'



const morgan = require("morgan");

//importing routes
const userRoute = require("./routes/userRoute");
const forgotPassRoute = require("./routes/forgotPasswordRoute");
const premiumRoute = require("./routes/premiumRoute");
const welcome = require("./routes/welcome");


//instantiating the application
const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// calling cors, json, making absolute path for static files
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static("public"));
app.use(morgan("combined", { stream: accessLogStream }));



//defining the route 
app.use('/user', userRoute);
app.use('/user',forgotPassRoute)
app.use("/premium", premiumRoute);
app.use(welcome);



// making the port for server to listen
const port = process.env.PORT || 3000;

// listening on port
async function initiate() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
initiate();