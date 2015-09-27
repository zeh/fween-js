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
define(["require", "exports"], function (require, exports) {
    /**
     * @author Zeh Fernando
     * Based on Robert Penner's easing equations - remade from Tweener's equations, but simplified
     * Not fully tested!
     */
    var Easing = (function () {
        function Easing() {
        }
        // ================================================================================================================
        // EQUATIONS ------------------------------------------------------------------------------------------------------
        /**
         * Easing equation function for a simple linear tweening, with no easing.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.none = function (t) {
            return t;
        };
        /**
         * Easing equation function for a quadratic (t^2) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.quadIn = function (t) {
            return t * t;
        };
        /**
         * Easing equation function for a quadratic (t^2) easing out: decelerating to zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.quadOut = function (t) {
            return -t * (t - 2);
        };
        /**
         * Easing equation function for a quadratic (t^2) easing in and then out: accelerating from zero velocity, then decelerating.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.quadInOut = function (t) {
            //return t < 0.5 ? quadIn(t*2) : quadOut((t-0.5)*2);
            return ((t *= 2) < 1) ? t * t * 0.5 : -0.5 * (--t * (t - 2) - 1);
        };
        /**
         * Easing equation function for a cubic (t^3) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.cubicIn = function (t) {
            return t * t * t;
        };
        /**
         * Easing equation function for a cubic (t^3) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.cubicOut = function (t) {
            return (t = t - 1) * t * t + 1;
        };
        Easing.cubicInOut = function (t) {
            return (t *= 2) < 1 ? Easing.cubicIn(t) / 2 : Easing.cubicOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
        };
        /**
         * Easing equation function for a quartic (t^4) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.quartIn = function (t) {
            return t * t * t * t;
        };
        /**
         * Easing equation function for a quartic (t^4) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.quartOut = function (t) {
            t--;
            return -1 * (t * t * t * t - 1);
        };
        Easing.quartInOut = function (t) {
            return (t *= 2) < 1 ? Easing.quartIn(t) / 2 : Easing.quartOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
        };
        /**
         * Easing equation function for a quintic (t^5) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.quintIn = function (t) {
            return t * t * t * t * t;
        };
        /**
         * Easing equation function for a quintic (t^5) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.quintOut = function (t) {
            t--;
            return t * t * t * t * t + 1;
        };
        Easing.quintInOut = function (t) {
            return (t *= 2) < 1 ? Easing.quintIn(t) / 2 : Easing.quintOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
        };
        /**
         * Easing equation function for a sinusoidal (sin(t)) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.sineIn = function (t) {
            return -1 * Math.cos(t * Easing.HALF_PI) + 1;
        };
        /**
         * Easing equation function for a sinusoidal (sin(t)) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.sineOut = function (t) {
            return Math.sin(t * Easing.HALF_PI);
        };
        Easing.sineInOut = function (t) {
            return (t *= 2) < 1 ? Easing.sineIn(t) / 2 : Easing.sineOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
        };
        /**
         * Easing equation function for an exponential (2^t) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.expoIn = function (t) {
            // return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; // original
            return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1)) - 0.001; // ztween fixed
        };
        /**
         * Easing equation function for an exponential (2^t) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.expoOut = function (t) {
            // return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; // original
            // return (t==1) ? 1 : (-Math.pow(2, -10 * t) + 1); // ztween
            // return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b; // tweener fixed
            //log(">", t, (t==1) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1))
            //return (t==1) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1); // ztween fixed
            return (t >= 0.999) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1); // ztween fixed 2
        };
        Easing.expoInOut = function (t) {
            return (t *= 2) < 1 ? Easing.expoIn(t) / 2 : Easing.expoOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
        };
        /**
         * Easing equation function for a circular (sqrt(1-t^2)) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.circIn = function (t) {
            return -1 * (Math.sqrt(1 - t * t) - 1);
        };
        /**
         * Easing equation function for a circular (sqrt(1-t^2)) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @return				The new value/phase (0-1).
         */
        Easing.circOut = function (t) {
            t--;
            return Math.sqrt(1 - t * t);
        };
        Easing.circInOut = function (t) {
            return (t *= 2) < 1 ? Easing.circIn(t) / 2 : Easing.circOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
        };
        /**
         * Easing equation function for an elastic (exponentially decaying sine wave) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @param	a			Amplitude.
         * @param	p			Period.
         * @return				The new value/phase (0-1).
         */
        Easing.elasticIn = function (t, a, p) {
            if (a === void 0) { a = 0; }
            if (p === void 0) { p = 0.3; }
            if (t == 0)
                return 0;
            if (t == 1)
                return 1;
            var s;
            if (a < 1) {
                a = 1;
                s = p / 4;
            }
            else {
                s = p / Easing.TWO_PI * Math.asin(1 / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * Easing.TWO_PI / p));
        };
        /**
         * Easing equation function for an elastic (exponentially decaying sine wave) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @param	a			Amplitude.
         * @param	p			Period.
         */
        Easing.elasticOut = function (t, a, p) {
            if (a === void 0) { a = 0; }
            if (p === void 0) { p = 0.3; }
            if (t == 0)
                return 0;
            if (t == 1)
                return 1;
            var s;
            if (a < 1) {
                a = 1;
                s = p / 4;
            }
            else {
                s = p / Easing.TWO_PI * Math.asin(1 / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t - s) * Easing.TWO_PI / p) + 1);
        };
        /**
         * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @param	s			Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
         * @param	p			Period.
         */
        Easing.backIn = function (t, s) {
            if (s === void 0) { s = 1.70158; }
            return t * t * ((s + 1) * t - s);
        };
        /**
         * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @param	s			Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
         * @param	p			Period.
         */
        Easing.backOut = function (t, s) {
            if (s === void 0) { s = 1.70158; }
            t--;
            return t * t * ((s + 1) * t + s) + 1;
        };
        Easing.backInOut = function (t) {
            return (t *= 2) < 1 ? Easing.backIn(t) / 2 : Easing.backOut(t - 1) / 2 + 0.5; // TODO: redo with in-line calculation
        };
        /**
         * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing in: accelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @param	p			Period.
         */
        Easing.bounceIn = function (t) {
            return 1 - Easing.bounceOut(1 - t);
        };
        /**
         * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing out: decelerating from zero velocity.
         *
         * @param	t			Current time/phase (0-1).
         * @param	p			Period.
         */
        Easing.bounceOut = function (t) {
            if (t < (1 / 2.75)) {
                return 7.5625 * t * t;
            }
            else if (t < (2 / 2.75)) {
                return 7.5625 * (t -= (1.5 / 2.75)) * t + .75;
            }
            else if (t < (2.5 / 2.75)) {
                return 7.5625 * (t -= (2.25 / 2.75)) * t + .9375;
            }
            else {
                return 7.5625 * (t -= (2.625 / 2.75)) * t + .984375;
            }
        };
        // ================================================================================================================
        // COMBINATOR -----------------------------------------------------------------------------------------------------
        Easing.combined = function (t, __equations) {
            var l = __equations.length;
            var eq = Math.floor(t * l);
            if (eq == __equations.length)
                eq = l - 1;
            //trace (t, eq, t * l - eq);
            return Number(__equations[eq](t * l - eq));
        };
        // Constants
        Easing.HALF_PI = Math.PI / 2;
        Easing.TWO_PI = Math.PI * 2;
        return Easing;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Easing;
});
// Create a global object with the class - only used in the single file version, replaced at build time
// #IFDEF ES5SINGLE // window["Easing"] = Easing;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zaXRpb25zL0Vhc2luZy50cyJdLCJuYW1lcyI6WyJFYXNpbmciLCJFYXNpbmcuY29uc3RydWN0b3IiLCJFYXNpbmcubm9uZSIsIkVhc2luZy5xdWFkSW4iLCJFYXNpbmcucXVhZE91dCIsIkVhc2luZy5xdWFkSW5PdXQiLCJFYXNpbmcuY3ViaWNJbiIsIkVhc2luZy5jdWJpY091dCIsIkVhc2luZy5jdWJpY0luT3V0IiwiRWFzaW5nLnF1YXJ0SW4iLCJFYXNpbmcucXVhcnRPdXQiLCJFYXNpbmcucXVhcnRJbk91dCIsIkVhc2luZy5xdWludEluIiwiRWFzaW5nLnF1aW50T3V0IiwiRWFzaW5nLnF1aW50SW5PdXQiLCJFYXNpbmcuc2luZUluIiwiRWFzaW5nLnNpbmVPdXQiLCJFYXNpbmcuc2luZUluT3V0IiwiRWFzaW5nLmV4cG9JbiIsIkVhc2luZy5leHBvT3V0IiwiRWFzaW5nLmV4cG9Jbk91dCIsIkVhc2luZy5jaXJjSW4iLCJFYXNpbmcuY2lyY091dCIsIkVhc2luZy5jaXJjSW5PdXQiLCJFYXNpbmcuZWxhc3RpY0luIiwiRWFzaW5nLmVsYXN0aWNPdXQiLCJFYXNpbmcuYmFja0luIiwiRWFzaW5nLmJhY2tPdXQiLCJFYXNpbmcuYmFja0luT3V0IiwiRWFzaW5nLmJvdW5jZUluIiwiRWFzaW5nLmJvdW5jZU91dCIsIkVhc2luZy5jb21iaW5lZCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUJFOztJQUVGOzs7O09BSUc7SUFFSDtRQUFBQTtRQXNUQUMsQ0FBQ0E7UUFoVEFELG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFbkhBOzs7OztXQUtHQTtRQUNJQSxXQUFJQSxHQUFYQSxVQUFZQSxDQUFRQTtZQUNuQkUsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDVkEsQ0FBQ0E7UUFFREY7Ozs7O1dBS0dBO1FBQ0lBLGFBQU1BLEdBQWJBLFVBQWNBLENBQVFBO1lBQ3JCRyxNQUFNQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFD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TUEsR0FBVUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFrVDVDQSxhQUFDQTtJQUFEQSxDQXRUQSxBQXNUQ0EsSUFBQTtJQXRURDs0QkFzVEMsQ0FBQTs7QUFFRCx1R0FBdUc7QUFDdkcsaURBQWlEIiwiZmlsZSI6InRyYW5zaXRpb25zL0Vhc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbkRpc2NsYWltZXIgZm9yIFJvYmVydCBQZW5uZXIncyBFYXNpbmcgRXF1YXRpb25zIGxpY2Vuc2U6XHJcblxyXG5URVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcblxyXG5PcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXHJcblxyXG5Db3B5cmlnaHQgwqkgMjAwMSBSb2JlcnQgUGVubmVyXHJcbkFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblxyXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcblxyXG5cdCogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG5cdCogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG5cdCogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuXHJcblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBhdXRob3IgWmVoIEZlcm5hbmRvXHJcbiAqIEJhc2VkIG9uIFJvYmVydCBQZW5uZXIncyBlYXNpbmcgZXF1YXRpb25zIC0gcmVtYWRlIGZyb20gVHdlZW5lcidzIGVxdWF0aW9ucywgYnV0IHNpbXBsaWZpZWRcclxuICogTm90IGZ1bGx5IHRlc3RlZCFcclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYXNpbmcge1xyXG5cclxuXHQvLyBDb25zdGFudHNcclxuXHRwcml2YXRlIHN0YXRpYyBIQUxGX1BJOm51bWJlciA9IE1hdGguUEkgLyAyO1xyXG5cdHByaXZhdGUgc3RhdGljIFRXT19QSTpudW1iZXIgPSBNYXRoLlBJICogMjtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEVRVUFUSU9OUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHNpbXBsZSBsaW5lYXIgdHdlZW5pbmcsIHdpdGggbm8gZWFzaW5nLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIG5vbmUodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBxdWFkcmF0aWMgKHReMikgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHF1YWRJbih0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiB0KnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVhZHJhdGljICh0XjIpIGVhc2luZyBvdXQ6IGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHF1YWRPdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gLXQgKiAodC0yKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBxdWFkcmF0aWMgKHReMikgZWFzaW5nIGluIGFuZCB0aGVuIG91dDogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eSwgdGhlbiBkZWNlbGVyYXRpbmcuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgcXVhZEluT3V0KHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0Ly9yZXR1cm4gdCA8IDAuNSA/IHF1YWRJbih0KjIpIDogcXVhZE91dCgodC0wLjUpKjIpO1xyXG5cdFx0cmV0dXJuICgodCAqPSAyKSA8IDEpID8gdCAqIHQgKiAwLjUgOiAtMC41ICogKC0tdCAqICh0LTIpIC0gMSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgY3ViaWMgKHReMykgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIGN1YmljSW4odDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdCp0KnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgY3ViaWMgKHReMykgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjdWJpY091dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiAodCA9IHQtMSkgKiB0ICogdCArIDE7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgY3ViaWNJbk91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiAodCAqPSAyKSA8IDEgPyBFYXNpbmcuY3ViaWNJbih0KS8yIDogRWFzaW5nLmN1YmljT3V0KHQtMSkvMiswLjU7IC8vIFRPRE86IHJlZG8gd2l0aCBpbi1saW5lIGNhbGN1bGF0aW9uXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVhcnRpYyAodF40KSBlYXNpbmcgaW46IGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgcXVhcnRJbih0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiB0KnQqdCp0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHF1YXJ0aWMgKHReNCkgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBxdWFydE91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHQtLTtcclxuXHRcdHJldHVybiAtMSAqICh0ICogdCAqIHQgKiB0IC0gMSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcXVhcnRJbk91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiAodCAqPSAyKSA8IDEgPyBFYXNpbmcucXVhcnRJbih0KS8yIDogRWFzaW5nLnF1YXJ0T3V0KHQtMSkvMiswLjU7IC8vIFRPRE86IHJlZG8gd2l0aCBpbi1saW5lIGNhbGN1bGF0aW9uXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVpbnRpYyAodF41KSBlYXNpbmcgaW46IGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgcXVpbnRJbih0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiB0KnQqdCp0KnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVpbnRpYyAodF41KSBlYXNpbmcgb3V0OiBkZWNlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHF1aW50T3V0KHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0dC0tO1xyXG5cdFx0cmV0dXJuIHQqdCp0KnQqdCArIDE7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgcXVpbnRJbk91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiAodCAqPSAyKSA8IDEgPyBFYXNpbmcucXVpbnRJbih0KS8yIDogRWFzaW5nLnF1aW50T3V0KHQtMSkvMiswLjU7IC8vIFRPRE86IHJlZG8gd2l0aCBpbi1saW5lIGNhbGN1bGF0aW9uXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgc2ludXNvaWRhbCAoc2luKHQpKSBlYXNpbmcgaW46IGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgc2luZUluKHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIC0xICogTWF0aC5jb3ModCAqIEVhc2luZy5IQUxGX1BJKSArIDE7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgc2ludXNvaWRhbCAoc2luKHQpKSBlYXNpbmcgb3V0OiBkZWNlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHNpbmVPdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gTWF0aC5zaW4odCAqIEVhc2luZy5IQUxGX1BJKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBzaW5lSW5PdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgKj0gMikgPCAxID8gRWFzaW5nLnNpbmVJbih0KS8yIDogRWFzaW5nLnNpbmVPdXQodC0xKS8yKzAuNTsgLy8gVE9ETzogcmVkbyB3aXRoIGluLWxpbmUgY2FsY3VsYXRpb25cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYW4gZXhwb25lbnRpYWwgKDJedCkgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIGV4cG9Jbih0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdC8vIHJldHVybiAodD09MCkgPyBiIDogYyAqIE1hdGgucG93KDIsIDEwICogKHQvZCAtIDEpKSArIGI7IC8vIG9yaWdpbmFsXHJcblx0XHRyZXR1cm4gKHQ9PTApID8gMCA6IE1hdGgucG93KDIsIDEwICogKHQgLSAxKSkgLSAwLjAwMTsgLy8genR3ZWVuIGZpeGVkXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGFuIGV4cG9uZW50aWFsICgyXnQpIGVhc2luZyBvdXQ6IGRlY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgZXhwb091dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdC8vIHJldHVybiAodD09ZCkgPyBiK2MgOiBjICogKC1NYXRoLnBvdygyLCAtMTAgKiB0L2QpICsgMSkgKyBiOyAvLyBvcmlnaW5hbFxyXG5cdFx0Ly8gcmV0dXJuICh0PT0xKSA/IDEgOiAoLU1hdGgucG93KDIsIC0xMCAqIHQpICsgMSk7IC8vIHp0d2VlblxyXG5cdFx0Ly8gcmV0dXJuICh0ID09IGQpID8gYiArIGMgOiBjICogMS4wMDEgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQgLyBkKSArIDEpICsgYjsgLy8gdHdlZW5lciBmaXhlZFxyXG5cdFx0Ly9sb2coXCI+XCIsIHQsICh0PT0xKSA/IDEgOiAxLjAwMSAqICgtTWF0aC5wb3coMiwgLTEwICogdCkgKyAxKSlcclxuXHRcdC8vcmV0dXJuICh0PT0xKSA/IDEgOiAxLjAwMSAqICgtTWF0aC5wb3coMiwgLTEwICogdCkgKyAxKTsgLy8genR3ZWVuIGZpeGVkXHJcblx0XHRyZXR1cm4gKHQ+PTAuOTk5KSA/IDEgOiAxLjAwMSAqICgtTWF0aC5wb3coMiwgLTEwICogdCkgKyAxKTsgLy8genR3ZWVuIGZpeGVkIDJcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBleHBvSW5PdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgKj0gMikgPCAxID8gRWFzaW5nLmV4cG9Jbih0KS8yIDogRWFzaW5nLmV4cG9PdXQodC0xKS8yKzAuNTsgLy8gVE9ETzogcmVkbyB3aXRoIGluLWxpbmUgY2FsY3VsYXRpb25cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBjaXJjdWxhciAoc3FydCgxLXReMikpIGVhc2luZyBpbjogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaXJjSW4odDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gLTEgKiAoTWF0aC5zcXJ0KDEgLSB0KnQpIC0gMSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgY2lyY3VsYXIgKHNxcnQoMS10XjIpKSBlYXNpbmcgb3V0OiBkZWNlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIGNpcmNPdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHR0LS07XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KDEgLSB0KnQpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGNpcmNJbk91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiAodCAqPSAyKSA8IDEgPyBFYXNpbmcuY2lyY0luKHQpLzIgOiBFYXNpbmcuY2lyY091dCh0LTEpLzIrMC41OyAvLyBUT0RPOiByZWRvIHdpdGggaW4tbGluZSBjYWxjdWxhdGlvblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhbiBlbGFzdGljIChleHBvbmVudGlhbGx5IGRlY2F5aW5nIHNpbmUgd2F2ZSkgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEBwYXJhbVx0YVx0XHRcdEFtcGxpdHVkZS5cclxuXHQgKiBAcGFyYW1cdHBcdFx0XHRQZXJpb2QuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgZWxhc3RpY0luKHQ6bnVtYmVyLCBhOm51bWJlciA9IDAsIHA6bnVtYmVyID0gMC4zKTpudW1iZXIge1xyXG5cdFx0aWYgKHQ9PTApIHJldHVybiAwO1xyXG5cdFx0aWYgKHQ9PTEpIHJldHVybiAxO1xyXG5cdFx0dmFyIHM6bnVtYmVyO1xyXG5cdFx0aWYgKGEgPCAxKSB7XHJcblx0XHRcdGEgPSAxO1xyXG5cdFx0XHRzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzID0gcCAvIEVhc2luZy5UV09fUEkgKiBNYXRoLmFzaW4oMSAvIGEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgLSBzKSAqIEVhc2luZy5UV09fUEkgLyBwKSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGFuIGVsYXN0aWMgKGV4cG9uZW50aWFsbHkgZGVjYXlpbmcgc2luZSB3YXZlKSBlYXNpbmcgb3V0OiBkZWNlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEBwYXJhbVx0YVx0XHRcdEFtcGxpdHVkZS5cclxuXHQgKiBAcGFyYW1cdHBcdFx0XHRQZXJpb2QuXHJcblx0ICovXHJcblx0c3RhdGljIGVsYXN0aWNPdXQodDpudW1iZXIsIGE6bnVtYmVyID0gMCwgcDpudW1iZXIgPSAwLjMpOm51bWJlciB7XHJcblx0XHRpZiAodD09MCkgcmV0dXJuIDA7XHJcblx0XHRpZiAodD09MSkgcmV0dXJuIDE7XHJcblx0XHR2YXIgczpudW1iZXI7XHJcblx0XHRpZiAoYSA8IDEpIHtcclxuXHRcdFx0YSA9IDE7XHJcblx0XHRcdHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHMgPSBwIC8gRWFzaW5nLlRXT19QSSAqIE1hdGguYXNpbigxIC8gYSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0IC0gcykgKiBFYXNpbmcuVFdPX1BJIC8gcCApICsgMSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgYmFjayAob3ZlcnNob290aW5nIGN1YmljIGVhc2luZzogKHMrMSkqdF4zIC0gcyp0XjIpIGVhc2luZyBpbjogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcGFyYW1cdHNcdFx0XHRPdmVyc2hvb3QgYW1tb3VudDogaGlnaGVyIHMgbWVhbnMgZ3JlYXRlciBvdmVyc2hvb3QgKDAgcHJvZHVjZXMgY3ViaWMgZWFzaW5nIHdpdGggbm8gb3ZlcnNob290LCBhbmQgdGhlIGRlZmF1bHQgdmFsdWUgb2YgMS43MDE1OCBwcm9kdWNlcyBhbiBvdmVyc2hvb3Qgb2YgMTAgcGVyY2VudCkuXHJcblx0ICogQHBhcmFtXHRwXHRcdFx0UGVyaW9kLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBiYWNrSW4odDpudW1iZXIsIHM6bnVtYmVyID0gMS43MDE1OCk6bnVtYmVyIHtcclxuXHRcdHJldHVybiB0KnQqKChzKzEpKnQgLSBzKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBiYWNrIChvdmVyc2hvb3RpbmcgY3ViaWMgZWFzaW5nOiAocysxKSp0XjMgLSBzKnReMikgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcGFyYW1cdHNcdFx0XHRPdmVyc2hvb3QgYW1tb3VudDogaGlnaGVyIHMgbWVhbnMgZ3JlYXRlciBvdmVyc2hvb3QgKDAgcHJvZHVjZXMgY3ViaWMgZWFzaW5nIHdpdGggbm8gb3ZlcnNob290LCBhbmQgdGhlIGRlZmF1bHQgdmFsdWUgb2YgMS43MDE1OCBwcm9kdWNlcyBhbiBvdmVyc2hvb3Qgb2YgMTAgcGVyY2VudCkuXHJcblx0ICogQHBhcmFtXHRwXHRcdFx0UGVyaW9kLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBiYWNrT3V0KHQ6bnVtYmVyLCBzOm51bWJlciA9IDEuNzAxNTgpOm51bWJlciB7XHJcblx0XHR0LS07XHJcblx0XHRyZXR1cm4gdCp0KigocysxKSp0ICsgcykgKyAxO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGJhY2tJbk91dCh0Om51bWJlcik6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgKj0gMikgPCAxID8gRWFzaW5nLmJhY2tJbih0KS8yIDogRWFzaW5nLmJhY2tPdXQodC0xKS8yKzAuNTsgLy8gVE9ETzogcmVkbyB3aXRoIGluLWxpbmUgY2FsY3VsYXRpb25cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBib3VuY2UgKGV4cG9uZW50aWFsbHkgZGVjYXlpbmcgcGFyYWJvbGljIGJvdW5jZSkgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEBwYXJhbVx0cFx0XHRcdFBlcmlvZC5cclxuXHQgKi9cclxuXHRzdGF0aWMgYm91bmNlSW4odDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gMSAtIEVhc2luZy5ib3VuY2VPdXQoMS10KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBib3VuY2UgKGV4cG9uZW50aWFsbHkgZGVjYXlpbmcgcGFyYWJvbGljIGJvdW5jZSkgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcGFyYW1cdHBcdFx0XHRQZXJpb2QuXHJcblx0ICovXHJcblx0c3RhdGljIGJvdW5jZU91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdGlmICh0IDwgKDEvMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuIDcuNTYyNSp0KnQ7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAoMi8yLjc1KSkge1xyXG5cdFx0XHRyZXR1cm4gNy41NjI1Kih0LT0oMS41LzIuNzUpKSp0ICsgLjc1O1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgKDIuNS8yLjc1KSkge1xyXG5cdFx0XHRyZXR1cm4gNy41NjI1Kih0LT0oMi4yNS8yLjc1KSkqdCArIC45Mzc1O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIDcuNTYyNSoodC09KDIuNjI1LzIuNzUpKSp0ICsgLjk4NDM3NTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09NQklOQVRPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRzdGF0aWMgY29tYmluZWQodDpudW1iZXIsIF9fZXF1YXRpb25zOmFueVtdKTpudW1iZXIge1xyXG5cdFx0dmFyIGw6bnVtYmVyID0gX19lcXVhdGlvbnMubGVuZ3RoO1xyXG5cdFx0dmFyIGVxOm51bWJlciA9IE1hdGguZmxvb3IodCAqIGwpO1xyXG5cdFx0aWYgKGVxID09IF9fZXF1YXRpb25zLmxlbmd0aCkgZXEgPSBsIC0gMTtcclxuXHRcdC8vdHJhY2UgKHQsIGVxLCB0ICogbCAtIGVxKTtcclxuXHRcdHJldHVybiBOdW1iZXIoX19lcXVhdGlvbnNbZXFdKHQgKiBsIC0gZXEpKTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIENyZWF0ZSBhIGdsb2JhbCBvYmplY3Qgd2l0aCB0aGUgY2xhc3MgLSBvbmx5IHVzZWQgaW4gdGhlIHNpbmdsZSBmaWxlIHZlcnNpb24sIHJlcGxhY2VkIGF0IGJ1aWxkIHRpbWVcclxuLy8gI0lGREVGIEVTNVNJTkdMRSAvLyB3aW5kb3dbXCJFYXNpbmdcIl0gPSBFYXNpbmc7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==