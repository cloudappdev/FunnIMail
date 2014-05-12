var express = require('express');
var bodyParser = require('body-parser');
var login = require('./funimail_core/login.js');
var messages = require('./funnimail_core/messages.js');

Imap = require('imap');
crypto = require('crypto');
redis = require('redis');
MailParser = require('mailparser').MailParser;

users = {};
num_users = 1;

var app = express();
var server = app.listen(5000, function() {
    console.log('Server listening on 127.0.0.1 on port 5000');
});

app.use(bodyParser());
app.post('/v1/login', login.doLogin);
app.get('/v1/messages/search/:id', messages.search);
app.get('/v1/messages/:id/:num_msgs', messages.fetch);
app.get('/v1/logout/:id', function(req, res) {
    users[req.params.id].end();
    delete users[req.params.id];
    res.send({'success': true});
});
