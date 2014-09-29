var fs = require('fs');
var Path = require('path');
var assert = require('assert');
var underscore = require('underscore');
var ForkList = require('../');

describe('ForkList', function() {

    // which script to run by multiprocess
    var path = './script/write';

    // child process num
    var num = 4;

    var forks = new ForkList({
        path: path,
        num: num,
        classifier: function classify(msg, done) {
            // random select a process to send
            var id = underscore.random(0, num - 1);
            done(null, id);
        }
    });

    describe('.send', function() {
        
        it('should send 100 times', function(done) {
            var data_file = './data/basic.js';
            var times = 100;

            // add four var to save count
            fs.writeFileSync(data_file, 'var work_0 = work_1 = work_2 = work_3 = 0;\n');

            // send data 100 times
            for (var i = 0; i < times; i++) {
                forks.send(data_file, i);
            }

            forks.on('finish', function() {

                // exports count
                fs.appendFileSync(data_file, 'exports.result = work_0 + work_1 + work_2 + work_3;');

                // get the total write count of 4 processes 
                var result = require(data_file).result;

                assert(times === result);
                done();
            });

            forks.shutdown();
        });
    });
});