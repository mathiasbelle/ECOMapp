/* eslint no-unused-vars: "off" */

exports.errorHandler = (error, req, res, next) => {
    console.log(error);
    error.status = error.status || 400;
    res.status(error.status).json({error: error.message});
}