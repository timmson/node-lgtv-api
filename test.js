var TvApi = require('./api.js');

var tvApi = new TvApi('192.168.0.5', '8080', '879540');
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.takeScreenShot('screen.jpg', function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('ok');
                }
            });
        }
    }
);
