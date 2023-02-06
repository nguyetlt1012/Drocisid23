const jwt = require('jsonwebtoken');
const ChannelService = require('./service/channel.service');
const { redisClient } = require('./redis.loader');
const MessageService = require('./service/message.service');
const UserService = require('./service/user.service');

function arrayToSetArray(arr) {
    return [...new Set(arr)];
}

function socketioLoader(server) {
    /**
     * @type {import('socket.io').Server}
     */
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            credentials: true,
        },
    });

    // Middleware
    io.use(async (socket, next) => {
        const { accessToken } = socket.handshake.query;

        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.userId = decoded.id;
            return next();
        });
    });

    io.on('connection', async (socket) => {
        const userId = socket.userId;
        console.log('New connection: ', userId);

        socket.on('joinChannel', async (channelId) => {
            const channel = await ChannelService.getChannelForSocketIO(channelId);
            const user = (await UserService.getById(userId)).data;

            // Nếu không tồn tại channel hoặc user không có quyền vào channel
            // if (!channelId || !channel || !channel.users?.find((x) => x._id.toString() === userId)) {
            //     socket.emit('rejectToChannel');
            //     return;
            // }
            if (!channelId || !channel) {
                socket.emit('rejectToChannel');
                return;
            }
            // Out cac channel khac
            if (socket.channelId) {
                // socket.to(socket.channelId).emit('userLeftChannel', socket.userId);
                socket.leave(socket.channelId);
                const cacheChannel = JSON.parse((await redisClient.get(`channels/${socket.channelId}`)) || 'null');
                cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                if (cacheChannel) {
                    await redisClient.set(`channels/${socket.channelId}`, JSON.stringify(cacheChannel));
                }
            }

            // Push user vào cache channel
            const cacheChannel = JSON.parse((await redisClient.get(`channels/${channel._id}`)) || 'null');
            await redisClient.set(
                `channels/${channelId}`,
                JSON.stringify({
                    listActiveUserId: arrayToSetArray([...(cacheChannel?.listActiveUserId || []), userId]),
                }),
            );

            socket.join(channelId);
            socket.channelId = channelId;
            console.log('User joined: ', userId, channelId);

            // Lấy channel từ cache

            // Return initial channel data
            socket.emit('acceptToChannel', channel);
            if (channel.type === 'voice') {
                socket.emit('acceptToVoiceChannel', channel);
            }

            // Emit to all user in channel that a new user joined
            socket.to(channelId).emit('userJoinedChannel', user);
            if (channel.type === 'voice') {
                socket.to(channelId).emit('userJoinedVoiceChannel', user);
            }
        });

        socket.on('setupPeer', ({ isInitiator, from, to, channelId, signal }) => {
            console.log('setupPeer', isInitiator, from, '-->', to, `[${channelId}]`);

            // Chuyển signal cho các user khác nhận
            socket.to(channelId).emit('setupPeer', { isInitiator, from, to, channelId, signal });
        });

        socket.on('leaveChannel', async () => {
            const channelId = socket?.channelId;
            console.log('User leaveChannel: ', socket.userId, channelId);
            socket.leave(channelId);

            io.to(channelId).emit('userLeftChannel', socket.userId);

            if (channelId) {
                const cacheChannel = JSON.parse(await redisClient.get(`channels/${channelId}`), 'null');
                if (cacheChannel) {
                    cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                    await redisClient.set(`channels/${channelId}`, JSON.stringify(cacheChannel));
                }
            }
        });

        socket.on('sendMessage', async ({ content, channelId }) => {
            console.log({ userId: socket.userId, content, channelId });
            const curChannel = await ChannelService.getChannelForSocketIO(channelId);

            // if (!channelId || !curChannel || !curChannel.users?.find((x) => x._id.toString() === userId)) {
            //     socket.emit('rejectToChannel');
            //     return;
            // }
            if (!channelId || !curChannel) {
                socket.emit('rejectToChannel');
                return;
            }

            const newMessage = await MessageService.sendMessage(content, channelId, userId);

            io.to(channelId).emit('newMessage', newMessage.data);
        });

        socket.on('disconnect', async () => {
            const channelId = socket?.channelId;
            console.log('User disconnect: ', socket.userId, channelId);
            socket.leave(channelId);

            io.to(channelId).emit('userLeftChannel', socket.userId);

            if (channelId) {
                const cacheChannel = JSON.parse(await redisClient.get(`channels/${channelId}`), 'null');
                if (cacheChannel) {
                    cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                    await redisClient.set(`channels/${channelId}`, JSON.stringify(cacheChannel));
                }
            }
        });
    });
}

module.exports = socketioLoader;
