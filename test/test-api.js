const TvApi = require("../app");

describe("TvApi Should ", () => {

	it("instantiate", () => {
		const tvApi = new TvApi();

		expect(tvApi).not.toBeUndefined();
	});

});