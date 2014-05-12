var genAuthToken = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random.toString());
    return sha.digest('hex');
}

exports.doLogin = function(req, res, next) {
    var imap_handle = new Imap({
        user: req.body.email,
        password: req.body.password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {rejectUnauthorized: false},
        debug: function(message) { console.log(message);}
    });
    imap_handle.once('error', function(err) {
        res.send({'error': 0});
    });
    imap_handle.once('ready', function() {
        var auth_token = genAuthToken();
        users[num_users] = imap_handle;
        res.send({'success': true, 'id': num_users, 'auth_token': auth_token});
        num_users++;
    });
    imap_handle.connect();
    //setTimeout(function(){imap_handle.end();}, 3000);
}
