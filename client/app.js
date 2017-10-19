let RECEPIENT = '';

const populateUsers = function() {
  window.api.users().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    let users = x.list;
    let panel = document.getElementById('users');
    panel.innerHTML = '';
    for (let i in users) {
      let user = users[i];
      let btn = document.createElement('button');
      btn.textContent = user.username;
      btn.onclick = () => window.api.convo({username:user.username}).then(x=>x.text()).then(x=>{
        RECEPIENT = user.username;
        x = JSON.parse(x);
        let conversation = x.conversation;
        let convo = document.getElementById('convo');
        convo.innerHTML = '';
        for ( let j in conversation) {
          let message=conversation[j].message;
          let author=conversation[j].sender;
          let style="";
          if ( author==user.username ) style="'text-align:left;'";
                                  else style="'text-align:right;'";
          let messageHTML="<div style="+style+">"+message+"</div>";
          convo.innerHTML += messageHTML + '<br/>'
        }
      });
      panel.appendChild(btn);
    }
  });
}

const mainLoop = function() {
  window.api.me().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    if (x.status=='OK') {
      showApp();
      populateUsers();
    }
    else {
      showForm();
    }
    setTimeout(mainLoop, 500);
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

document.getElementById('send').onclick = function(){
  let text = document.getElementById('input').value;
  window.api.post({username:RECEPIENT,text:text});
}

const showForm = function() {
  document.getElementById('app').style.visibility='hidden';
  document.getElementById('login_form').style.visibility='visible';
}

const showApp = function() {
  document.getElementById('app').style.visibility='visible';
  document.getElementById('login_form').style.visibility='hidden';
}
