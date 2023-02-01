require('dotenv').config({ path: './.env' });
const { ServerRouter, UserRouter, ChannelRouter, MessageRouter } = require('./routes/index.router');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketioLoader = require('./socketio.loader');
const { redisLoader } = require('./redis.loader');

const app = express();
app.use(cors());
const server = require('http').createServer(app);

// Socket.io
socketioLoader(server);

// Redis
redisLoader();

const PORT = process.env.SERVER_PORT || 3000;

//connect to db
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('DB connection successfully!'))
    .catch((err) => new Error(err.message));

app.use(express.json());

// Routers
app.use('/api/v1/servers', ServerRouter);
app.use('/api/v1/users', UserRouter);
// app.use('/api/v1/invites', InviteRouter);
app.use('/api/v1/channels', ChannelRouter);
app.use('/api/v1/messages', MessageRouter);

//start server
server.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
