const { OK, ERR } = require('../constant/index');
const ServerModel = require('../models/server.model')

const ServerService = {
    create: async (dataReq) => {
        try {
            const newServer = await ServerModel.create({
                ...dataReq
            });
            return {
                status: OK,
                data: newServer
            }
        } catch (error) {
            return {
                status: ERR,
                message: error.message
            }
        }
    },
    getAll: async(dataReq) => {
        try {
            const servers = await ServerModel.findAll(dataReq);
            return {
                status: OK,
                data: servers,
            }
            
        } catch (error) {
            return {
                status: ERR,
                message: error.message
            }
        }
    },
    getAllCreatedByUser: async(dataReq) => {
        try {
            
        } catch (error) {
            
        }
    },
    getAllServerJoinedByUser: async (dataReq) => {
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = ServerService