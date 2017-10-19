
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


// everything above this eventually needs to be deleted

const mainLoop = function() {
  window.api.me().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    if (x.status=='OK') {
      showApp();
    }
    else {
      showForm();
    }
    setTimeout(mainLoop, 1000);
  });
};

document.addEventListener("DOMContentLoaded", mainLoop);

document.getElementById('login').onclick = function(){
  let username = document.getElementById('user_text').value;
  let password = document.getElementById('pass_text').value;
  window.api.login({username:username,password:password});
}

document.getElementById('logout').onclick = function(){
  window.api.logout();
}

const showForm = function() {
  document.getElementById('app').style.visibility='hidden';
  document.getElementById('login_form').style.visibility='visible';
}

const showApp = function() {
  document.getElementById('app').style.visibility='visible';
  document.getElementById('login_form').style.visibility='hidden';
}
