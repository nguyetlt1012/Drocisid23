class CusError extends Error {
    constructor(apiStatus, httpStatus, message) {
        this.apiStatus = apiStatus
        this.httpStatus = httpStatus
        this.message = message
    }
}

module.export = CusError