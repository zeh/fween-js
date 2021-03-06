import { Fween, Easing, FweenSequence, FweenObjectSequence, FweenSetterSequence } from "./../../dist/Fween.umd";
import { enableTimeMocks, timeTravel, disableTimeMocks } from "./utils/timeMock";

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

describe("Fween (ES6)", () => {
	beforeEach(() => {
		enableTimeMocks();
		Fween.resetTicker();
	});

	afterEach(() => {
		disableTimeMocks();
	})

	it("can be instantiated", () => {
		const obj = {};
		expect(Fween.use(obj)).toBeDefined();
	});

	it("can update an object", () => {
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

	it("can update an object, easing", () => {
		const obj = { value: 0 };
		expect(obj.value).toBe(0);
		Fween.use(obj).to({value: 1}, 0.1, Easing.quadOut).play();
		timeTravel(200);
		expect(obj.value).toBe(1);
	});

	it("can call a function", () => {
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
