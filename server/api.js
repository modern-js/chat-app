const api = require('express')();

api.get('/test',(req, res) => {
//    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({status:'OK'}));
});

module.exports = api;
