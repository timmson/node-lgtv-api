let TvApi = require("./app");

async function test() {
	let tvApi = new TvApi("192.168.0.5", "8080", "879540");

	try {
		await tvApi.authenticate();

		let muteResult = await tvApi.processCommand(tvApi.TV_CMD_MUTE_TOGGLE, []);
		console.log(muteResult);

		let channelList = await tvApi.queryData(tvApi.TV_INFO_CHANNEL_LIST);
		console.log(channelList);

		let changeChannelResult = await tvApi.processCommand(tvApi.TV_CMD_CHANGE_CHANNEL, channelList[5]);
		console.log(changeChannelResult);

		let stream = await tvApi.takeScreenShot();
		stream.pipe(require("fs").createWriteStream("screen.jpg"));
	} catch (err) {
		console.error(err);
	}
}

test();