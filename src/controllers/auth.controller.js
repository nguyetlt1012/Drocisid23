const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _resp = require('../response/response');
const CusError = require('../error/error');
const userService = require('../service/user.service');
const { httpStatus, apiStatus, messageResponse, OK, ERR } = require('../constant/index');
const { validate } = require('../utils/validator.util');
const validator = require('validator');
const Email = require('../utils/email');
const { promisify } = require('util');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (data, res) => {
    const token = signToken(data._id);
    _resp(res, httpStatus.OK, apiStatus.SUCCESS, messageResponse.SUCCESS, {data, token});
};

const AuthController = {
    signup: async (req, res, next) => {
        try {
            const valid = await validate.checkParamRequest(req, ['fullname', 'email', 'password']);
            if (valid.status == ERR) {
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, valid.message);
            }

            const data = await userService.create(req.body);
            if (data.status == ERR) {
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
            if (valid.status == ERR) {
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
            data.password = undefined
            createSendToken(data, res);

        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    forgotPassword: async(req, res, next) =>{
        try {
            const email = req.body.email;
            if (!validator.isEmail(email)){
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, "Invalid email");
            }

            const user = await userService.getByEmail(email);
            if (!user) {
                throw new CusError(apiStatus.AUTH_ERROR, httpStatus.BAD_REQUEST, 'Not found email');
            }
            // should send email
            const resetToken = await signToken(user.id);
            const url = `${process.env.CLIENT_URL}/reset-password${resetToken}`;
            
            await new Email(user, url).sendPasswordReset();

            _resp(res, httpStatus.OK, apiStatus.SUCCESS, messageResponse.SUCCESS, {message: "Token send to your email"});

        } catch (error) { 
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    },
    resetPassword: async (req, res, next) =>{
        try {
            // console.log(req.query);
            const decode = await promisify(jwt.verify)(req.query.token, process.env.JWT_SECRET);
            if (!decode){
                throw new CusError(apiStatus.AUTH_ERROR, httpStatus.BAD_REQUEST, 'Token is invalid');
            }

            const {email, password} = req.body;
            if (!validator.isEmail(email)){
                throw new CusError(apiStatus.INVALID_PARAM, httpStatus.BAD_REQUEST, "Invalid email");
            }

            const user = await userService.resetPassword(email, password, decode.id);
            if (user.status == ERR) {
                throw new CusError(apiStatus.DATABASE_ERROR, httpStatus.OK, user.message);
            }

            createSendToken(user, res);
        } catch (error) {
            if (error instanceof CusError) {
                _resp(res, error.httpStatus, error.apiStatus, error.message, {});
            } else {
                _resp(res, httpStatus.INTERNAL_SERVER_ERROR, apiStatus.OTHER_ERROR, error.message, {});
            }
        }
    }
};

module.exports = AuthController;
