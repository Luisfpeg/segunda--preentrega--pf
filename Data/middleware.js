// middleware.js
const checkUserRole = (role) => {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        next();
      } else {
        res.status(403).send('Access Forbidden');
      }
    };
  };
  
  module.exports = {
    checkUserRole,
  };
  