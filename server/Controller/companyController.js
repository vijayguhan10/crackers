const mongoose = require("mongoose");
const companySchema = require("../Model/Company");

const getDbConnection = (databaseName) => {
  const dbLink = process.env.DATABASE.replace("<DATABASE>", databaseName);
  return mongoose.createConnection(dbLink);
};

exports.createCompany = async (req, res) => {
  try {
    if (req.user.role !== "subadmin") {
      return res
        .status(400)
        .json({ message: "Unauthorized to perform this action." });
    }

    const dbName = req.user.databaseName;
    if (!dbName) {
      return res
        .status(400)
        .json({ message: "Database name missing in the token." });
    }

    const dbConnection = getDbConnection(dbName);
    const Company = dbConnection.model("Company", companySchema);

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
      ifsc,
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
        ifsc,
      },
    });

    await company.save();
    dbConnection.close();

    return res
      .status(200)
      .json({ message: "Company created successfully.", company });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    if (req.user.role !== "subadmin") {
      return res
        .status(400)
        .json({ message: "Unauthorized to perform this action." });
    }

    const dbName = req.user.databaseName;
    if (!dbName) {
      return res
        .status(400)
        .json({ message: "Database name missing in the token." });
    }

    const dbConnection = getDbConnection(dbName);
    const Company = dbConnection.model("Company", companySchema);

    const { id } = req.params;
    const company = await Company.findById(id);
    dbConnection.close();

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    return res.status(200).json(company);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

exports.updateCompanyById = async (req, res) => {
  try {
    if (req.user.role !== "subadmin") {
      return res
        .status(400)
        .json({ message: "Unauthorized to perform this action." });
    }

    const dbName = req.user.databaseName;
    if (!dbName) {
      return res
        .status(400)
        .json({ message: "Database name missing in the token." });
    }

    const dbConnection = getDbConnection(dbName);
    const Company = dbConnection.model("Company", companySchema);

    const { id } = req.params;
    const updatedData = req.body;

    const company = await Company.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    dbConnection.close();

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    return res
      .status(200)
      .json({ message: "Company updated successfully.", company });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

exports.deleteCompanyById = async (req, res) => {
  try {
    if (req.user.role !== "subadmin") {
      return res
        .status(400)
        .json({ message: "Unauthorized to perform this action." });
    }

    const dbName = req.user.databaseName;
    if (!dbName) {
      return res
        .status(400)
        .json({ message: "Database name missing in the token." });
    }

    const dbConnection = getDbConnection(dbName);
    const Company = dbConnection.model("Company", companySchema);

    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    dbConnection.close();

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    return res.status(200).json({ message: "Company deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};
