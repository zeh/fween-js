import Fween, { Easing } from "./../../dist/Fween.umd";
import { enableTimeMocks, timeTravel, disableTimeMocks } from "./utils/timeMock";

describe("Fween (ES6)", () => {
	beforeEach(() => {
		enableTimeMocks();
		Fween.resetTicker();
	});

	afterEach(() => {
		disableTimeMocks();
	})

	test("is a module", function() {
		expect(Fween).not.toBe("function");
	});

	test("can be instantiated", () => {
		const obj = {};
		expect(Fween.use(obj)).toBeDefined();
	});

	test("can update an object", () => {
		const obj = { value: 0 };
		expect(obj.value).toBe(0);
		Fween.use(obj).to({value: 1}, 0.1).play();
		timeTravel(200);
		expect(obj.value).toBe(1);
		Fween.use(obj).to({value: 0}, 0.1).play();
		timeTravel(200);
		expect(obj.value).toBe(0);
		Fween.use(obj).to({value: 2}, 0.1).play();
		timeTravel(200);
		expect(obj.value).toBe(2);
	});

	test("can update an object, easing", () => {
		const obj = { value: 0 };
		expect(obj.value).toBe(0);
		Fween.use(obj).to({value: 1}, 0.1, Easing.quadOut).play();
		timeTravel(200);
		expect(obj.value).toBe(1);
	});

	test("can call a function", () => {
		const fn1 = jest.fn();
		const fn2 = jest.fn();

		const obj = { value: 0 };
		expect(obj.value).toBe(0);
		Fween.use(obj).call(fn1).to({value: 1}, 0.1).call(fn2).play();

		expect(fn1).not.toBeCalled();
		expect(fn2).not.toBeCalled();

		timeTravel(50);

		expect(fn1).toHaveBeenCalledTimes(1);
		expect(fn2).not.toBeCalled();

		timeTravel(60);

		expect(fn1).toHaveBeenCalledTimes(1);
		expect(fn2).toHaveBeenCalledTimes(1);

		expect(obj.value).toBe(1);
	});

	// TODO:
	// .wait()
	// .use(setter)
});
