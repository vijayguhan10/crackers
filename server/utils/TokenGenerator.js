const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'abcdefg!@$$@%^&%sdds/ffg';

const generateToken = (user, databaseName = null) => {
  let id = user.id;
  if (user.role == 'superadmin') {
    id = user._id;
  }

  const payload = {
    name: user.name,
    id,
    email: user.email,
    role: user.role,
    ...(databaseName && { databaseName }) // Add the database name to the token if provided
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
