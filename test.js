var TvApi = require('./api.js');

var tvApi = new TvApi('192.168.0.5', '8080', '879540');
//tvApi.setDebugMode(true);
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.processCommand(tvApi.TV_CMD_SWITCH_VIDEO, [], function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data);
                }
            });
        }
    }
);
