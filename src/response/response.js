const Response = {
    _resp: (res, httpStatus, apiStatus, message, data) => {
        return res.status(httpStatus).json({
            apiStatus,
            message,
            data,
        });
    },
};

module.exports = Response._resp;
