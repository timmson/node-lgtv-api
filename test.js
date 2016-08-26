var TvApi = require('./api.js');

var tvApi = new TvApi('192.168.0.5', '8080', '879540');
//var tvApi = new TvApi('localhost', '8888', '879540');
//tvApi.displayPairingKey();
tvApi.authenticate(function (err, sessionKey) {
    console.log(sessionKey);
});
//tvApi.processCommand(tvApi.TV_INFO_VOLUME);
