const jwt = require("jsonwebtoken");
const { getDatabaseConnection, getUserModel } = require("../utils/dbUtil");

const JWT_SECRET = process.env.JWT_SECRET || "abcdefg!@$$@%^&%sdds/ffg";

const dbMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (decoded.role === "subadmin") {
      const superAdminConnection = getDatabaseConnection("cracker");
      const SuperAdminModel = getUserModel(superAdminConnection);

      const subAdmin = await SuperAdminModel.findOne({
        "subadmindetails.email": decoded.email,
      });
      if (!subAdmin) {
        return res.status(404).json({ message: "Subadmin not found." });
      }
      const subAdminDetails = subAdmin.subadmindetails.find(
        (sa) => sa.email === decoded.email
      );

      if (!subAdminDetails || !subAdminDetails.status) {
        return res
          .status(400)
          .json({ message: "Subadmin or company is deactivated." });
      }
      const dbName = decoded.databaseName;
      if (!dbName) {
        return res
          .status(400)
          .json({ message: "Database name missing for subadmin." });
      }
      req.db = getDatabaseConnection(dbName);
      console.log("req.db", req.db);
    }
    next();
  } catch (error) {
    res
      .status(400)
      .json({ message: "Authentication failed.", error: error.message });
  }
};

module.exports = dbMiddleware;
