if (typeof global === 'undefined') {
  global = window;
}

const esc = encodeURIComponent;
const stringQuery = function(params) {
  let joint = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  return '?'+joint;
}

const fetch = (route, method='GET', query={}) => global.fetch(
  route+stringQuery(query),{
    method,
    credentials: 'include'
  }
);

const api = {
  me: () => fetch('/me'),
  logout: () => fetch('/logout'),
  login: (query) => fetch('/login',method='POST',query=query),
  check: () => fetch('/check'),
  post: (query) => fetch('/post', method='POST', query=query),
  convo: (query) => fetch('/convo', method='GET', query=query),
  seen: (query={username:'Alex'}) => fetch('/seen', method='POST', query=query),
  notifications: () => fetch('/notifications'),
  users: () => fetch('/users'),
}

if (typeof module !== 'undefined') { module.exports = api; }
if (typeof window !== 'undefined') { window.api = api; }
