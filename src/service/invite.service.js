const { OK, ERR } = require("../constant/index");
const ChannelModel = require("../models/channel.model");
const InviteModel = require("../models/invite.model")
const InviteService = {
    create: async(owner, expire, source, type) => {
        try {
            const newInvite = new InviteModel({
                createBy: owner,
                expireTime: expire,
                source: source,
                inviteType: type,
            })
            await newInvite.save();
            
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    },
    join: async (code, userRequestId) => {
        // find the source with code
        const invite = await InviteModel.findOne({inviteCode: code})
        if(invite.expireTime && invite.createAt + invite.expireTime > new Date()) throw new Error(`Code is expired`) 
        // if source is channel
        if(invite.inviteType) {
            // get Channel and update memberIds
            const channel = await ChannelModel.findByIdAndUpdate(invite.source, {
                $push: {
                    userIds: userRequestId
                }
            })
            
        }
        else {
            // const server
        }
    }
}

module.export = InviteService