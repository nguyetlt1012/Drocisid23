const serverPolicy = {
  //
  READ: 0,
  MANAGE_CHANNEL: 1,
  MANAGE_ROLE: 2,
  CREATE_INVITE: 3,
  CREATE_MESSAGE: 4,
  DELETE_MESSAGE: 5,
  VIEW_CHANNEL: 6,
  MANAGE_MESSAGE: 7,
};
const defaultPolicyEveryone = [serverPolicy.CREATE_MESSAGE, serverPolicy.VIEW_CHANNEL];
const defaultPolicyAdmin = [serverPolicy.MANAGE_CHANNEL, serverPolicy.MANAGE_ROLE, serverPolicy.MANAGE_MESSAGE];
// exports.defaultPolicyEveryone = defaultPolicyEveryone;
// exports.defaultPolicyAdmin = defaultPolicyAdmin;
module.exports = {
  defaultPolicyEveryone,
  defaultPolicyAdmin,
};
