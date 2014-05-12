function Message(from, to, subject, date, text, html) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.date = date;
    this.text = text;
    this.html = html;
}

exports.search = function(req, res) {
    var imap_handle = users[req.params.id];
    imap_handle.openBox('INBOX', true, function(err, box) {
        if (err) console.log(err);
        imap_handle.search([['TEXT', req.query.query]], 
            function(err, fetch_str) {
                //console.log(fetch_str.length);
                //Send error if no messages
                runFetch(res, imap_handle, fetch_str.length, fetch_str);
        });
    });
}

exports.fetch = function(req, res) {
    var imap_handle = users[req.params.id];
    imap_handle.openBox('INBOX', true, function(err, box) {
        if (err) console.log(err);
        var num_msgs = req.params.num_msgs;
        var fetch_str = box.messages.total-req.params.num_msgs+1 + ':*';
        runFetch(res, imap_handle, num_msgs, fetch_str);
    });
}

var runFetch = function(res, imap_handle, num_msgs, fetch_str) {
    var parsed_msgs = 0;
    var messages = new Array();
    var f = imap_handle.seq.fetch(fetch_str, { bodies: ''});
    f.on('message', function(msg, seqno) {
        mailparser = new MailParser();
        msg.on('body', function(stream, info) {
            stream.on('data', function(chunk) {
                mailparser.write(chunk.toString());
            });
            stream.on('end', function() {
                mailparser.end();
                mailparser.on('end', function(mail) {
                    parsed_msgs++;
                    var message = new Message(mail.from, mail.to, 
                        mail.subject, mail.date, mail.text, mail.html);
                    messages.push(message);
                    if (parsed_msgs == num_msgs) {
                        res.send({'success': true, 'messages': messages});
                    }
                });
            });
        });
    });
}
