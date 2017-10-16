const express = require('express');
const api = require('./api');

api.use(express.static('client'));

api.listen(8080);
