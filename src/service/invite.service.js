const { OK, ERR } = require('../constant/index');
const ChannelModel = require('../models/channel.model');
const InviteModel = require('../models/invite.model');
const ServerModel = require('../models/server.model');


const InviteService = {
    createInvite: async (owner, expire, sourceId, type) => {
        try {
            const src = !type ? await ServerModel.findById(sourceId) : await ChannelModel.findById(sourceId)
            if(!src) throw new Error(`SourceId : ${sourceId} is not exist`);
            const expireAt = new Date(Date.now() + expire)
            const newInvite = await InviteModel.create({
                inviteCode: generateRandomCode(),
                createBy: owner,
                expireTime: expire,
                source: sourceId,
                inviteType: type,
                expireAt: expireAt
            });

            if (!newInvite) throw new Error(`Cant create invite link`);
            return {
                status: OK,
                data: newInvite,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
    getInviteByCode: async (code) => {
        try {
            const invite = await InviteModel.findOne({
                inviteCode: code
            })
            if(!invite) throw new Error(`Cant get invite by code: ${code}`)
            return {
                status: OK,
                data: invite
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    },
    join: async (code, userRequestId) => {
        // find the source with code
        const invite = await InviteModel.findOne({ inviteCode: code });
        if (invite.expireTime && invite.createAt + invite.expireTime > new Date()) throw new Error(`Code is expired`);
        // if source is channel
        if (invite.inviteType) {
            // get Channel and update memberIds
            const channel = await ChannelModel.findByIdAndUpdate(invite.source, {
                $push: {
                    users: userRequestId,
                },
            });
        } else {
            // const server
        }
    },
};



const  generateRandomCode =  () => {
    return Math.floor(Math.random() * Date.now()).toString(16)
}


module.exports = InviteService