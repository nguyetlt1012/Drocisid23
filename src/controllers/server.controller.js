const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const Server = require('../models/server.model');
const Channel = require('../models/channel.model');
const ServerRoleGroup = require('../models/serverRoleGroup.model');
const serverPolicy = require('../constant/serverPolicy');
const UserServerRole = require('../models/userServerRole.model');

/**
 * @desc create server
 */
exports.create = catchAsync(async (req, res, next) => {
  const ownerId = req.body.ownerId;
  const user = await User.findOne({ __id: ownerId });

  if (!user) {
    return next(new AppError('Invalid user', 400));
  }

  const server = await Server.create(req.body);

  user.serverIds.push(server._id);
  await user.save();

  // create serverRoleGroup: owner, everyone
  await ServerRoleGroup.create({
    name: 'everyone',
    rolePolicies: serverPolicy.defaultPolicyEveryone,
    serverId: server._id,
  });

  const adminRole = await ServerRoleGroup.create({
    name: 'admin',
    rolePolicies: serverPolicy.defaultPolicyAdmin,
    serverId: server._id,
  });

  // create userServeRole for owner
  const userServerRole = await UserServerRole.create({
    serverId: server._id,
    userId: user._id,
    serverRoleGroupId: adminRole._id,
  });
  const channel = await Channel.create({ name: 'Chung', type: 'text', serverId: server._id });

  user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: {
      server,
      user,
      channel,
      adminRole,
      userServerRole,
    },
  });
});

exports.get = catchAsync(async (req, res, next) => {
  const server = await Server.findOne({ __id: req.body.id });

  res.status(200).json({
    status: 'success',
    data: {
      server,
    },
  });
});
