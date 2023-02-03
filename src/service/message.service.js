const { ERR } = require('../constant');
const { OK } = require('../constant/HttpStatus');
const { deleteMessage } = require('../controllers/message.controller');
const MessageModel = require('../models/message.model');

const MessageService = {
    sendMessage: async (content, channelId, authorId) => {
        try {
            const insertResult = await MessageModel.create({
                author: authorId,
                channelId: channelId,
                content: content,
            });
            const message = await MessageModel.findById(insertResult._id).populate('author', 'fullname avatarUrl');
            return {
                status: OK,
                data: message,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
    getAllMessages: async (channelId) => {
        try {
            const messages = await MessageModel.find({
                channelId: channelId,
            })
                .sort({
                    $natural: 1,
                })
                .limit(20)
                .populate('author', 'fullname avatarUrl');
            return {
                status: OK,
                data: messages,
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
    deleteMessage: async (messageId) => {
        try {
            await MessageModel.deleteOne({
                id: messageId,
            });
            return {
                status: OK,
                data: 'message is deleted',
            };
        } catch (error) {
            return {
                status: ERR,
                data: error.message,
            };
        }
    },
};

module.exports = MessageService;
