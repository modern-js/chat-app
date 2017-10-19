let RECEPIENT = '';

const populateUsers = function() {
  RECEPIENT = '';
  window.api.users().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    let users = x.list;
    let panel = document.getElementById('users');
    panel.innerHTML = '';
    for (let i in users) {
      let user = users[i];
      let btn = document.createElement('button');
      btn.textContent = user.username;
      btn.id='user_'+user.username;
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

        window.api.seen({username:user.username}).then(()=>{
          setTimeout(function(){$('#user_'+user.username).css('color','black')},500);
        });
      });
      panel.appendChild(btn);
    }
  });
}

const listen = function() {
  window.api.notifications().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    let notifs = x.notifications;
    //console.log(notifs);
    for ( let i in notifs ) {
      let n=notifs[i];
      if ( n === RECEPIENT ) $('#user_'+RECEPIENT).click();
                        else $('#user_'+n).css('color','red');
    }
  });
}

const mainLoop = function() {
  window.api.me().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    if (x.status=='OK') {
      showApp();
      listen();
    }
    else {
      showForm();
    }
    setTimeout(mainLoop, 500);
  });
};

const startUp = function() {
  window.api.me().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    if (x.status=='OK') {
      populateUsers();
    }
  });
  mainLoop();
}

document.addEventListener("DOMContentLoaded", startUp);

document.getElementById('login').onclick = function(){
  let username = document.getElementById('user_text').value;
  let password = document.getElementById('pass_text').value;
  window.api.login({username:username,password:password}).then(()=>{populateUsers();});
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
