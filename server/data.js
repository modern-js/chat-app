const faker = require('./faker');

const getUsers = function() {
  return faker.userList; // leaving it like this unless I have time to make user registration
}

const getConvoAmong = function(A, B) {
  return [];
}

const getUserForAuth = function(username, password) {
  users = getUsers();
  for (let i in users) {
    user = users[i];
    if (user.username===username && user.password==password)
      return user;
  }
}

const getUser = function(username) {
  users = getUsers();
  for (let i in users) {
    user = users[i];
    if (user.username===username)
      return user;
  }
}

module.exports = {
  getUsers,
  getUser,
  getUserForAuth,
  getConvoAmong
}
