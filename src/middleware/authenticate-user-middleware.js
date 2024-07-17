const ROLES = require('../enums/role-enum');

exports.authenticateUser = async (req, res, next) => {
    const role = req.user.role;
    if (role === ROLES.USER) {
        next();
    } else {
        return res.status(403).json({error: 'Forbidden'});
    }
}