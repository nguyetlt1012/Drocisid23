const serverPolicy = {
  //
  READ: 0,
  MANAGE_CHANNEL: 1,
  MANAGE_ROLE: 2,
  CREATE_INVITE: 3,
  CREATE_MESSAGE: 4,
  MANAGE_MESSAGE: 5, // user can pin, delete message 
  VIEW_CHANNEL: 6,
};

module.exports = serverPolicy
