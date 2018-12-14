import ImportedEasing from "./easings/Easing";

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

export const Easing = ImportedEasing;

export default class Fween {

	private static ticker: FweenTicker;

	// Properties

	// ================================================================================================================
	// PUBLIC STATIC INTERFACE ----------------------------------------------------------------------------------------

	public static use(p1: (t: number) => void): FweenSetterSequence;
	public static use(p1: object): FweenObjectSequence;
	public static use(p1: any): FweenSequence | null {
		if (typeof(p1) === "object") {
			// Object
			return new FweenObjectSequence(p1);
		} else if (typeof(p1) === "function") {
			// Setter sequence
			return new FweenSetterSequence(p1);
		}

		console.error("Tweening parameters were not understood.");
		return null;
	}

	public static getTicker(): FweenTicker {
		if (!this.ticker) this.ticker = new FweenTicker();
		return this.ticker;
	}
}
