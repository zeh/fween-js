import FweenSequence from "./default/FweenSequence";
import FweenTicker from "./FweenTicker";
import FweenObjectSequence from "./object/FweenObjectSequence";
import FweenSetterSequence from "./setter/FweenSetterSequence";

/*
Ideas for tweening - from https://github.com/zeh/unity-tidbits/blob/master/transitions/ZTween.cs

DONE:

-- FweenSetterSequence:

Fween
	.use(getter)
	.from(value)
	.to(value, t, transition)

-- FweenObjectSequence:

Fween
	.use(object)
	.to({name: value}, t, transition)

All:
   .call(f)
   .wait(t)

Also:
	.play()
	.pause()
	.isPlaying()

TODO:
	.stop()
	.seek()

*/

let ticker: FweenTicker;

function use(p1: (t: number) => void): FweenSetterSequence;
function use(p1: object): FweenObjectSequence;
function use(p1: any): FweenSequence | null {
	if (typeof p1 === "object") {
		// Object
		return new FweenObjectSequence(p1, getTicker());
	} else if (typeof p1 === "function") {
		// Setter sequence
		return new FweenSetterSequence(p1, getTicker());
	}

	console.error("Tweening parameters were not understood.");
	return null;
}

function resetTicker(): void {
	ticker = new FweenTicker();
}

function getTicker(): FweenTicker {
	if (!ticker) ticker = new FweenTicker();
	return ticker;
}

const Fween = {
	use,
	getTicker,
	resetTicker,
};

export default Fween;
