const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.cookies?.universityToken;
    // console.log("univers"+token);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Token missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("decoded university",decoded);
    next();

  } catch (err) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};