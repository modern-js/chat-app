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
        if (conversation) if (conversation.length>6) conversation=conversation.slice(conversation.length - 6);

        for ( let j in conversation) {
          let message=conversation[j].message;
          let author=conversation[j].sender;
          let style="";
          if ( author==user.username ) style="'text-align:left;background-color:lightgreen'";
                                  else style="'text-align:right;background-color:lightblue'";
          let messageHTML="<div class='well message' style="+style+">"+message+"</div>";
          convo.innerHTML += messageHTML// + '<hr>'
        }

        window.api.seen({username:user.username}).then(()=>{
          setTimeout(mark_read(user.username),500);
        });
      });
      btn.className += 'btn btn-success';
      panel.appendChild(btn);
      panel.appendChild(document.createElement('hr'));
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
                        else mark_unread(n);
    }
  });
}

const mainLoop = function() {
  window.api.me().then(x=>x.text()).then(x=>{
    x = JSON.parse(x);
    if (x.status=='OK') {
      showApp();
      listen();
      $('#logout').html('Logout ['+x.user.username+']');
      $('#input').attr("placeholder","message "+RECEPIENT);
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

$('#input_form').on('submit', function(e) {
  e.preventDefault();
  let text = document.getElementById('input').value;
  document.getElementById('input').value='';
  window.api.post({username:RECEPIENT,text:text});
});

// visuals

const mark_unread = function(username) {
  $('#user_'+username).css('background-color','orange');
}

const mark_read = function(username) {
  $('#user_'+username).css('background-color','');
}

const showForm = function() {
  document.getElementById('app').style.visibility='hidden';
  document.getElementById('login_form').style.visibility='visible';
}

const showApp = function() {
  document.getElementById('app').style.visibility='visible';
  document.getElementById('login_form').style.visibility='hidden';
}
