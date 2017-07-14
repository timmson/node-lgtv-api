const request = require('request');
const xml2js = require('xml2js');

const xmlBuilder = new xml2js.Builder();
const xmlParser = new xml2js.Parser();

function getErrorMessage(error, response) {
    return error || new Error('Response code:' + response.statusCode);
}

function LgTvApi(_host, _port, _pairingKey) {
    this.host = _host;
    this.port = _port;
    this.pairingKey = _pairingKey;
    this.session = null;
    this.debugMode = false;
}

LgTvApi.prototype.setDebugMode = function (_debugMode) {
    this.debugMode = _debugMode;
};

LgTvApi.prototype.displayPairingKey = function () {
    return new Promise((resolve, reject) => {
        this.sendXMLRequest('/roap/api/auth', {auth: {type: 'AuthKeyReq'}}).then(resolve, reject);
    });
};

LgTvApi.prototype.authenticate = function () {
    return new Promise((resolve, reject) => {
        (this.pairingKey === null) ? reject(new Error("No pairing key. You need call displayPairingKey at first.")) : 0;
        this.sendXMLRequest('/roap/api/auth', {auth: {type: 'AuthReq', value: this.pairingKey}}).then(
            data => {
                xmlParser.parseString(data, (err, doc) => {
                    err ? reject(err) : this.session = doc.envelope.session[0] & resolve(doc.envelope.session[0])
                });
            }, reject);
    });
};

LgTvApi.prototype.processCommand = function (commandName, parameters) {
    return new Promise((resolve, reject) => {
        (this.session === null) ? reject(new Error("No session id. You nead call authenticate at first.")) : 0;

        if (!isNaN(parseInt(commandName)) && parameters.length === 0) {
            parameters.value = commandName;
            commandName = 'HandleKeyInput';
        } else if (isNaN(parseInt(parameters)) && !(((typeof parameters === "object") && (parameters !== null)))) {
            parameters.value = parameters;
        }

        parameters.name = commandName;

        this.sendXMLRequest('/roap/api/command', {command: parameters}).then(
            data => {
                xmlParser.parseString(data, (err, doc) => err ? reject(err) : resolve());
            }, reject);
    });

};

LgTvApi.prototype.queryData = function (targetId) {
    return new Promise((resolve, reject) => {
        (this.session === null) ? reject(new Error("No session id. You nead call authenticate at first.")) : 0;
        this.sendRequest('/roap/api/data?target=' + targetId).then(
            data => {
                xmlParser.parseString(data, (err, doc) => err ? reject(err) : resolve(doc.envelope.data));
            }, reject);
    });
};

LgTvApi.prototype.takeScreenShot = function () {
    return new Promise((resolve, reject) => {
        let uri = 'http://' + this.host + ':' + this.port + '/roap/api/data?target=' + this.TV_INFO_SCREEN;
        let options = {
            headers: {
                'Content-Type': 'application/atom+xml',
                'Connection': 'Keep-Alive'
            }
        };
        this.debugMode ? console.info('REQ:' + JSON.stringify(options)) : 0;
        resolve(request.get(uri, options));
    })
};

LgTvApi.prototype.sendXMLRequest = function (path, params) {
    return new Promise((resolve, reject) => {
        let uri = 'http://' + this.host + ':' + this.port + path;
        let options = {
            headers: {
                'Content-Type': 'application/atom+xml',
                'Connection': 'Keep-Alive'
            },
            body: xmlBuilder.buildObject(params)
        };
        this.debugMode ? console.info('REQ:' + options.body) : 0;
        request.post(uri, options, (err, response, data) => {
            this.debugMode ? console.info('RESP:' + data) : 0;
            (err || response.statusCode !== 200) ? reject(getErrorMessage(err, response)) : resolve(data);
        });
    });
};

LgTvApi.prototype.sendRequest = function (path) {
    return new Promise((resolve, reject) => {
        let uri = 'http://' + this.host + ':' + this.port + path;
        let options = {
            headers: {
                'Content-Type': 'application/atom+xml',
                'Connection': 'Keep-Alive'
            }
        };
        this.debugMode ? console.info('REQ:' + JSON.stringify(options)) : 0;
        request.get(uri, options, (err, response, data) => {
            this.debugMode ? console.info('RESP:' + data) : 0;
            (err || response.statusCode !== 200) ? reject(getErrorMessage(err, response)) : resolve(data);
        });
    });
};

LgTvApi.prototype.TV_CMD_POWER = 1;
LgTvApi.prototype.TV_CMD_NUMBER_0 = 2;
LgTvApi.prototype.TV_CMD_NUMBER_1 = 3;
LgTvApi.prototype.TV_CMD_NUMBER_2 = 4;
LgTvApi.prototype.TV_CMD_NUMBER_3 = 5;
LgTvApi.prototype.TV_CMD_NUMBER_4 = 6;
LgTvApi.prototype.TV_CMD_NUMBER_5 = 7;
LgTvApi.prototype.TV_CMD_NUMBER_6 = 8;
LgTvApi.prototype.TV_CMD_NUMBER_7 = 9;
LgTvApi.prototype.TV_CMD_NUMBER_8 = 10;
LgTvApi.prototype.TV_CMD_NUMBER_9 = 11;
LgTvApi.prototype.TV_CMD_UP = 12;
LgTvApi.prototype.TV_CMD_DOWN = 13;
LgTvApi.prototype.TV_CMD_LEFT = 14;
LgTvApi.prototype.TV_CMD_RIGHT = 15;
LgTvApi.prototype.TV_CMD_OK = 20;
LgTvApi.prototype.TV_CMD_HOME_MENU = 21;
LgTvApi.prototype.TV_CMD_BACK = 23;
LgTvApi.prototype.TV_CMD_VOLUME_UP = 24;
LgTvApi.prototype.TV_CMD_VOLUME_DOWN = 25;
LgTvApi.prototype.TV_CMD_MUTE_TOGGLE = 26;
LgTvApi.prototype.TV_CMD_CHANNEL_UP = 27;
LgTvApi.prototype.TV_CMD_CHANNEL_DOWN = 28;
LgTvApi.prototype.TV_CMD_BLUE = 29;
LgTvApi.prototype.TV_CMD_GREEN = 30;
LgTvApi.prototype.TV_CMD_RED = 31;
LgTvApi.prototype.TV_CMD_YELLOW = 32;
LgTvApi.prototype.TV_CMD_PLAY = 33;
LgTvApi.prototype.TV_CMD_PAUSE = 34;
LgTvApi.prototype.TV_CMD_STOP = 35;
LgTvApi.prototype.TV_CMD_FAST_FORWARD = 36;
LgTvApi.prototype.TV_CMD_REWIND = 37;
LgTvApi.prototype.TV_CMD_SKIP_FORWARD = 38;
LgTvApi.prototype.TV_CMD_SKIP_BACKWARD = 39;
LgTvApi.prototype.TV_CMD_RECORD = 40;
LgTvApi.prototype.TV_CMD_RECORDING_LIST = 41;
LgTvApi.prototype.TV_CMD_REPEAT = 42;
LgTvApi.prototype.TV_CMD_LIVE_TV = 43;
LgTvApi.prototype.TV_CMD_EPG = 44;
LgTvApi.prototype.TV_CMD_PROGRAM_INFORMATION = 45;
LgTvApi.prototype.TV_CMD_ASPECT_RATIO = 46;
LgTvApi.prototype.TV_CMD_EXTERNAL_INPUT = 47;
LgTvApi.prototype.TV_CMD_PIP_SECONDARY_VIDEO = 48;
LgTvApi.prototype.TV_CMD_SHOW_SUBTITLE = 49;
LgTvApi.prototype.TV_CMD_PROGRAM_LIST = 50;
LgTvApi.prototype.TV_CMD_TELE_TEXT = 51;
LgTvApi.prototype.TV_CMD_MARK = 52;
LgTvApi.prototype.TV_CMD_3D_VIDEO = 400;
LgTvApi.prototype.TV_CMD_3D_LR = 401;
LgTvApi.prototype.TV_CMD_DASH = 402;
LgTvApi.prototype.TV_CMD_PREVIOUS_CHANNEL = 403;
LgTvApi.prototype.TV_CMD_FAVORITE_CHANNEL = 404;
LgTvApi.prototype.TV_CMD_QUICK_MENU = 405;
LgTvApi.prototype.TV_CMD_TEXT_OPTION = 406;
LgTvApi.prototype.TV_CMD_AUDIO_DESCRIPTION = 407;
LgTvApi.prototype.TV_CMD_ENERGY_SAVING = 409;
LgTvApi.prototype.TV_CMD_AV_MODE = 410;
LgTvApi.prototype.TV_CMD_SIMPLINK = 411;
LgTvApi.prototype.TV_CMD_EXIT = 412;
LgTvApi.prototype.TV_CMD_RESERVATION_PROGRAM_LIST = 413;
LgTvApi.prototype.TV_CMD_PIP_CHANNEL_UP = 414;
LgTvApi.prototype.TV_CMD_PIP_CHANNEL_DOWN = 415;
LgTvApi.prototype.TV_CMD_SWITCH_VIDEO = 416;
LgTvApi.prototype.TV_CMD_APPS = 417;
LgTvApi.prototype.TV_CMD_MOUSE_MOVE = 'HandleTouchMove';
LgTvApi.prototype.TV_CMD_MOUSE_CLICK = 'HandleTouchClick';
LgTvApi.prototype.TV_CMD_TOUCH_WHEEL = 'HandleTouchWheel';
LgTvApi.prototype.TV_CMD_CHANGE_CHANNEL = 'HandleChannelChange';
LgTvApi.prototype.TV_CMD_SCROLL_UP = 'up';
LgTvApi.prototype.TV_CMD_SCROLL_DOWN = 'down';
LgTvApi.prototype.TV_INFO_CURRENT_CHANNEL = 'cur_channel';
LgTvApi.prototype.TV_INFO_CHANNEL_LIST = 'channel_list';
LgTvApi.prototype.TV_INFO_CONTEXT_UI = 'context_ui';
LgTvApi.prototype.TV_INFO_VOLUME = 'volume_info';
LgTvApi.prototype.TV_INFO_SCREEN = 'screen_image';
LgTvApi.prototype.TV_INFO_3D = 'is_3d';
LgTvApi.prototype.TV_LAUNCH_APP = 'AppExecute';
LgTvApi.prototype.TV_TERMINATE_APP = 'AppTerminate';

module.exports = LgTvApi;