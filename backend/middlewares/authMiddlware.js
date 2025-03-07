const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req,res,next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized,no token " });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      res.status(500).json({ message: "Not Authorized token failed" });
    }
}
module.exports = protect;