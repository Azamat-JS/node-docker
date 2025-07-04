const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashPassword,
    });
    req.session.user = newUser;
    res.status(201).json({
      status: "success",
      newUser,
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
  try {
    const user = await User.findOne({username});
    if(!user){
        res.status(404).json({
            status: 'fail',
            message: 'user not found'
        })
    }
    const matchPassword = await bcrypt.compare(password, user.password)
    if(!matchPassword) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid credentials'
        })
    }
    req.session.user = user;
    res.status(200).json({
        status: 'success',
    })
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};
