const jwt = require('jsonwebtoken');
const ChannelService = require('./service/channel.service');
const { Server } = require('socket.io');
const { redisClient } = require('./redis.loader');

function socketioLoader(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    // Middleware
    io.use(async (socket, next) => {
        const { accessToken } = socket.handshake.query;

        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.userId = decoded;
            return next();
        });
    });

    io.on('connection', async (socket) => {
        const userId = socket.userId;
        console.log('New connection: ', socket._id);

        socket.on('joinVoiceChannel', async (channelId) => {
            const curChannel = await ChannelService.getChannelDetail(channelId);

            if (!channelId || !curChannel || !curChannel.userIds?.find((x) => x._id.toString() === userId)) {
                socket.emit('rejectToChannel');
                return;
            }

            socket.join(channelId);
            socket.channelId = channelId;

            // curChannel.listActiveUser.push(curUser);
            // await curChannel.save();

            const cacheChannel = await redisClient.get(`channels/${channelId}`);
            if (!cacheChannel) {
                await redisClient.set(`channels/${channelId}`, JSON.stringify({ listActiveUserId: [userId] }));
            } else {
                const curCacheChannel = JSON.parse(cacheChannel);
                curCacheChannel.listActiveUserId.push(userId);
                await redisClient.set(`channels/${channelId}`, JSON.stringify(curCacheChannel));
            }

            console.log('User joined: ', userId, channelId);

            // Return initial channel data
            socket.emit('acceptToVoiceChannel', curChannel);

            // Emit to all user in channel that a new user joined
            socket.to(channelId).emit('userJoinedVoiceChannel', curUser);
        });

        socket.on('setupPeer', ({ isInitiator, from, to, channelId, signal }) => {
            console.log('setupPeer', isInitiator, from, '-->', to, `[${channelId}]`);

            // Chuyển signal cho các user khác nhận
            socket.to(channelId).emit('setupPeer', { isInitiator, from, to, channelId, signal });
        });

        socket.on('leaveVoiceChannel', async () => {
            const curChannel = await ChannelService.getChannelDetail(socket.channelId);

            console.log('User leaveChannel: ', socket.userId, curChannel?._id);
            socket.leave(curChannel?._id);

            if (curChannel) {
                io.to(curChannel?._id).emit('userLeftVoiceChannel', socket.userId);

                const cacheChannel = await redisClient.get(`channels/${curChannel._id}`);
                if (cacheChannel) {
                    const curCacheChannel = JSON.parse(cacheChannel);
                    curCacheChannel.listActiveUserId = curCacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                    await redisClient.set(`channels/${curChannel._id}`, JSON.stringify(curCacheChannel));
                } else {
                    console.log('Cache channel not found');
                }
            }
        });

        socket.on('disconnect', async () => {
            const curChannel = await ChannelService.getChannelDetail(socket.channelId);

            console.log('User leaveChannel: ', socket.userId, curChannel?._id);
            socket.leave(curChannel?._id);

            if (curChannel) {
                io.to(curChannel?._id).emit('userLeftVoiceChannel', socket.userId);

                const cacheChannel = await redisClient.get(`channels/${curChannel._id}`);
                if (cacheChannel) {
                    const curCacheChannel = JSON.parse(cacheChannel);
                    curCacheChannel.listActiveUserId = curCacheChannel.listActiveUserId.filter((x) => x !== socket.userId);
                    await redisClient.set(`channels/${curChannel._id}`, JSON.stringify(curCacheChannel));
                } else {
                    console.log('Cache channel not found');
                }
            }
        });
    });
}

module.exports = socketioLoader;
