if (typeof global === 'undefined') {
  global = window;
}

const api = {};

if (typeof module !== 'undefined') { module.exports = api; }
if (typeof window !== 'undefined') { window.api = api; }
