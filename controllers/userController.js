const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // validation
    if (!name || !email || !password) {
      return next(new ErrorHandler('Please enter all fields', 400));
      console.log("Please enter all fields");
    }
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler('User already exists', 400));
      console.log("User already exists");
    }
    // create new user
    const user = await User.create({
      name,
      email,
      password
    });

    sendToken(user, 201, res);
    console.log("User registered successfully...!!!" ,user);
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler('Please enter email & password', 400));
    }
    console.log("Please enter email & password");

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorHandler('User doesnt exist, please register', 401));
    }
    console.log("User doesnt exist, please register");

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }


    sendToken(user, 200, res);
    console.log("Logged in successfully");
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
  console.log("Logged out successfully");
};