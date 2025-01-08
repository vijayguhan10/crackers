const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const SuperAdmin = require("../Model/User"); // Adjust the path as needed

const JWT_SECRET = process.env.JWT_SECRET || "abcdefg!@$$@%^&%sdds/ffg";

const dbMiddleware = async (req, res, next) => {
  try {
    // console.log("consoling the requested data : ", req);
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (decoded.role === "subadmin") {
      const superAdminDbUri = process.env.DATABASE.replace(
        "<DATABASE>",
        "cracker"
      );
      const superAdminConnection = await mongoose.createConnection(
        superAdminDbUri
      );

      const SuperAdminModel = superAdminConnection.model("User", SuperAdmin);
      const subAdmin = await SuperAdminModel.findOne({
        "subadmindetails.email": decoded.email,
      });

      if (!subAdmin) {
        return res.status(404).json({ message: "Subadmin not found." });
      }
      const subAdminDetails = subAdmin.subadmindetails.find(
        (sa) => sa.email === decoded.email
      );
      if (!subAdminDetails || !subAdminDetails.active) {
        return res
          .status(403)
          .json({ message: "Subadmin or company is deactivated." });
      }
      const dbName = decoded.databaseName;
      if (!dbName) {
        return res
          .status(400)
          .json({ message: "Database name missing for subadmin." });
      }

      const dbUri = process.env.DATABASE.replace("<DATABASE>", dbName);
      req.db = mongoose.createConnection(dbUri);
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed.", error: error.message });
  }
};

module.exports = dbMiddleware;
