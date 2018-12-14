/*
Disclaimer for Robert Penner's Easing Equations license:

TERMS OF USE - EASING EQUATIONS

Open source under the BSD License.

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	* Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Based on Robert Penner's easing equations - remade from Tweener's equations, but simplified
 * Not fully tested!
 */

export default class Easing {

	// Constants
	private static HALF_PI: number = Math.PI / 2;
	private static TWO_PI: number = Math.PI * 2;

	// ================================================================================================================
	// EQUATIONS ------------------------------------------------------------------------------------------------------

	/**
	 * Easing equation function for a simple linear tweening, with no easing.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static none(t: number): number {
		return t;
	}

	/**
	 * Easing equation function for a quadratic (t^2) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static quadIn(t: number): number {
		return t * t;
	}

	/**
	 * Easing equation function for a quadratic (t^2) easing out: decelerating to zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static quadOut(t: number): number {
		return -t * (t - 2);
	}

	/**
	 * Easing equation function for a quadratic (t^2) easing in and then out: accelerating from zero velocity, then decelerating.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static quadInOut(t: number): number {
		//return t < 0.5 ? quadIn(t*2) : quadOut((t-0.5)*2);
		return ((t *= 2) < 1) ? t * t * 0.5 : -0.5 * (--t * (t - 2) - 1);
	}

	/**
	 * Easing equation function for a cubic (t^3) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static cubicIn(t: number): number {
		return t * t * t;
	}

	/**
	 * Easing equation function for a cubic (t^3) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static cubicOut(t: number): number {
		return (t = t - 1) * t * t + 1;
	}

	public static cubicInOut(t: number): number {
		return (t *= 2) < 1 ? Easing.cubicIn(t) / 2 : Easing.cubicOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
	}

	/**
	 * Easing equation function for a quartic (t^4) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static quartIn(t: number): number {
		return t * t * t * t;
	}

	/**
	 * Easing equation function for a quartic (t^4) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static quartOut(t: number): number {
		t--;
		return -1 * (t * t * t * t - 1);
	}

	public static quartInOut(t: number): number {
		return (t *= 2) < 1 ? Easing.quartIn(t) / 2 : Easing.quartOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
	}

	/**
	 * Easing equation function for a quintic (t^5) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static quintIn(t: number): number {
		return t * t * t * t * t;
	}

	/**
	 * Easing equation function for a quintic (t^5) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static quintOut(t: number): number {
		t--;
		return t * t * t * t * t + 1;
	}

	static quintInOut(t: number): number {
		return (t *= 2) < 1 ? Easing.quintIn(t) / 2 : Easing.quintOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
	}

	/**
	 * Easing equation function for a sinusoidal (sin(t)) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static sineIn(t: number): number {
		return -1 * Math.cos(t * Easing.HALF_PI) + 1;
	}

	/**
	 * Easing equation function for a sinusoidal (sin(t)) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static sineOut(t: number): number {
		return Math.sin(t * Easing.HALF_PI);
	}

	public static sineInOut(t: number): number {
		return (t *= 2) < 1 ? Easing.sineIn(t) / 2 : Easing.sineOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
	}

	/**
	 * Easing equation function for an exponential (2^t) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static expoIn(t: number): number {
		// return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; // original
		return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1)) - 0.001; // ztween fixed
	}

	/**
	 * Easing equation function for an exponential (2^t) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static expoOut(t: number): number {
		// return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; // original
		// return (t==1) ? 1 : (-Math.pow(2, -10 * t) + 1); // ztween
		// return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b; // tweener fixed
		//log(">", t, (t==1) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1))
		//return (t==1) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1); // ztween fixed
		return (t >= 0.999) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1); // ztween fixed 2
	}

	public static expoInOut(t: number): number {
		return (t *= 2) < 1 ? Easing.expoIn(t) / 2 : Easing.expoOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
	}

	/**
	 * Easing equation function for a circular (sqrt(1-t^2)) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static circIn(t: number): number {
		return -1 * (Math.sqrt(1 - t * t) - 1);
	}

	/**
	 * Easing equation function for a circular (sqrt(1-t^2)) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @return				The new value/phase (0-1).
	 */
	public static circOut(t: number): number {
		t--;
		return Math.sqrt(1 - t * t);
	}

	public static circInOut(t: number): number {
		return (t *= 2) < 1 ? Easing.circIn(t) / 2 : Easing.circOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
	}

	/**
	 * Easing equation function for an elastic (exponentially decaying sine wave) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @param	a			Amplitude.
	 * @param	p			Period.
	 * @return				The new value/phase (0-1).
	 */
	public static elasticIn(t: number, a: number = 0, p: number = 0.3): number {
		if (t == 0) return 0;
		if (t == 1) return 1;
		var s: number;
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / Easing.TWO_PI * Math.asin(1 / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * Easing.TWO_PI / p));
	}

	/**
	 * Easing equation function for an elastic (exponentially decaying sine wave) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @param	a			Amplitude.
	 * @param	p			Period.
	 */
	public static elasticOut(t: number, a: number = 0, p: number = 0.3): number {
		if (t == 0) return 0;
		if (t == 1) return 1;
		var s: number;
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / Easing.TWO_PI * Math.asin(1 / a);
		}
		return (a * Math.pow(2, -10 * t) * Math.sin((t - s) * Easing.TWO_PI / p) + 1);
	}

	/**
	 * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @param	s			Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
	 * @param	p			Period.
	 */
	public static backIn(t: number, s: number = 1.70158): number {
		return t * t * ((s + 1) * t - s);
	}

	/**
	 * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @param	s			Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
	 * @param	p			Period.
	 */
	public static backOut(t: number, s: number = 1.70158): number {
		t--;
		return t * t * ((s + 1) * t + s) + 1;
	}

	public static backOutWith(overshoot: number = 1.70158) {
		return (t: number) => {
			return this.backOut(t, overshoot);
		}
	}

	public static backInOut(t: number): number {
		return (t *= 2) < 1 ? Easing.backIn(t) / 2 : Easing.backOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
	}

	/**
	 * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing in: accelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @param	p			Period.
	 */
	public static bounceIn(t: number): number {
		return 1 - Easing.bounceOut(1 - t);
	}

	/**
	 * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing out: decelerating from zero velocity.
	 *
	 * @param	t			Current time/phase (0-1).
	 * @param	p			Period.
	 */
	public static bounceOut(t: number): number {
		if (t < (1 / 2.75)) {
			return 7.5625 * t * t;
		} else if (t < (2 / 2.75)) {
			return 7.5625 * (t -= (1.5 / 2.75)) * t + .75;
		} else if (t < (2.5 / 2.75)) {
			return 7.5625 * (t -= (2.25 / 2.75)) * t + .9375;
		} else {
			return 7.5625 * (t -= (2.625 / 2.75)) * t + .984375;
		}
	}


	// ================================================================================================================
	// COMBINATOR -----------------------------------------------------------------------------------------------------

	public static combined(t: number, __equations: any[]): number {
		let l: number = __equations.length;
		let eq: number = Math.floor(t * l);
		if (eq === __equations.length) eq = l - 1;
		return Number(__equations[eq](t * l - eq));
	}
}
