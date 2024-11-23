const Joi = require('joi');

exports.signupValidator = (data) => {
          const schema = Joi.object({
                    email: Joi.string().email().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(new Error('Invalid email address')),
                    password: Joi.string().min(8).required(),
          });
          return schema.validate(data);
}