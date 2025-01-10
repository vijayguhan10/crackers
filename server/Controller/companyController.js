const { getCompanyModel } = require('../utils/dbUtil');

exports.createCompany = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to perform this action.' });
    }

    const db = req.db;
    const Company = getCompanyModel(db);

    const {
      companyname,
      companytagline,
      salesperson,
      personcontact,
      shopaddress,
      paymentterms,
      jobdescription,
      email,
      accountname,
      accountno,
      accounttype,
      bankname,
      branch,
      ifsc
    } = req.body;

    const company = new Company({
      companyname,
      companytagline,
      salesperson,
      personcontact,
      shopaddress,
      paymentterms,
      jobdescription,
      email,
      bankdetails: {
        accountname,
        accountno,
        accounttype,
        bankname,
        branch,
        ifsc
      }
    });

    await company.save();
    db.close();

    return res
      .status(200)
      .json({ message: 'Company created successfully.', company });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to perform this action.' });
    }

    const db = req.db;
    const Company = getCompanyModel(db);

    const company = await Company.findOne();
    db.close();

    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    return res.status(200).json(company);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to perform this action.' });
    }

    const db = req.db;
    const Company = getCompanyModel(db);
    const updatedData = req.body;

    const company = await Company.findOneAndUpdate({}, updatedData, {
      new: true
    });
    db.close();

    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    return res
      .status(200)
      .json({ message: 'Company updated successfully.', company });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to perform this action.' });
    }

    const db = req.db;
    const Company = getCompanyModel(db);

    const company = await Company.findOneAndDelete();
    db.close();

    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    return res.status(200).json({ message: 'Company deleted successfully.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error.', error: error.message });
  }
};
