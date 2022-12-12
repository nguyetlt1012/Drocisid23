class CusError extends Error {
    constructor(apiStatus, httpStatus, message) {
        super(message)
        this.apiStatus = apiStatus
        this.httpStatus = httpStatus
    }
}

module.exports = CusError