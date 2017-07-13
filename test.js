let TvApi = require('./api.js');

let tvApi = new TvApi('192.168.0.5', '8080', '879540');

tvApi.authenticate().then(() => tvApi.processCommand(tvApi.TV_CMD_MUTE_TOGGLE, []).then(console.log, console.error), console.error);

tvApi.authenticate().then(() =>  tvApi.queryData(tvApi.TV_INFO_CHANNEL_LIST).then(console.log, console.error), console.error);

tvApi.authenticate().then(() =>  tvApi.queryData(tvApi.TV_INFO_CHANNEL_LIST).then(
    data => tvApi.processCommand(tvApi.TV_CMD_CHANGE_CHANNEL, data[5]).then(ret => {}, console.error), console.error),
    console.error);

tvApi.authenticate().then(() => tvApi.takeScreenShot().then(stream => stream.pipe(require('fs').createWriteStream('screen.jpg'))), console.error);

tvApi.authenticate().then(() => tvApi.processCommand(tvApi.TV_LAUNCH_APP, requestedApp).then(ret => {}, console.error), console.error);