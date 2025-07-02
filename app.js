const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/secrets");
mongoose.connect("mongodb+srv://sauravjha4575:SauravJha%4012@cluster0.kzarmlp.mongodb.net/secrets?retryWrites=true&w=majority&appName=Cluster0");


const trySchema = new mongoose.Schema({
  email: String,
  password: String,
});

const item = mongoose.model("second", trySchema);

app.get("/", function (req, res){
  res.render("home");
});

app.post("/register", async function (req, res) {
  const password = req.body.password;
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new item({
    email: req.body.username,
    password: hashedPassword,
  });
  await newUser.save();
  res.render("secrets");
});


    //  (function (err) {   if (err) {                
    //     console.log(err);
    //     res.send("Registration error!");
    //   } else {
    //     res.render("secrets");
    //   }
    // });
//   } catch (err) {
//     console.error("Error hashing password:", err);
//     res.send("Registration error!");
  
//  });

app.post("/login", async function (req, res) {
  const username = req.body.username; // form se username mila
  const password = req.body.password; // form se password mila

  try {
    // Database me email ke basis pe user dhundo
    const foundUser = await item.findOne({ email: username });

    if (foundUser) {
      // Password compare karo
      const isMatch = await bcrypt.compare(password, foundUser.password);

      if (isMatch) {
        res.render("secrets"); // Password sahi hai to secrets page dikhao
      } else {
        res.send("Incorrect password!");
      }
    } else {
      res.send("User not found!");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.send("Login error!");
  }
});


app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.listen(3000, function () {
  console.log("server started");
});
