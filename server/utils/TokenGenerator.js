const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'abcdefg!@$$@%^&%sdds/ffg';

const generateToken = (user, databaseName = null) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role,
    ...(databaseName && { databaseName }) // Add the database name to the token if provided
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
