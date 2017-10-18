const touch = require('touch');

const fakeUser = function(username, password='password') {
  touch('./server/convos/'+username);
  return {
    username,
    password,
    unread: new Set()
  }
}

const fakeUserList = [
  fakeUser('Jimmy'),
  fakeUser('Alex','secret'),
  fakeUser('George')
];

module.exports = {
  userList: fakeUserList
};
