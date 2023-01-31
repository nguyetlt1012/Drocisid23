const { ERR } = require("../constant");
const { OK } = require("../constant/HttpStatus");
const MessageModel = require("../models/message.model");


const MessageService = {
    sendMessage: async (content, channelId, authorId) => {
        try {
            const data = await MessageModel.create({
                author_id: authorId,
                channelId: channelId,
                content: content
            })
            return {
                status: OK,
                data: data
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            };
        }
    },
    getAllMessages: async (channelId) => {
        try {
            const messages = await MessageModel.find({
                channelId: channelId
            }).sort({
                $natural: 1
            }).limit(20).populate('author_id', 'fullname avatarUrl')
            return {
                status: OK,
                data: messages
            }
        } catch (error) {
            return {
                status: ERR,
                data: error.message
            }
        }
    }
};

module.exports = MessageService