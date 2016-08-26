var TvApi = require('./api.js');
var async = require('async');

var tvApi = new TvApi('192.168.0.5', '8080', '879540');
//var tvApi = new TvApi('localhost', '8888', '879540');
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            async.parallel([
                function (callback) {
                    tvApi.processCommand(tvApi.TV_INFO_VOLUME, function (err, data) {
                        callback(err, data);
                    })
                },
                function (callback) {
                    tvApi.queryData(tvApi.TV_INFO_SCREEN, function (err, data) {
                        callback(err, data);
                    });
                }

            ], function (err, data) {
                console.log(data);
            })
        }
    }
);

tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.queryData(tvApi.TV_INFO_SCREEN, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data);
                }
            });
        }
    }
);
