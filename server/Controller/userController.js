const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require('../utils/encryptDecrypt');
const userSchema = require('../Model/User');
const User = mongoose.model('User', userSchema);
const generateToken = require('../utils/TokenGenerator');
const getDbConnection = (databasename) => {
  const dbLink = process.env.DATABASE.replace('<DATABASE>', databasename);
  return mongoose.createConnection(dbLink);
};
exports.createSubAdmin = async (req, res) => {
  try {
    const { email, password, databasename } = req.body;

    if (req.user.role !== 'superadmin') {
      return res
        .status(400)
        .json({ message: 'Unauthorized to create sub-admins.' });
    }

    const superAdmin = await User.findById(req.user.id);
    const existingSubAdmin = superAdmin.subadmindetails.find(
      (subAdmin) => subAdmin.email === email
    );

    if (existingSubAdmin) {
      return res
        .status(400)
        .json({ message: 'Sub-admin with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const subAdminDb = getDbConnection(databasename);
    const SubAdminUser = subAdminDb.model('User', userSchema);
    const subAdmin = new SubAdminUser({
      email,
      password: hashedPassword,
      role: 'subadmin',
      createdby: superAdmin._id
    });

    await subAdmin.save();

    const encryptedDbName = JSON.stringify(encrypt(databasename));

    superAdmin.subadmindetails.push({
      id: subAdmin._id,
      email,
      password: hashedPassword,
      dbname: encryptedDbName,
      active: true
    });

    await superAdmin.save();

    return res.status(200).json({
      message: 'Sub-admin created successfully and linked to super-admin panel.'
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const isThere = await User.findOne({ role: 'superadmin' });
    if (isThere) {
      return res.status(400).json({
        message: 'You need superadmin access to create another superadmin.'
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    return res
      .status(200)
      .json({ message: 'Superadmin created successfully.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Invalid password for superadmin.' });
      }

      const token = generateToken(user);

      return res.status(200).json({
        message: 'Superadmin login successful.',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    } else {
      const superAdmin = await User.findOne({
        'subadmindetails.email': email
      });

      if (!superAdmin) {
        return res.status(404).json({ message: 'User does not exist.' });
      }

      const subAdminDetail = superAdmin.subadmindetails.find(
        (subAdmin) => subAdmin.email === email
      );

      if (!subAdminDetail || subAdminDetail.active === false) {
        return res
          .status(404)
          .json({ message: 'Sub-admin details not found.' });
      }

      const isMatch = await bcrypt.compare(password, subAdminDetail.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Invalid password for subadmin.' });
      }

      const decryptedDbName = decrypt(JSON.parse(subAdminDetail.dbname));
      subAdminDetail.role = 'subadmin';
      const token = generateToken(subAdminDetail, decryptedDbName);

      return res.status(200).json({
        message: 'Sub-admin login successful.',
        token,
        user: {
          id: subAdminDetail.id,
          email: subAdminDetail.email,
          role: subAdminDetail.role
        }
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res
        .status(400)
        .json({ message: 'Unauthorized to view all sub-admins.' });
    }

    const superAdmin = await User.findOne({ email: req.user.email });

    return res.status(200).json(superAdmin.subadmindetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};
