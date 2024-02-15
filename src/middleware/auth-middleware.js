const jwt = require('jsonwebtoken');
const userService = require('../services/user-service');

exports.authenticateToken = async (req, res, next) => {
    const {authorization} = req.headers;
    //console.log(authorization);

    const token = (authorization ?? '').split(' ')[1];

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET, {
            audience: 'users',
            issuer: 'login'
        });
        //console.log(result);
        req.tokenPayload = result;
        req.user = await userService.getOne(result.id);
        //console.log(req.user);
        next();

    } catch (error) {
        return res.sendStatus(403);
    }

}