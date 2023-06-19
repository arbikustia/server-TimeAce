const express = require("express");
const  User = require ("../Models/User.js");
const  bcrypt = require ("bcryptjs");
const generateLogToken = require ("../../utils.js");

const router = express.Router();
//Create User
router.post("/register",
async(req,res)=>{
    let user = await User.findOne({email : req.body.email});
    if (user)
    return res.send("User with given email is existing!");
  
 user= new User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
}).save();
res.send(user);
}
)

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }

    res.send({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      token: generateLogToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

  



module.exports = router;
