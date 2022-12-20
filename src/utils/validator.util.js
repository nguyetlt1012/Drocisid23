
const validate = {
    validatorInput: (req) => {
        return true;
    },
    checkParamRequest: async (req, params) => {
        let missingParams = params.filter((item) => {
            return !eval(`req.body.${item}`);
        });
        if (missingParams.length === 0)
            return {
                status: 'ok',
            };
        return {
            status: 'Err',
            message: 'Parameter(s) missing: ' + missingParams.join(','),
        };
    },
};

module.exports = { validate };
