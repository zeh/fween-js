import Fween from "./../../dist/Fween.umd";

const obj = {};

describe("Fween (ES6)", () => {
	test("is a class", function() {
		expect(Fween).not.toBe("function");
	});

	test("can be instantiated", () => {
		expect(Fween.use(obj)).toBeDefined();

		//Fween.use(this).to({ pressedPhase: 1}, 0.2, Easing.quadOut).play();
		//Fween.use(this).to({ pressedPhase: 0}, 0.3, Easing.backOutWith(2)).play();
		//Fween.use(this).to({ alpha: 0}, 1).call(resolve).play();
	});
});
