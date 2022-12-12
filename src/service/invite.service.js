const InviteService = {
    createService: async(owner, expire, source, type) => {
        try {
         return {
            status: 'Success',
            data: {}
         }   
        } catch (error) {
            return {
                status: 'Err',
                data: error.message
            }
        }
    }
}

module.export = InviteService