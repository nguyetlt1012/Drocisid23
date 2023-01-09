require('dotenv').config({ path: './.env' });
const { ServerRouter, UserRouter, ChannelRouter, InviteRouter } = require('./routes/index.router');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.SERVER_PORT || 8080;

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

//start server
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
