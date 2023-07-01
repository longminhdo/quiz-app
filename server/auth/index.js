const { UserRole } = require('../constant/role');
const AppError = require('../helper/AppError');

module.exports.checkAuth = () => {};

exports.checkRole = (hasRole = [UserRole.TEACHER]) => (req, res, next) => {
  const { role } = req.userData;

  if (!role) return next(new AppError(401, 'Unauthorized'));

  if (hasRole.includes(role)) return next();

  return next(new AppError(401, 'Unauthorized'));
};
