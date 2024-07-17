const ROLES = require('../enums/role-enum');

exports.authenticateSeller = async (req, res, next) => {
    const role = req.user.role;
    if (role === ROLES.SELLER) {
        next();
    } else {
        return res.status(403).json({error: 'Forbidden'});
    }
}