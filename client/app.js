const makeButton = (text, action) => {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.onclick = action;
  return btn;
};

const root = document.getElementById('app');
const output = document.createElement('div');

const withLogResponse = promise => (
  promise.then(res => res.text()).then(body => {
    output.innerHTML += body + '<br/>';
  })
);

[
  makeButton('Check', () => withLogResponse(window.api.check())),
  makeButton('Me', () => withLogResponse(window.api.me())),
  makeButton('Logout', () => withLogResponse(window.api.logout())),
  makeButton('Login', () => withLogResponse(window.api.login({username:'Jimmy',password:'password'}))),
  makeButton('convo', () => withLogResponse(window.api.convo({username:'Alex'}))),
  makeButton('seen', () => withLogResponse(window.api.seen({username:'Alex'}))),
  makeButton('notif', () => withLogResponse(window.api.notifications())),
  makeButton('users', () => withLogResponse(window.api.users())),
  makeButton('post', () => withLogResponse(window.api.post({username:'Alex',text:'Example Message :)'}))),
  makeButton('Clean after me!', () => { output.innerHTML = ''; }),
].forEach(button => root.appendChild(button));

root.appendChild(output);
