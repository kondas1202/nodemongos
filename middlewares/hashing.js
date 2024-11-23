const bcrypt = require('bcryptjs');

exports.hashPassword = async (password, saltRounds) => {
          return await bcrypt.hash(password, saltRounds);
}

exports.comparePassword = async (password, hashedPassword) => {
          return await bcrypt.compare(password, hashedPassword);
}