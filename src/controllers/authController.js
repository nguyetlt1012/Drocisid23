const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

exports.login = catchAsync(async (req, res, next) =>{
  const {email, password} = req.body;

  // 1) check if email and password exist 
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));
  
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 400));

  // 3) Check if user is blocked or not
  if (user.status === '0')
  return next(
    new AppError(
      'Your account has been blocked for some reasons. Please contact us for supports or create a new account',
      401
    )
  );
  
  // 4) send token to client
  createSendToken(user, 200, res);
});


exports.signup = catchAsync(async (req, res, next) =>{
  const newUser = await User.create(req.body);

  createSendToken(newUser,201, res);
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) =>{
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
    token,
  });
}