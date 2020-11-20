const jwt = require("jsonwebtoken");

// verify token middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!authHeader || token == null) {
    let err = new Error("No authentication information");
    err.status = 401;
    return next(err);
  }

  jwt.verify(token, process.env.SECRET, (err, payload) => {
    if (err) {
      let err = new Error("Token couldn't be verified.");
      err.status = 403;
      return next(err);
    }

    req.user = payload;
    next();
  });
  // Bearer TOKEN
}

module.exports = authenticateToken;
