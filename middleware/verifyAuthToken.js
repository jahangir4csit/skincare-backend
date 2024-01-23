const jwt = require("jsonwebtoken");
const verifyIsLoggedIn = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const bearer = token.split(" ");
      const bearerToken = bearer[1];
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).send("Unauthorized. Invalid Token");
    }
  } catch (err) {
    next(err);
  }
};

const verifyIsAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).send("Unauthorized. Admin required");
  }
};

module.exports = { verifyIsLoggedIn, verifyIsAdmin };
