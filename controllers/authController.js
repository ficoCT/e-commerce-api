const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ name, email, password, role });
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser});
};
const login = async (req, res) => {
  res.send('login');
};
const logout = async (req, res) => {
  res.send('logout');
};

module.exports = {
  register,
  login,
  logout,
};
