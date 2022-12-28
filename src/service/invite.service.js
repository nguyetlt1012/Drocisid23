const { OK, ERR } = require("../constant/index")

const InviteService = {
    create: async(owner, expire, source, type) => {
        try {
         return {
            status: OK,
            data: {}
         }   
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    }
}

module.export = InviteService