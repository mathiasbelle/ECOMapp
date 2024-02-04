exports.errorHandler = (error, req, res, next) => {
    console.log(error);
    const status = error.status || 400;
    res.status(status).send(error.message);
}