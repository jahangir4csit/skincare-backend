const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, name, lastName, email, isAdmin, role) => {
  return jwt.sign(
    { _id, name, lastName, email, isAdmin, role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7h" }
  );
};
module.exports = generateAuthToken