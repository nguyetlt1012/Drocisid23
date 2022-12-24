const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _resp = require('../response/response');
const CusError = require('../error/error');
const userService = require('../service/user.service');
const { httpStatus, apiStatus, messageResponse } = require('../constant/index');
const { validate } = require('../utils/validator.util');



const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (data, res) => {
    const token = signToken(data._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    data.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    _resp(res, httpStatus.OK, apiStatus.SUCCESS, messageResponse.SUCCESS, {data, token});
};

const AuthController = {
    signup: async (req, res, next) => {
        try {
            const valid = await validate.checkParamRequest(req, ['fullname', 'email', 'phone', 'gender', 'password']);
            if (valid.status == 'Err') {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, valid.message);
            }

            const data = await userService.create(req.body);
            if (data.status == 'Err') {
                throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.OK, data.message);
            }

            createSendToken(data, res);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    login: async (req, res, next) => {
        try {
            const valid = await validate.checkParamRequest(req, ['email', 'password']);
            if (valid.status == 'Err') {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, valid.message);
            }

            const data = await userService.getByEmail(req.body.email);
            if (!data) {
                throw new CusError(apiStatus.AUTH_ERROR, httpStatus.BAD_REQUEST, 'Not found email');
            }

            const verifyPass = await bcrypt.compare(req.body.password, data.password);
            if (!verifyPass) throw new CusError(apiStatus.AUTH_ERROR, httpStatus.BAD_REQUEST, 'Incorrect Password');

            if (data.status === '0')
                throw new CusError(
                    apiStatus.AUTH_ERROR,
                    httpStatus.UNAUTHORIZED,
                    'Your account has been blocked for some reasons. Please contact us for supports or create a new account',
                );
            
            createSendToken(data, res);

        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
};

module.exports = AuthController;
