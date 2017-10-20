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
  fakeUser('Alex'),
  fakeUser('George'),
  fakeUser('Rati')
];

module.exports = {
  userList: fakeUserList
};
