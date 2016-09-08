/**
 * @author Zeh Fernando
 */
export default class MathUtils {

	public static DEG2RAD:number = 1 / 180 * Math.PI;
	public static RAD2DEG:number = 1 / Math.PI * 180;

	// Temporary vars for faster allocations
	private static map_p:number;

	/**
	 * Clamps a number to a range, by restricting it to a minimum and maximum values: if the passed
	 * value is lower than the minimum value, it's replaced by the minimum; if it's higher than the
	 * maximum value, it's replaced by the maximum; if not, it's unchanged.
	 *
	 * @param value	The value to be clamped.
	 * @param min		Minimum value allowed.
	 * @param max		Maximum value allowed.
	 * @return			The newly clamped value.
	 */
	public static clamp(value:number, min:number = 0, max:number = 1):number {
		return value < min ? min : value > max ? max : value;
	}

	public static clampAuto(value:number, clamp1:number = 0, clamp2:number = 1):number {
		if (clamp2 < clamp1) {
			let v:number = clamp2;
			clamp2 = clamp1;
			clamp1 = v;
		}
		return value < clamp1 ? clamp1 : value > clamp2 ? clamp2 : value;
	}

	/**
	 * Maps a value from a range, determined by old minimum and maximum values, to a new range,
	 * determined by new minimum and maximum values. These minimum and maximum values are
	 * referential; the new value is not clamped by them.
	 *
	 * @param value	The value to be re-mapped.
	 * @param oldMin	The previous minimum value.
	 * @param oldMax	The previous maximum value.
	 * @param newMin	The new minimum value.
	 * @param newMax	The new maximum value.
	 * @return			The new value, mapped to the new range.
	 */
	public static map(value:number, oldMin:number, oldMax:number, newMin:number = 0, newMax:number = 1, clamp:Boolean = false):number {
		if (oldMin === oldMax) return newMin;
		this.map_p = ((value - oldMin) / (oldMax - oldMin) * (newMax - newMin)) + newMin;
		if (clamp) this.map_p = newMin < newMax ? this.clamp(this.map_p, newMin, newMax) : this.clamp(this.map_p, newMax, newMin);
		return this.map_p;
	}

	/**
	 * Clamps a value to a range, by restricting it to a minimum and maximum values but folding the
	 * value to the range instead of simply resetting to the minimum and maximum. It works like a
	 * more powerful Modulo function.
	 *
	 * @param value	The value to be clamped.
	 * @param min		Minimum value allowed.
	 * @param max		Maximum value allowed.
	 * @return			The newly clamped value.
	 * @example Some examples:
	 * <listing version="3.0">
	 * 	trace(MathUtils.roundClamp(14, 0, 10));
	 * 	// Result: 4
	 *
	 * 	trace(MathUtils.roundClamp(360, 0, 360));
	 * 	// Result: 0
	 *
	 * 	trace(MathUtils.roundClamp(360, -180, 180));
	 * 	// Result: 0
	 *
	 * 	trace(MathUtils.roundClamp(21, 0, 10));
	 * 	// Result: 1
	 *
	 * 	trace(MathUtils.roundClamp(-98, 0, 100));
	 * 	// Result: 2
	 * </listing>
	 */
	// Need a better name?
	public static rangeMod(value:number, min:number, pseudoMax:number):number {
		let range:number = pseudoMax - min;
		value = (value - min) % range;
		if (value < 0) value = range - (-value % range);
		value += min;
		return value;
	}

	public static isPowerOfTwo(value:number):Boolean {
		// Return true if a number if a power of two (2, 4, 8, etc)
		// There's probably a better way, but trying to avoid bitwise manipulations
		while (value % 2 === 0 && value > 2) value /= 2;
		return value === 2;
	}

	public static getHighestPowerOfTwo(value:number):number {
		// Return a power of two number that is higher than the passed value
		let c:number = 1;
		while (c < value) c <<= 1;
		return c;
	}
}