const User = require('../models/usersModal');
const { signupValidator } = require('../middlewares/validator');
const { hashPassword, comparePassword } = require('../middlewares/hashing');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
          const { email, password } = req.body;
          try {
                    const { error, value } = signupValidator(req.body);
                    if (error) {
                              return res.status(400).json({
                                        success: false,
                                        message: error.message,
                              });
                    }

                    const existingUseruser = await User.findOne({ email });
                    if (existingUseruser) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'User already exists',
                              });
                    }

                    const hashedPassword = await hashPassword(password, 10);
                    console.log(hashedPassword);

                    const user = await User.create({ email, password: hashedPassword });
                    console.log(user);
                    if (user) {
                              return res.status(201).json({
                                        success: true,
                                        message: 'User created successfully',
                                        email,
                                        password,
                              });
                    }
          } catch (error) {
                    res.status(500).json({
                              success: false,
                              message: error.message,
                    });
          }
}

exports.login = async (req, res) => {
          const { email, password } = req.body;
          try {
                    const user = await User.findOne({ email }).select('+password');
                    if (!user) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'User not found',
                              });
                    }
                    const isPasswordValid = await comparePassword(password, user.password);
                    if (!isPasswordValid) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'Invalid password',
                              });
                    }

                    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                    res.status(200).json({
                              success: true,
                              message: 'Login successful',
                              token,
                    });
          }
          catch (error) {
                    res.status(500).json({
                              success: false,
                              message: error.message,
                    });
          }
}

exports.logout = async (req, res) => {
          res.clearCookie('token');
          res.status(200).json({
                    success: true,
                    message: 'Logout successful',
          });
}



exports.sendVerificationToken = async (req, res) => {
          const { email } = req.body;
          try {
                    const user = await User.findOne({ email });
                    if (!user) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'User not found',
                              });
                    }
          } catch (error) {
                    res.status(500).json({
                              success: false,
                              message: error.message,
                    });
          }
}