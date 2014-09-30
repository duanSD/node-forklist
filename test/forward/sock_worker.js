var ForkList = require('../../');

ForkList.proc(function(sock) {
    var workid = this.workid;
    sock.on('data', function(data) {
        console.log('[worker] id:', workid, 'data:', data.toString());
    })
});