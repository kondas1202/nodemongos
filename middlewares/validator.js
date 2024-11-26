const Joi = require('joi');

exports.signupValidator = (data) => {
          const schema = Joi.object({
                    email: Joi.string().email().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(new Error('Invalid email address')),
                    password: Joi.string().min(8).required(),
          });
          return schema.validate(data);
}

exports.signinValidator = (data) => {
          const schema = Joi.object({
                    email: Joi.string().email().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(new Error('Invalid email address')),
                    password: Joi.string().min(8).required(),
          });
          return schema.validate(data);
}

exports.verifyVerificationCodeValidator = (data) => {
          const schema = Joi.object({
                    email: Joi.string().email().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(new Error('Invalid email address')),
                    verificationCode: Joi.number().required(),
          });
          return schema.validate(data);
}

exports.changePasswordValidator = (data) => {
          const schema = Joi.object({
                    oldPassword: Joi.string().min(8).required(),
                    newPassword: Joi.string().min(8).required(),
          });
          return schema.validate(data);
}