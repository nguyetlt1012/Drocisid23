//This file is used to expose routers

const ServerRouter = require('./server.router');
const UserRouter = require('./user.router');
const ChannelRouter = require('./channel.router');
const MessageRouter = require('./message.router')

module.exports = {
  ServerRouter,
  UserRouter,
  ChannelRouter,
  MessageRouter
};
