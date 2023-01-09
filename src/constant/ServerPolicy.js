const serverPolicy = {
  // Only owner can delete server
  OWNER: 0,
  // can modify description, kick user, change typeofserver, change name of server
  MANAGE_SERVER: 1,
  // create role group, add policy
  MANAGE_ROLE: 2,
  MANAGE_INVITE: 3,
  // user can create channel
  CREATE_CHANNEL: 4,
};

module.exports = serverPolicy
