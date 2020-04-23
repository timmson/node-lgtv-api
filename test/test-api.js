const TvApi = require("../app");
const {expect} = require("chai");
require("mocha");

describe("TvApi Should ", () => {

	it("instantiate", () => {
		const tvApi = new TvApi();

		expect(tvApi).to.be.not.undefined;
	});

});