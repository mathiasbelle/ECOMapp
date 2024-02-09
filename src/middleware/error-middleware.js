exports.errorHandler = (error, req, res, next) => {
    console.log(error);
    error.status ||= 400;
    res.status(error.status).send(error.message);
}