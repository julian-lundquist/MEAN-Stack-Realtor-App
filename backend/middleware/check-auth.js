const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_realtor_log_123_cba");
    next();
  } catch (e) {
    res.status(401).json({ message: 'Authorization failed' })
  }
}
