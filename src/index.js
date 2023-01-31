require('dotenv').config({ path: './.env' });
const { ServerRouter, UserRouter, ChannelRouter, InviteRouter, MessageRouter } = require('./routes/index.router');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const {Server} = require('socket.io')
const app = express();
app.use(cors())

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
app.use('/api/v1/messages', MessageRouter)
//start server
const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

const io = new Server(server)
io.on('connection', (socket) => {
  console.log(socket)
  console.log('a user connected')
  socket.off('setup', () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  })
})

