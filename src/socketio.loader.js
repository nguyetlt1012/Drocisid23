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
            const channel = await ChannelService.getChannelDetail(channelId);
            const user = await UserService.getById(userId);

            // Nếu không tồn tại channel hoặc user không có quyền vào channel
            // if (!channelId || !channel || !channel.userIds?.find((x) => x._id.toString() === userId)) {
            //     socket.emit('rejectToChannel');
            //     return;
            // }
            if (!channelId || !channel) {
                socket.emit('rejectToChannel');
                return;
            }

            // Lấy channel từ cache
            const cacheChannel = JSON.parse((await redisClient.get(`channels/${channel._id}`)) || 'null');
            // Nếu đang join channel
            if (cacheChannel) {
                cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                await redisClient.set(`channels/${channel._id}`, JSON.stringify(cacheChannel));
            } else {
                await redisClient.set(
                    `channels/${channelId}`,
                    JSON.stringify({
                        listActiveUserId: arrayToSetArray([...(cacheChannel?.listActiveUserId || []), userId]),
                    }),
                );
            }

            socket.join(channelId);
            socket.channelId = channelId;

            console.log('User joined: ', userId, channelId);

            // Return initial channel data
            socket.emit('acceptToChannel', channel);

            // Emit to all user in channel that a new user joined
            socket.to(channelId).emit('userJoinedChannel', user);
        });

        socket.on('setupPeer', ({ isInitiator, from, to, channelId, signal }) => {
            console.log('setupPeer', isInitiator, from, '-->', to, `[${channelId}]`);

            // Chuyển signal cho các user khác nhận
            socket.to(channelId).emit('setupPeer', { isInitiator, from, to, channelId, signal });
        });

        socket.on('leaveChannel', async () => {
            const channel = await ChannelService.getChannelDetail(socket.channelId);

            console.log('User leaveChannel: ', socket.userId, socket.channelId);
            socket.leave(channel?._id);

            if (channel) {
                io.to(channel?._id).emit('userLeftChannel', socket.userId);

                const cacheChannel = JSON.parse(await redisClient.get(`channels/${channel._id}`), 'null');
                if (cacheChannel) {
                    cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                    await redisClient.set(`channels/${channel._id}`, JSON.stringify(cacheChannel));
                } else {
                    console.log('Cache channel not found');
                }
            }
        });

        socket.on('sendMessage', async ({ content, channelId }) => {
            console.log({ userId: socket.userId, content, channelId });
            const curChannel = await ChannelService.getChannelDetail(channelId);

            // if (!channelId || !curChannel || !curChannel.userIds?.find((x) => x._id.toString() === userId)) {
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
            const channel = await ChannelService.getChannelDetail(socket.channelId);

            console.log('User disconnect: ', socket.userId, socket.channelId);
            socket.leave(channel?._id);

            if (channel) {
                io.to(channel?._id).emit('userLeftChannel', socket.userId);

                const cacheChannel = JSON.parse(await redisClient.get(`channels/${channel._id}`), 'null');
                if (cacheChannel) {
                    cacheChannel.listActiveUserId = cacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                    await redisClient.set(`channels/${channel._id}`, JSON.stringify(cacheChannel));
                } else {
                    console.log('Cache channel not found');
                }
            }
        });
    });
}

module.exports = socketioLoader;
