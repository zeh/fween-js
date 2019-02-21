var Fween = require("./../../dist/Fween.umd").Fween;
var Easing = require("./../../dist/Fween.umd").Easing;
var FweenSequence = require("./../../dist/Fween.umd").FweenSequence;
var FweenObjectSequence = require("./../../dist/Fween.umd").FweenObjectSequence;
var FweenSetterSequence = require("./../../dist/Fween.umd").FweenSetterSequence;

describe("exports", () => {
	it("Fween", function() {
		expect(Fween).not.toBe("function");
	});

	it("Easing", function() {
		expect(Fween).not.toBe("function");
	});

	it("FweenSequence", function() {
		expect(FweenSequence).not.toBe("function");
	});

	it("FweenObjectSequence", function() {
		expect(FweenObjectSequence).not.toBe("function");
	});

	it("FweenSetterSequence", function() {
		expect(FweenSetterSequence).not.toBe("function");
	});
});
