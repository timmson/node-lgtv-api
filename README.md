Node LG TV API [beta]
=====================

A NODE API for the LG SmartTV (2012+) which makes it easy for you to remote control your TV with code.
You're able to execute simple/special commands and queries (change channel, get current channel,
get channel list, set volume up, set volume down, save screenshot - save gif animation, ...)

You can find command parameters and query structures on the [Official Documentation of the LG SmartTV](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FHandleTouchMove.htm)
(There is also a command/query list below the examples)

This project was inspired by [PHP-LG-SmartTV by SteveWinfield](https://github.com/SteveWinfield/PHP-LG-SmartTV)

If you have any questions, send it via email: [timmson666@mail.ru](mailto:timmson666@mail.ru?subjet=node-lgtv-api)

## How to install
```sh
npm install node-lgtv-api
```

## How to request pairing key

```js
var TvApi = require('node-lgtv-api');
var tvApi = new TvApi('192.168.0.5', '8080'); //for key request
tvApi.displayPairingKey(function (err) {
    if (err) {
        console.log(err);
    }
});
```

## How to authorize to your TV

```js
var TvApi = require('node-lgtv-api');
var tvApi = new TvApi('192.168.0.5', '8080', '879540'); //for key request
tvApi.authenticate(function (err, sessionKey) {
    console.log(sessionKey);
});
```

## How to execute a simple command

```js
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.processCommand(tvApi.TV_CMD_MUTE_TOGGLE, [], function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data);
                }
            });
        }
    }
);
```

## How to execute a special command

```js
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.queryData(tvApi.TV_INFO_CHANNEL_LIST, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data);
                }
            })
        }
    }
);
```

## How to query data (current volume)

```js
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.queryData(tvApi.TV_INFO_VOLUME, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data);
                }
            });
        }
    }
);
```

## How to query data (channel list)

data[5] - where 5 is the number of channel in the list.

```js
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.queryData(tvApi.TV_INFO_CHANNEL_LIST, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    tvApi.processCommand(tvApi.TV_CMD_CHANGE_CHANNEL, data[5], function (err, data) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(data);
                        }
                    });
                }
            });
        }
    }
);
```

## How to save a screenshot

```js
tvApi.authenticate(function (err, sessionKey) {
        if (err) {
            console.error(err);
        } else {
            tvApi.takeScreenShot((err, stream) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('ok');
                    stream.pipe(require('fs').createWriteStream('scree.jpg'));
                }
            })
        }
    }
);
```

## How to enable **Debug Mode** (default is off)

```js
tvApi.setDebugMode(true);
```

## List of commands and queries (+ Documentation links)

**Simple commands**
TV_CMD_POWER, TV_CMD_NUMBER_0, TV_CMD_NUMBER_1, TV_CMD_NUMBER_2, TV_CMD_NUMBER_3, TV_CMD_NUMBER_4, TV_CMD_NUMBER_5, TV_CMD_NUMBER_6, TV_CMD_NUMBER_7, TV_CMD_NUMBER_8, TV_CMD_NUMBER_9, TV_CMD_UP, TV_CMD_DOWN, TV_CMD_LEFT, TV_CMD_RIGHT, TV_CMD_OK, TV_CMD_HOME_MENU, TV_CMD_BACK, TV_CMD_VOLUME_UP, TV_CMD_VOLUME_DOWN, TV_CMD_MUTE_TOGGLE, TV_CMD_CHANNEL_UP, TV_CMD_CHANNEL_DOWN, TV_CMD_BLUE, TV_CMD_GREEN, TV_CMD_RED, TV_CMD_YELLOW, TV_CMD_PLAY, TV_CMD_PAUSE, TV_CMD_STOP, TV_CMD_FAST_FORWARD, TV_CMD_REWIND, TV_CMD_SKIP_FORWARD, TV_CMD_SKIP_BACKWARD, TV_CMD_RECORD, TV_CMD_RECORDING_LIST, TV_CMD_REPEAT, TV_CMD_LIVE_TV, TV_CMD_EPG, TV_CMD_PROGRAM_INFORMATION, TV_CMD_ASPECT_RATIO, TV_CMD_EXTERNAL_INPUT, TV_CMD_PIP_SECONDARY_VIDEO, TV_CMD_SHOW_SUBTITLE, TV_CMD_PROGRAM_LIST, TV_CMD_TELE_TEXT, TV_CMD_MARK, TV_CMD_3D_VIDEO, TV_CMD_3D_LR, TV_CMD_DASH, TV_CMD_PREVIOUS_CHANNEL, TV_CMD_FAVORITE_CHANNEL, TV_CMD_QUICK_MENU, TV_CMD_TEXT_OPTION, TV_CMD_AUDIO_DESCRIPTION, TV_CMD_ENERGY_SAVING, TV_CMD_AV_MODE, TV_CMD_SIMPLINK, TV_CMD_EXIT, TV_CMD_RESERVATION_PROGRAM_LIST, TV_CMD_PIP_CHANNEL_UP, TV_CMD_PIP_CHANNEL_DOWN, TV_CMD_SWITCH_VIDEO, TV_CMD_APPS,

**Special commands**
[TV_CMD_MOUSE_MOVE](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FHandleTouchMove.htm), [TV_CMD_MOUSE_CLICK](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FHandleTouchClick.htm), [TV_CMD_TOUCH_WHEEL](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FHandleTouchWheel.htm), [TV_CMD_CHANGE_CHANNEL](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FHandleChannelChange.htm)

**Queries**
[TV_INFO_CURRENT_CHANNEL](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FCurrent+channel+information+Controller+Host.htm), [TV_INFO_CHANNEL_LIST](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FEntire+channels+list+Controller+Host.htm), [TV_INFO_CONTEXT_UI](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FOperation+mode+of+the+Host+UI+Controller+Host.htm), [TV_INFO_VOLUME](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FVolume+information+of+the+Host+Controller+Host.htm), [TV_INFO_SCREEN](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FObtaining+the+capture+image+of+the+Host+Controller+Host.htm), [TV_INFO_3D](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2F3D+mode+of+the+Host+Controller+Host.htm)
