/**
 * @author Zeh Fernando
 */
export default class MathUtils {
    // Inlining: http://www.bytearray.org/?p=4789
    // Not working: returning a buffer underflow every time I try using it
    /**
     * Clamps a number to a range, by restricting it to a minimum and maximum values: if the passed value is lower than the minimum value, it's replaced by the minimum; if it's higher than the maximum value, it's replaced by the maximum; if not, it's unchanged.
     * @param value	The value to be clamped.
     * @param min		Minimum value allowed.
     * @param max		Maximum value allowed.
     * @return			The newly clamped value.
     */
    static clamp(value, min = 0, max = 1) {
        return value < min ? min : value > max ? max : value;
    }
    static clampAuto(value, clamp1 = 0, clamp2 = 1) {
        if (clamp2 < clamp1) {
            var v = clamp2;
            clamp2 = clamp1;
            clamp1 = v;
        }
        return value < clamp1 ? clamp1 : value > clamp2 ? clamp2 : value;
    }
    /**
     * Maps a value from a range, determined by old minimum and maximum values, to a new range, determined by new minimum and maximum values. These minimum and maximum values are referential; the new value is not clamped by them.
     * @param value	The value to be re-mapped.
     * @param oldMin	The previous minimum value.
     * @param oldMax	The previous maximum value.
     * @param newMin	The new minimum value.
     * @param newMax	The new maximum value.
     * @return			The new value, mapped to the new range.
     */
    static map(value, oldMin, oldMax, newMin = 0, newMax = 1, clamp = false) {
        if (oldMin == oldMax)
            return newMin;
        this.map_p = ((value - oldMin) / (oldMax - oldMin) * (newMax - newMin)) + newMin;
        if (clamp)
            this.map_p = newMin < newMax ? this.clamp(this.map_p, newMin, newMax) : this.clamp(this.map_p, newMax, newMin);
        return this.map_p;
    }
    /**
     * Clamps a value to a range, by restricting it to a minimum and maximum values but folding the value to the range instead of simply resetting to the minimum and maximum. It works like a more powerful Modulo function.
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
    static rangeMod(value, min, pseudoMax) {
        var range = pseudoMax - min;
        value = (value - min) % range;
        if (value < 0)
            value = range - (-value % range);
        value += min;
        return value;
    }
    static isPowerOfTwo(value) {
        // Return true if a number if a power of two (2, 4, 8, etc)
        // There's probably a better way, but trying to avoid bitwise manipulations
        while (value % 2 == 0 && value > 2)
            value /= 2;
        return value == 2;
    }
    static getHighestPowerOfTwo(value) {
        // Return a power of two number that is higher than the passed value
        var c = 1;
        while (c < value)
            c *= 2;
        return c;
    }
}
MathUtils.DEG2RAD = 1 / 180 * Math.PI;
MathUtils.RAD2DEG = 1 / Math.PI * 180;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL01hdGhVdGlscy50cyJdLCJuYW1lcyI6WyJNYXRoVXRpbHMiLCJNYXRoVXRpbHMuY2xhbXAiLCJNYXRoVXRpbHMuY2xhbXBBdXRvIiwiTWF0aFV0aWxzLm1hcCIsIk1hdGhVdGlscy5yYW5nZU1vZCIsIk1hdGhVdGlscy5pc1Bvd2VyT2ZUd28iLCJNYXRoVXRpbHMuZ2V0SGlnaGVzdFBvd2VyT2ZUd28iXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBQ0g7SUFRQ0EsNkNBQTZDQTtJQUM3Q0Esc0VBQXNFQTtJQUV0RUE7Ozs7OztPQU1HQTtJQUNIQSxPQUFPQSxLQUFLQSxDQUFDQSxLQUFZQSxFQUFFQSxHQUFHQSxHQUFVQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFVQSxDQUFDQTtRQUN4REMsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDdERBLENBQUNBO0lBRURELE9BQU9BLFNBQVNBLENBQUNBLEtBQVlBLEVBQUVBLE1BQU1BLEdBQVVBLENBQUNBLEVBQUVBLE1BQU1BLEdBQVVBLENBQUNBO1FBQ2xFRSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQkEsSUFBSUEsQ0FBQ0EsR0FBVUEsTUFBTUEsQ0FBQ0E7WUFDdEJBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBO1lBQ2hCQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNaQSxDQUFDQTtRQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxHQUFHQSxNQUFNQSxHQUFHQSxLQUFLQSxHQUFHQSxNQUFNQSxHQUFHQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNsRUEsQ0FBQ0E7SUFFREY7Ozs7Ozs7O09BUUdBO0lBQ0hBLE9BQU9BLEdBQUdBLENBQUNBLEtBQVlBLEVBQUVBLE1BQWFBLEVBQUVBLE1BQWFBLEVBQUVBLE1BQU1BLEdBQVVBLENBQUNBLEVBQUVBLE1BQU1BLEdBQVVBLENBQUNBLEVBQUVBLEtBQUtBLEdBQVdBLEtBQUtBO1FBQ2pIRyxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxJQUFJQSxNQUFNQSxDQUFDQTtZQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFDM0VBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1FBQzFIQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNuQkEsQ0FBQ0E7SUFFREg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BdUJHQTtJQUNIQSxzQkFBc0JBO0lBQ3RCQSxPQUFPQSxRQUFRQSxDQUFDQSxLQUFZQSxFQUFFQSxHQUFVQSxFQUFFQSxTQUFnQkE7UUFDekRJLElBQUlBLEtBQUtBLEdBQVVBLFNBQVNBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ25DQSxLQUFLQSxHQUFHQSxDQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM5QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDaERBLEtBQUtBLElBQUlBLEdBQUdBLENBQUNBO1FBQ2JBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2RBLENBQUNBO0lBRURKLE9BQU9BLFlBQVlBLENBQUNBLEtBQVlBO1FBQy9CSywyREFBMkRBO1FBQzNEQSwyRUFBMkVBO1FBQzNFQSxPQUFPQSxLQUFLQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxLQUFLQSxHQUFHQSxDQUFDQTtZQUFFQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMvQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDbkJBLENBQUNBO0lBRURMLE9BQU9BLG9CQUFvQkEsQ0FBQ0EsS0FBWUE7UUFDdkNNLG9FQUFvRUE7UUFDcEVBLElBQUlBLENBQUNBLEdBQVVBLENBQUNBLENBQUNBO1FBQ2pCQSxPQUFPQSxDQUFDQSxHQUFHQSxLQUFLQTtZQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN6QkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDVkEsQ0FBQ0E7QUFDRk4sQ0FBQ0E7QUEzRk8saUJBQU8sR0FBVSxDQUFDLEdBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDakMsaUJBQU8sR0FBVSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBMEZ2QyIsImZpbGUiOiJ1dGlscy9NYXRoVXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGF1dGhvciBaZWggRmVybmFuZG9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGhVdGlscyB7XHJcblxyXG5cdHN0YXRpYyBERUcyUkFEOm51bWJlciA9IDEvMTgwICogTWF0aC5QSTtcclxuXHRzdGF0aWMgUkFEMkRFRzpudW1iZXIgPSAxL01hdGguUEkgKiAxODA7XHJcblxyXG5cdC8vIFRlbXBvcmFyeSB2YXJzIGZvciBmYXN0ZXIgYWxsb2NhdGlvbnNcclxuXHRwcml2YXRlIHN0YXRpYyBtYXBfcDpudW1iZXI7XHJcblxyXG5cdC8vIElubGluaW5nOiBodHRwOi8vd3d3LmJ5dGVhcnJheS5vcmcvP3A9NDc4OVxyXG5cdC8vIE5vdCB3b3JraW5nOiByZXR1cm5pbmcgYSBidWZmZXIgdW5kZXJmbG93IGV2ZXJ5IHRpbWUgSSB0cnkgdXNpbmcgaXRcclxuXHJcblx0LyoqXHJcblx0ICogQ2xhbXBzIGEgbnVtYmVyIHRvIGEgcmFuZ2UsIGJ5IHJlc3RyaWN0aW5nIGl0IHRvIGEgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXM6IGlmIHRoZSBwYXNzZWQgdmFsdWUgaXMgbG93ZXIgdGhhbiB0aGUgbWluaW11bSB2YWx1ZSwgaXQncyByZXBsYWNlZCBieSB0aGUgbWluaW11bTsgaWYgaXQncyBoaWdoZXIgdGhhbiB0aGUgbWF4aW11bSB2YWx1ZSwgaXQncyByZXBsYWNlZCBieSB0aGUgbWF4aW11bTsgaWYgbm90LCBpdCdzIHVuY2hhbmdlZC5cclxuXHQgKiBAcGFyYW0gdmFsdWVcdFRoZSB2YWx1ZSB0byBiZSBjbGFtcGVkLlxyXG5cdCAqIEBwYXJhbSBtaW5cdFx0TWluaW11bSB2YWx1ZSBhbGxvd2VkLlxyXG5cdCAqIEBwYXJhbSBtYXhcdFx0TWF4aW11bSB2YWx1ZSBhbGxvd2VkLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRUaGUgbmV3bHkgY2xhbXBlZCB2YWx1ZS5cclxuXHQgKi9cclxuXHRzdGF0aWMgY2xhbXAodmFsdWU6bnVtYmVyLCBtaW46bnVtYmVyID0gMCwgbWF4Om51bWJlciA9IDEpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdmFsdWUgPCBtaW4gPyBtaW4gOiB2YWx1ZSA+IG1heCA/IG1heCA6IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNsYW1wQXV0byh2YWx1ZTpudW1iZXIsIGNsYW1wMTpudW1iZXIgPSAwLCBjbGFtcDI6bnVtYmVyID0gMSk6bnVtYmVyIHtcclxuXHRcdGlmIChjbGFtcDIgPCBjbGFtcDEpIHtcclxuXHRcdFx0dmFyIHY6bnVtYmVyID0gY2xhbXAyO1xyXG5cdFx0XHRjbGFtcDIgPSBjbGFtcDE7XHJcblx0XHRcdGNsYW1wMSA9IHY7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdmFsdWUgPCBjbGFtcDEgPyBjbGFtcDEgOiB2YWx1ZSA+IGNsYW1wMiA/IGNsYW1wMiA6IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogTWFwcyBhIHZhbHVlIGZyb20gYSByYW5nZSwgZGV0ZXJtaW5lZCBieSBvbGQgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMsIHRvIGEgbmV3IHJhbmdlLCBkZXRlcm1pbmVkIGJ5IG5ldyBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcy4gVGhlc2UgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMgYXJlIHJlZmVyZW50aWFsOyB0aGUgbmV3IHZhbHVlIGlzIG5vdCBjbGFtcGVkIGJ5IHRoZW0uXHJcblx0ICogQHBhcmFtIHZhbHVlXHRUaGUgdmFsdWUgdG8gYmUgcmUtbWFwcGVkLlxyXG5cdCAqIEBwYXJhbSBvbGRNaW5cdFRoZSBwcmV2aW91cyBtaW5pbXVtIHZhbHVlLlxyXG5cdCAqIEBwYXJhbSBvbGRNYXhcdFRoZSBwcmV2aW91cyBtYXhpbXVtIHZhbHVlLlxyXG5cdCAqIEBwYXJhbSBuZXdNaW5cdFRoZSBuZXcgbWluaW11bSB2YWx1ZS5cclxuXHQgKiBAcGFyYW0gbmV3TWF4XHRUaGUgbmV3IG1heGltdW0gdmFsdWUuXHJcblx0ICogQHJldHVyblx0XHRcdFRoZSBuZXcgdmFsdWUsIG1hcHBlZCB0byB0aGUgbmV3IHJhbmdlLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBtYXAodmFsdWU6bnVtYmVyLCBvbGRNaW46bnVtYmVyLCBvbGRNYXg6bnVtYmVyLCBuZXdNaW46bnVtYmVyID0gMCwgbmV3TWF4Om51bWJlciA9IDEsIGNsYW1wOkJvb2xlYW4gPSBmYWxzZSk6bnVtYmVyIHtcclxuXHRcdGlmIChvbGRNaW4gPT0gb2xkTWF4KSByZXR1cm4gbmV3TWluO1xyXG5cdFx0dGhpcy5tYXBfcCA9ICgodmFsdWUtb2xkTWluKSAvIChvbGRNYXgtb2xkTWluKSAqIChuZXdNYXgtbmV3TWluKSkgKyBuZXdNaW47XHJcblx0XHRpZiAoY2xhbXApIHRoaXMubWFwX3AgPSBuZXdNaW4gPCBuZXdNYXggPyB0aGlzLmNsYW1wKHRoaXMubWFwX3AsIG5ld01pbiwgbmV3TWF4KSA6IHRoaXMuY2xhbXAodGhpcy5tYXBfcCwgbmV3TWF4LCBuZXdNaW4pO1xyXG5cdFx0cmV0dXJuIHRoaXMubWFwX3A7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDbGFtcHMgYSB2YWx1ZSB0byBhIHJhbmdlLCBieSByZXN0cmljdGluZyBpdCB0byBhIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWVzIGJ1dCBmb2xkaW5nIHRoZSB2YWx1ZSB0byB0aGUgcmFuZ2UgaW5zdGVhZCBvZiBzaW1wbHkgcmVzZXR0aW5nIHRvIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtLiBJdCB3b3JrcyBsaWtlIGEgbW9yZSBwb3dlcmZ1bCBNb2R1bG8gZnVuY3Rpb24uXHJcblx0ICogQHBhcmFtIHZhbHVlXHRUaGUgdmFsdWUgdG8gYmUgY2xhbXBlZC5cclxuXHQgKiBAcGFyYW0gbWluXHRcdE1pbmltdW0gdmFsdWUgYWxsb3dlZC5cclxuXHQgKiBAcGFyYW0gbWF4XHRcdE1heGltdW0gdmFsdWUgYWxsb3dlZC5cclxuXHQgKiBAcmV0dXJuXHRcdFx0VGhlIG5ld2x5IGNsYW1wZWQgdmFsdWUuXHJcblx0ICogQGV4YW1wbGUgU29tZSBleGFtcGxlczpcclxuXHQgKiA8bGlzdGluZyB2ZXJzaW9uPVwiMy4wXCI+XHJcblx0ICogXHR0cmFjZShNYXRoVXRpbHMucm91bmRDbGFtcCgxNCwgMCwgMTApKTtcclxuXHQgKiBcdC8vIFJlc3VsdDogNFxyXG5cdCAqXHJcblx0ICogXHR0cmFjZShNYXRoVXRpbHMucm91bmRDbGFtcCgzNjAsIDAsIDM2MCkpO1xyXG5cdCAqIFx0Ly8gUmVzdWx0OiAwXHJcblx0ICpcclxuXHQgKiBcdHRyYWNlKE1hdGhVdGlscy5yb3VuZENsYW1wKDM2MCwgLTE4MCwgMTgwKSk7XHJcblx0ICogXHQvLyBSZXN1bHQ6IDBcclxuXHQgKlxyXG5cdCAqIFx0dHJhY2UoTWF0aFV0aWxzLnJvdW5kQ2xhbXAoMjEsIDAsIDEwKSk7XHJcblx0ICogXHQvLyBSZXN1bHQ6IDFcclxuXHQgKlxyXG5cdCAqIFx0dHJhY2UoTWF0aFV0aWxzLnJvdW5kQ2xhbXAoLTk4LCAwLCAxMDApKTtcclxuXHQgKiBcdC8vIFJlc3VsdDogMlxyXG5cdCAqIDwvbGlzdGluZz5cclxuXHQgKi9cclxuXHQvLyBOZWVkIGEgYmV0dGVyIG5hbWU/XHJcblx0c3RhdGljIHJhbmdlTW9kKHZhbHVlOm51bWJlciwgbWluOm51bWJlciwgcHNldWRvTWF4Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHZhciByYW5nZTpudW1iZXIgPSBwc2V1ZG9NYXggLSBtaW47XHJcblx0XHR2YWx1ZSA9ICh2YWx1ZSAtIG1pbikgJSByYW5nZTtcclxuXHRcdGlmICh2YWx1ZSA8IDApIHZhbHVlID0gcmFuZ2UgLSAoLXZhbHVlICUgcmFuZ2UpO1xyXG5cdFx0dmFsdWUgKz0gbWluO1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGlzUG93ZXJPZlR3byh2YWx1ZTpudW1iZXIpOkJvb2xlYW4ge1xyXG5cdFx0Ly8gUmV0dXJuIHRydWUgaWYgYSBudW1iZXIgaWYgYSBwb3dlciBvZiB0d28gKDIsIDQsIDgsIGV0YylcclxuXHRcdC8vIFRoZXJlJ3MgcHJvYmFibHkgYSBiZXR0ZXIgd2F5LCBidXQgdHJ5aW5nIHRvIGF2b2lkIGJpdHdpc2UgbWFuaXB1bGF0aW9uc1xyXG5cdFx0d2hpbGUgKHZhbHVlICUgMiA9PSAwICYmIHZhbHVlID4gMikgdmFsdWUgLz0gMjtcclxuXHRcdHJldHVybiB2YWx1ZSA9PSAyO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldEhpZ2hlc3RQb3dlck9mVHdvKHZhbHVlOm51bWJlcik6bnVtYmVyIHtcclxuXHRcdC8vIFJldHVybiBhIHBvd2VyIG9mIHR3byBudW1iZXIgdGhhdCBpcyBoaWdoZXIgdGhhbiB0aGUgcGFzc2VkIHZhbHVlXHJcblx0XHR2YXIgYzpudW1iZXIgPSAxO1xyXG5cdFx0d2hpbGUgKGMgPCB2YWx1ZSkgYyAqPSAyO1xyXG5cdFx0cmV0dXJuIGM7XHJcblx0fVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9