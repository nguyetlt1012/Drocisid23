const { httpStatus } = require('../constant');
const InviteService = require('../service/')
const { validatorInput } = require('../utils/validator.util')

const InviteController = {
    createInvite: async (req, res, next) => {
        try {
            const valid = await validatorInput(req, expectedParam);
            if(valid.status === 'Err') {
                //process error
                //throw CusError
            }
            //call service
            const resData = await InviteService.createInvite()
            if(resData.status === 'Err') {
                //process error
                //throw CusError

            }

        } catch (error) {
            if(error instanceof CusError) {
                _resp(res, error.apiStatus, error.httpStatus, error.message)
            }
            else {
                
            }
        }
    }
}

module.export = InviteController