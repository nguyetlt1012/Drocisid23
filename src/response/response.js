const Response = {
    _resp: (res, apiStatus, httpStatus, data) => {
        return res.status(httpStatus).json({
            apiStatus,
            data
        })
    }
}

module.export = Response