
const validate = {
    checkParamRequest: async (req, params) => {
        let missingParams = params.filter((item) => {
            return !eval(`req.body.${item}`);
        });
        if (missingParams.length === 0)
            return {
                status: 'OK',
            };
        return {
            status: 'ERROR',
            message: 'Parameter(s) missing: ' + missingParams.join(','),
        };
    },
};

module.exports = { validate };
