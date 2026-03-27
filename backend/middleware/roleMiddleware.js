const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Please login before using this route.' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Role "${req.user.role}" is not allowed to access this route.`,
    });
  }

  return next();
};

module.exports = { authorize };
