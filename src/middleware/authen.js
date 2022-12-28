require("dotenv").config();
const { apiStatus, httpStatus } = require('../constant');
const CusError = require('../error/error');
const _resp = require('../response/response');
const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const Authen = {
    verifyToken: async (req, res, next) => {
        try {
            const bearerToken = req.headers.authorization;
            if (bearerToken === undefined || !bearerToken.startsWith('Bearer ')) throw new Error(`Invalid Token`);
            const token = (bearerToken && bearerToken.split(' ')[1]) || req?.cookies.jwt;
            if (!token) throw new CusError(apiStatus.AUTH_ERROR, httpStatus.UNAUTHORIZED, `Invalid token`);
            
            const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            const currentUser = await UserModel.findOne({_id: decode.id})
            if (!currentUser)
                throw new CusError(apiStatus.AUTH_ERROR, httpStatus.UNAUTHORIZED, 'Cant get customer from token');
            
            req.body.userId = currentUser.id;
            next();
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
};

module.exports = Authen;
