import MockDate from "mockdate";

const originalRequestAnimationFrame = global.requestAnimationFrame;
const originalCancelAnimationFrame = global.cancelAnimationFrame;

let enabled = false;

/**
 * Disable requestAnimationFrame() and use timers
 * Then we can use:
 * - jest.useFakeTimers()
 * - jest.runAllTimers()
 * - jest.runOnlyPendingTimers()
 * - jest.advanceTimersByTime()
 * - jest.clearAllTimers()
 * to simulate time.
 */
export function enableTimeMocks() {
	// Ensure requestAnimationFrame() uses time functions
	if (!enabled) {
		useFixedTime();

		let lastTime = 0;
		enabled = true;
		global.requestAnimationFrame = callback => {
			const currTime = new Date().getTime();
			const timeToCall = Math.max(0, 16 - (currTime - lastTime));
			const id = setTimeout(() => {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

		global.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};

		// Enable fake timers on jest
		jest.useFakeTimers();

		timeTravel(0);
	}
}

export function timeTravel(durationMs, step = 100) {
	if (enabled) {
		const tickTravel = tickDurationMs => {
			jest.advanceTimersByTime(tickDurationMs);
			const now = Date.now();
			MockDate.set(new Date(now + tickDurationMs));
		};

		let done = 0;
		while (durationMs - done > step) {
			tickTravel(step);
			done += step;
		}
		tickTravel(durationMs - done);
	}
}

export function disableTimeMocks() {
	if (enabled) {
		enabled = false;

		jest.clearAllTimers();
		jest.useRealTimers();

		global.requestAnimationFrame = originalRequestAnimationFrame;
		global.cancelAnimationFrame = originalCancelAnimationFrame;

		MockDate.reset();
	}
}

export function useFixedTime() {
	MockDate.set(1540326022034);
}
