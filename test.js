var TvApi = require('./api.js');

var tvApi = new TvApi('192.168.0.5', '8080', '879540');
tvApi.authenticate();
//tvApi.processCommand(tvApi.TV_INFO_VOLUME);
