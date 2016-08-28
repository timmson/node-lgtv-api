var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');
var async = require('async');


var xmlBuilder = new xml2js.Builder();
var xmlParser = new xml2js.Parser();

module.exports = LgTvApi;

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

LgTvApi.prototype.displayPairingKey = function (functionCallback) {
    this.sendXMLRequest('/roap/api/auth', {auth: {type: 'AuthKeyReq'}}, (function (err, response, data) {
        if (err || response.statusCode != 200) {
            functionCallback(err != null ? err : new Error('Response code:' + response.statusCode));
        } else {
            functionCallback(null);
        }
    }).bind(this));
};

LgTvApi.prototype.authenticate = function (functionCallback) {
    if (this.pairingKey === null) {
        this.displayPairingKey(functionCallback);
    } else {
        async.waterfall([
            (function (callback) {
                this.sendXMLRequest('/roap/api/auth', {auth: {type: 'AuthReq', value: this.pairingKey}}, callback)
            }).bind(this),
            (function (err, response, data, callback) {
                if (err || response.statusCode != 200) {
                    var ownErr = err != null ? err : new Error('Response code:' + response.statusCode);
                    callback(ownErr, data);
                } else {
                    xmlParser.parseString(data, callback);
                }
            }).bind(this)
        ], (function (err, data) {
            if (err) {
                functionCallback(err, null)
            } else {
                this.session = data.envelope.session[0];
                functionCallback(err, this.session);
            }
        }).bind(this));
    }
};

LgTvApi.prototype.processCommand = function (commandName, parameters, functionCallback) {
    if (this.session === null) {
        functionCallback(new Error("No session id"));
    }

    if (!isNaN(parseInt(commandName)) && parameters.length == 0) {
        parameters.value = commandName;
        commandName = 'HandleKeyInput';
    } else if (isNaN(parseInt(parameters)) && isNaN(parseInt(parameters))) {
        parameters.value = parameters;
    } else {

    }

    parameters.name = commandName;

    async.waterfall([
        (function (callback) {
            this.sendXMLRequest('/roap/api/command', {command: parameters}, callback);
        }).bind(this),
        (function () {

        }).bind(this),
        (function (err, response, data, callback) {
            if (err || response.statusCode != 200) {
                var ownErr = err != null ? err : new Error('Response code:' + response.statusCode);
                callback(ownErr, data);
            } else {
                xmlParser.parseString(data, callback);
            }
        }).bind(this)

    ], (function (err, data) {
        if (err) {
            functionCallback(err, null)
        } else {
            functionCallback(err, data);
        }
    }).bind(this));

};

LgTvApi.prototype.queryData = function (targetId, functionCallback) {
    if (this.session === null) {
        functionCallback(new Error("No session id"));
    }
    async.waterfall([
        (function (callback) {
            this.sendRequest('/roap/api/data?target=' + targetId, callback);
        }).bind(this),
        (function (err, response, data, callback) {
            if (err || response.statusCode != 200) {
                callback(err != null ? err : new Error('Response code:' + response.statusCode));
            } else {
                xmlParser.parseString(data, callback);
            }
        }).bind(this)
    ], function (err, data) {
        if (err) {
            functionCallback(err, null)
        } else {
            functionCallback(err, data.envelope.data);
        }
    });

};

LgTvApi.prototype.takeScreenShot = function (fileName, functionCallback) {
    var path = '/roap/api/data?target=' + this.TV_INFO_SCREEN;
    if (this.debugMode) {
        console.info('REQ path:' + path);
    }
    var uri = 'http://' + this.host + ':' + this.port + path;
    var options = {
        headers: {
            'Content-Type': 'application/atom+xml',
            'Connection': 'Keep-Alive'
        }
    };
    request.get(uri, options).pipe(fs.createWriteStream(fileName)).on('close', functionCallback);
};

LgTvApi.prototype.sendXMLRequest = function (path, params, callback) {
    var reqBody = xmlBuilder.buildObject(params);
    if (this.debugMode) {
        console.info('REQ:' + reqBody);
    }
    var uri = 'http://' + this.host + ':' + this.port + path;
    var options = {
        headers: {
            'Content-Type': 'application/atom+xml',
            'Connection': 'Keep-Alive'
        },
        body: reqBody
    };
    request.post(uri, options, (function (err, response, data) {
        if (this.debugMode) {
            console.info('RESP:' + data);
        }
        callback(null, err, response, data);
    }).bind(this));
};

LgTvApi.prototype.sendRequest = function (path, callback) {
    if (this.debugMode) {
        console.info('REQ path:' + path);
    }
    var uri = 'http://' + this.host + ':' + this.port + path;
    var options = {
        headers: {
            'Content-Type': 'application/atom+xml',
            'Connection': 'Keep-Alive'
        }
    };
    request.get(uri, options, (function (err, response, data) {
        if (this.debugMode) {
            console.info('RESP:' + data);
        }
        callback(null, err, response, data);
    }).bind(this));
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


