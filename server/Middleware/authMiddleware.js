// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'abcdefg!@$$@%^&%sdds/ffg';
// const mongoose = require('mongoose');

// const dbMiddleware = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, JWT_SECRET);

//     if (decoded.role === 'subadmin') {
//       if (!decoded.dblink) {
//         return res
//           .status(400)
//           .json({ message: 'Database link missing for sub-admin.' });
//       }

//       // Connect to the sub-admin's database
//       const subAdminDb = mongoose.createConnection(decoded.dblink);
//       req.db = subAdminDb;
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     res
//       .status(401)
//       .json({ message: 'Authentication failed.', error: error.message });
//   }
// };

// module.exports = dbMiddleware;

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'abcdefg!@$$@%^&%sdds/ffg';

const dbMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    if (decoded.role === 'subadmin') {
      const baseUrl =
        process.env.MONGODB_BASE_URL ||
        'mongodb+srv://Kirtick:2805@cluster.zz2zo.mongodb.net/';
      const dbName = decoded.databaseName;

      if (!dbName) {
        return res
          .status(400)
          .json({ message: 'Database name missing for sub-admin.' });
      }

      const dbUri = `${baseUrl}${dbName}?retryWrites=true&w=majority`;
      req.db = mongoose.createConnection(dbUri);
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Authentication failed.', error: error.message });
  }
};

module.exports = dbMiddleware;
