var TvApi = require('./api.js');
var async = require('async');

var tvApi = new TvApi('192.168.0.5', '8080', '879540');
//var tvApi = new TvApi('localhost', '8888', '879540');
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            async.parallel([
                /*function (callback) {
                 tvApi.processCommand(tvApi.TV_CMD_MUTE_TOGGLE, [], function (err, data) {
                 callback(err, data);
                 })
                 },*/
                function (callback) {
                    tvApi.queryData(tvApi.TV_INFO_CHANNEL_LIST, function (err, data) {
                        callback(err, data);
                    });
                }

            ], function (err, data) {
                console.log(data);
            })
        }
    }
);
