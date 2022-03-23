const TvApi = require("../app")

describe("TvApi Should ", () => {

	test("instantiate", () => {
		const tvApi = new TvApi()

		expect(tvApi).not.toBeUndefined()
	})

})