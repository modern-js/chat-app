const fs = require('fs');
const userData = require('./userData');
const users = userData.userList;

const userLog = function(username) { return './server/convos/'+username; };

const post = function(sender, target, message) {
  let stamp = + new Date();
  let line = stamp+";"+sender+";"+target+";"+message+"\n";
  for (let i in users)
    if ( users[i].username === target ) users[i].unread.add(sender);
    else if ( users[i].username === sender ) users[i].unread.add(target);

  fs.writeFile(userLog(sender), line, {'flag':'a'}, (err)=>{});
  if (sender!=target)
    fs.writeFile(userLog(target), line, {'flag':'a'}, (err)=>{});
}

const conversation = function(sender, target) {
  let contents = fs.readFileSync(userLog(sender), 'utf8');
  let lines = contents.split('\n');

  if (lines.length===0) return [];
  if (lines[lines.length-1].length===0 ) lines.splice(-1,1);

  let relevant = [];

  for (let i in lines) {
    let line = lines[i];
    let stamp = line.substr(0,line.indexOf(';'));
    line = line.substr(line.indexOf(';')+1);
    let lineSender = line.substr(0,line.indexOf(';'));
    line = line.substr(line.indexOf(';')+1);
    let lineTarget = line.substr(0,line.indexOf(';'));
    line = line.substr(line.indexOf(';')+1);

    let convo = {
      sender: lineSender,
      target: lineTarget,
      message: line,
      stamp: parseInt(stamp)
    }
    if ((lineSender===target && lineTarget==sender) || (lineTarget===target && lineSender===sender))
      relevant.push(convo);
  }
  return relevant;
}

const seen = function(target, sender) {
  for (let i in users)
    if ( users[i].username === target ) users[i].unread.delete(sender);
}

const notifications = function(target) {
  for (let i in users)
    if ( users[i].username === target ) return Array.from(users[i].unread);
}

module.exports = {
  post,
  conversation,
  seen,
  notifications
};
