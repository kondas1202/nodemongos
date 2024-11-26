const User = require('../models/usersModal');
const { signupValidator, signinValidator, verifyVerificationCodeValidator, changePasswordValidator } = require('../middlewares/validator');
const { hashPassword, comparePassword } = require('../middlewares/hashing');
const jwt = require('jsonwebtoken');
const { sendVerificationToken, createHmacProcess } = require('../models/sendMail');


exports.getallUsers = async (req, res) => {
          const users = await User.find();
          res.status(200).json({
                    success: true,
                    users,
          });
}

exports.signup = async (req, res) => {
          const { email, password } = req.body;
          try {
                    const { error } = signupValidator(req.body);
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

                    const user = await User.create({ email, password: hashedPassword });
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
                    const { error } = signinValidator(req.body);
                    if (error) {
                              return res.status(400).json({
                                        success: false,
                                        message: error.message,
                              });
                    }
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

                    const token = jwt.sign({ userId: user._id, email: user.email, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
                    if (user.verified) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'User already verified',
                              });
                    }
                    const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();
                    let info = await sendVerificationToken(email, verificationToken);
                    if (info.accepted.length > 0) {
                              const verificationTokenHash = await createHmacProcess(verificationToken, process.env.JWT_SECRET);
                              user.verificationCode = verificationTokenHash;
                              user.verificationCodeValidation = Date.now() + 3600000;
                              await user.save();
                              res.status(200).json({
                                        success: true,
                                        message: 'Verification token sent',
                              });
                    }
                    else {
                              return res.status(400).json({
                                        success: false,
                                        message: 'Failed to send verification token',
                              });
                    }
          } catch (error) {
                    res.status(500).json({
                              success: false,
                              message: error.message,
                    });
          }
}

exports.verifyVerificationCode = async (req, res) => {
          const { email, verificationCode } = req.body;
          try {
                    const { error } = verifyVerificationCodeValidator(req.body);
                    if (error) {
                              return res.status(400).json({
                                        success: false,
                                        message: error.message,
                              });
                    }
                    const verficationValue = verificationCode.toString()
                    const user = await User.findOne({ email }).select('+verificationCode +verificationCodeValidation');
                    if (!user) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'User not found',
                              });
                    }
                    if (user.verified) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'User already verified',
                              });
                    }

                    // if (!user.verficationCode || !user.verificationCodeValidation) {
                    //           return res.status(400).json({
                    //                     success: false,
                    //                     message: 'Something went wrong with verification code validation',
                    //           });
                    // }

                    const verifytheCode = await createHmacProcess(verficationValue, process.env.JWT_SECRET);
                    if (verifytheCode && !user.verified) {
                              {
                                        user.verified = true;
                                        user.verificationCode = undefined;
                                        user.verificationCodeValidation = undefined;
                                        await user.save();
                                        res.status(200).json({
                                                  success: true,
                                                  message: 'Verification code verified',
                                        });
                              }
                              if (Date.now() - user.verificationCodeValidation > 5 * 60 * 10000) {
                                        return res.status(400).json({
                                                  success: false,
                                                  message: 'Verification code expired',
                                        });
                              }
                    }
                    else {
                              return res.status(400).json({
                                        success: false,
                                        message: 'Invalid verification code - for second time',
                              });
                    }
          } catch (error) {
                    res.status(500).json({
                              success: false,
                              message: error.message,
                    });
          }
}

exports.changePassword = async (req, res) => {
          const { oldPassword, newPassword } = req.body;
          const { userId, verified } = req.user;
          try {
                    const { error } = changePasswordValidator(req.body);
                    if (error) {
                              return res.status(400).json({
                                        success: false,
                                        message: error.message,
                              });
                    }
                    if (!verified) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'User not verified',
                              });
                    }
                    const user = await User.findOne({ _id: userId }).select('+password');
                    console.log('User is calling', user);
                    if (!user) {
                              return res.status(401).json({
                                        success: false,
                                        message: 'User not found',
                              });
                    }
                    const isPasswordValid = await comparePassword(oldPassword, user.password);
                    if (!isPasswordValid) {
                              return res.status(400).json({
                                        success: false,
                                        message: 'Invalid old password',
                              });
                    }
                    const hashedPassword = await hashPassword(newPassword, 10);
                    user.password = hashedPassword;
                    await user.save();
                    res.status(200).json({
                              success: true,
                              message: 'Password changed successfully',
                    });
          } catch (error) {

          }
}         