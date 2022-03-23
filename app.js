const request = require("request")
const xml2js = require("xml2js")

const xmlBuilder = new xml2js.Builder()
const xmlParser = new xml2js.Parser()

const getErrorMessage = (error, response) => error || new Error("Response code:" + response.statusCode)

const getOptions = function (body) {
	let options = {
		headers: {
			"Content-Type": "application/atom+xml",
			"Connection": "Keep-Alive"
		}
	}
	if (body) {
		options.body = body
	}
	return options
}

class LgTvApi {

	constructor(_host, _port, _pairingKey) {
		this.host = _host
		this.port = _port
		this.pairingKey = _pairingKey
		this.session = null
		this.debugMode = false
		this.scheme = "http"
	}

	setDebugMode(_debugMode) {
		this.debugMode = _debugMode
	}

	displayPairingKey() {
		return new Promise((resolve, reject) => {
			this.sendXMLRequest("/roap/api/auth", {auth: {type: "AuthKeyReq"}}).then(resolve, reject)
		})
	}

	authenticate() {
		return new Promise((resolve, reject) => {
			(this.pairingKey === null) ? reject(new Error("No pairing key. You should call displayPairingKey at first.")) : 0
			this.sendXMLRequest("/roap/api/auth", {auth: {type: "AuthReq", value: this.pairingKey}}).then(
				data => {
					xmlParser.parseString(data, (err, doc) => {
						err ? reject(err) : this.session = doc.envelope.session[0] & resolve(doc.envelope.session[0])
					})
				}, reject)
		})
	}

	processCommand(commandName, parameters) {
		return new Promise((resolve, reject) => {
			(this.session === null) ? reject(new Error("No session id. You should call authenticate method at first.")) : 0

			if (!isNaN(parseInt(commandName)) && parameters.length === 0) {
				parameters.value = commandName
				commandName = "HandleKeyInput"
			} else if (isNaN(parseInt(parameters)) && !(((typeof parameters === "object") && (parameters !== null)))) {
				parameters.value = parameters
			}

			parameters.name = commandName

			this.sendXMLRequest("roap/api/command", {command: parameters}).then(
				data => {
					xmlParser.parseString(data, (err, doc) => err ? reject(err) : resolve(doc))
				}, reject)
		})

	}

	queryData(targetId) {
		return new Promise((resolve, reject) => {
			(this.session === null) ? reject(new Error("No session id. You should call authenticate method at first.")) : 0
			this.sendRequest(`roap/api/data?target=${targetId}`).then(
				data => {
					xmlParser.parseString(data, (err, doc) => err ? reject(err) : resolve(doc.envelope.data))
				}, reject)
		})
	}

	takeScreenShot() {
		return new Promise((resolve, reject) => {
			let uri = `${this.scheme}://${this.host}:${this.port}/roap/api/data?target=${LgTvApi.TV_INFO_SCREEN}`
			let options = getOptions()
			this.debugMode ? console.info("REQ:" + JSON.stringify(options)) : 0
			request.get(uri, options, (err, response, data) => {
				this.debugMode ? console.info("RESP:" + data) : 0;
				(err || response.statusCode !== 200) ? reject(getErrorMessage(err, response)) : resolve(data)
			})
		})
	}

	sendXMLRequest(path, params) {
		return new Promise((resolve, reject) => {
			let uri = `${this.scheme}://${this.host}:${this.port}/${path}`
			let options = getOptions(xmlBuilder.buildObject(params))
			this.debugMode ? console.info("REQ:" + options.body) : 0
			request.post(uri, options, (err, response, data) => {
				this.debugMode ? console.info("RESP:" + data) : 0;
				(err || response.statusCode !== 200) ? reject(getErrorMessage(err, response)) : resolve(data)
			})
		})
	}

	sendRequest(path) {
		return new Promise((resolve, reject) => {
			let uri = `${this.scheme}://${this.host}:${this.port}/${path}`
			let options = getOptions()
			this.debugMode ? console.info("REQ:" + JSON.stringify(options)) : 0
			request.get(uri, getOptions(), (err, response, data) => {
				this.debugMode ? console.info("RESP:" + data) : 0;
				(err || response.statusCode !== 200) ? reject(getErrorMessage(err, response)) : resolve(data)
			})
		})
	}


}

LgTvApi.TV_CMD_POWER = 1
LgTvApi.TV_CMD_NUMBER_0 = 2
LgTvApi.TV_CMD_NUMBER_1 = 3
LgTvApi.TV_CMD_NUMBER_2 = 4
LgTvApi.TV_CMD_NUMBER_3 = 5
LgTvApi.TV_CMD_NUMBER_4 = 6
LgTvApi.TV_CMD_NUMBER_5 = 7
LgTvApi.TV_CMD_NUMBER_6 = 8
LgTvApi.TV_CMD_NUMBER_7 = 9
LgTvApi.TV_CMD_NUMBER_8 = 10
LgTvApi.TV_CMD_NUMBER_9 = 11
LgTvApi.TV_CMD_UP = 12
LgTvApi.TV_CMD_DOWN = 13
LgTvApi.TV_CMD_LEFT = 14
LgTvApi.TV_CMD_RIGHT = 15
LgTvApi.TV_CMD_OK = 20
LgTvApi.TV_CMD_HOME_MENU = 21
LgTvApi.TV_CMD_BACK = 23
LgTvApi.TV_CMD_VOLUME_UP = 24
LgTvApi.TV_CMD_VOLUME_DOWN = 25
LgTvApi.TV_CMD_MUTE_TOGGLE = 26
LgTvApi.TV_CMD_CHANNEL_UP = 27
LgTvApi.TV_CMD_CHANNEL_DOWN = 28
LgTvApi.TV_CMD_BLUE = 29
LgTvApi.TV_CMD_GREEN = 30
LgTvApi.TV_CMD_RED = 31
LgTvApi.TV_CMD_YELLOW = 32
LgTvApi.TV_CMD_PLAY = 33
LgTvApi.TV_CMD_PAUSE = 34
LgTvApi.TV_CMD_STOP = 35
LgTvApi.TV_CMD_FAST_FORWARD = 36
LgTvApi.TV_CMD_REWIND = 37
LgTvApi.TV_CMD_SKIP_FORWARD = 38
LgTvApi.TV_CMD_SKIP_BACKWARD = 39
LgTvApi.TV_CMD_RECORD = 40
LgTvApi.TV_CMD_RECORDING_LIST = 41
LgTvApi.TV_CMD_REPEAT = 42
LgTvApi.TV_CMD_LIVE_TV = 43
LgTvApi.TV_CMD_EPG = 44
LgTvApi.TV_CMD_PROGRAM_INFORMATION = 45
LgTvApi.TV_CMD_ASPECT_RATIO = 46
LgTvApi.TV_CMD_EXTERNAL_INPUT = 47
LgTvApi.TV_CMD_PIP_SECONDARY_VIDEO = 48
LgTvApi.TV_CMD_SHOW_SUBTITLE = 49
LgTvApi.TV_CMD_PROGRAM_LIST = 50
LgTvApi.TV_CMD_TELE_TEXT = 51
LgTvApi.TV_CMD_MARK = 52
LgTvApi.TV_CMD_3D_VIDEO = 400
LgTvApi.TV_CMD_3D_LR = 401
LgTvApi.TV_CMD_DASH = 402
LgTvApi.TV_CMD_PREVIOUS_CHANNEL = 403
LgTvApi.TV_CMD_FAVORITE_CHANNEL = 404
LgTvApi.TV_CMD_QUICK_MENU = 405
LgTvApi.TV_CMD_TEXT_OPTION = 406
LgTvApi.TV_CMD_AUDIO_DESCRIPTION = 407
LgTvApi.TV_CMD_ENERGY_SAVING = 409
LgTvApi.TV_CMD_AV_MODE = 410
LgTvApi.TV_CMD_SIMPLINK = 411
LgTvApi.TV_CMD_EXIT = 412
LgTvApi.TV_CMD_RESERVATION_PROGRAM_LIST = 413
LgTvApi.TV_CMD_PIP_CHANNEL_UP = 414
LgTvApi.TV_CMD_PIP_CHANNEL_DOWN = 415
LgTvApi.TV_CMD_SWITCH_VIDEO = 416
LgTvApi.TV_CMD_APPS = 417
LgTvApi.TV_CMD_MOUSE_MOVE = "HandleTouchMove"
LgTvApi.TV_CMD_MOUSE_CLICK = "HandleTouchClick"
LgTvApi.TV_CMD_TOUCH_WHEEL = "HandleTouchWheel"
LgTvApi.TV_CMD_CHANGE_CHANNEL = "HandleChannelChange"
LgTvApi.TV_CMD_SCROLL_UP = "up"
LgTvApi.TV_CMD_SCROLL_DOWN = "down"
LgTvApi.TV_INFO_CURRENT_CHANNEL = "cur_channel"
LgTvApi.TV_INFO_CHANNEL_LIST = "channel_list"
LgTvApi.TV_INFO_CONTEXT_UI = "context_ui"
LgTvApi.TV_INFO_VOLUME = "volume_info"
LgTvApi.TV_INFO_SCREEN = "screen_image"
LgTvApi.TV_INFO_3D = "is_3d"
LgTvApi.TV_LAUNCH_APP = "AppExecute"
LgTvApi.TV_TERMINATE_APP = "AppTerminate"

module.exports = LgTvApi
