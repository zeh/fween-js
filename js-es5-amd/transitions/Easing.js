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
    exports.default = Easing;
});
// Create a global object with the class - only used in the single file version, replaced at build time
// #IFDEF ES5SINGLE // window["Easing"] = Easing;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zaXRpb25zL0Vhc2luZy50cyJdLCJuYW1lcyI6WyJFYXNpbmciLCJFYXNpbmcuY29uc3RydWN0b3IiLCJFYXNpbmcubm9uZSIsIkVhc2luZy5xdWFkSW4iLCJFYXNpbmcucXVhZE91dCIsIkVhc2luZy5xdWFkSW5PdXQiLCJFYXNpbmcuY3ViaWNJbiIsIkVhc2luZy5jdWJpY091dCIsIkVhc2luZy5jdWJpY0luT3V0IiwiRWFzaW5nLnF1YXJ0SW4iLCJFYXNpbmcucXVhcnRPdXQiLCJFYXNpbmcucXVhcnRJbk91dCIsIkVhc2luZy5xdWludEluIiwiRWFzaW5nLnF1aW50T3V0IiwiRWFzaW5nLnF1aW50SW5PdXQiLCJFYXNpbmcuc2luZUluIiwiRWFzaW5nLnNpbmVPdXQiLCJFYXNpbmcuc2luZUluT3V0IiwiRWFzaW5nLmV4cG9JbiIsIkVhc2luZy5leHBvT3V0IiwiRWFzaW5nLmV4cG9Jbk91dCIsIkVhc2luZy5jaXJjSW4iLCJFYXNpbmcuY2lyY091dCIsIkVhc2luZy5jaXJjSW5PdXQiLCJFYXNpbmcuZWxhc3RpY0luIiwiRWFzaW5nLmVsYXN0aWNPdXQiLCJFYXNpbmcuYmFja0luIiwiRWFzaW5nLmJhY2tPdXQiLCJFYXNpbmcuYmFja0luT3V0IiwiRWFzaW5nLmJvdW5jZUluIiwiRWFzaW5nLmJvdW5jZU91dCIsIkVhc2luZy5jb21iaW5lZCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUJFOztJQUVGLEFBTUE7Ozs7T0FGRzs7UUFFSEE7UUFzVEFDLENBQUNBO1FBaFRBRCxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRW5IQTs7Ozs7V0FLR0E7UUFDSUEsV0FBSUEsR0FBWEEsVUFBWUEsQ0FBUUE7WUFDbkJFLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1FBQ1ZBLENBQUNBO1FBRURGOzs7OztXQUtHQTtRQUNJQSxhQUFNQSxHQUFiQSxVQUFjQSxDQUFRQTtZQUNyQkcsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FB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SUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDN0JBLGFBQU1BLEdBQVVBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1FBa1Q1Q0EsYUFBQ0E7SUFBREEsQ0F0VEEsQUFzVENBLElBQUE7SUF0VEQsd0JBc1RDLENBQUE7O0FBRUQsdUdBQXVHO0FBQ3ZHLGlEQUFpRCIsImZpbGUiOiJ0cmFuc2l0aW9ucy9FYXNpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5EaXNjbGFpbWVyIGZvciBSb2JlcnQgUGVubmVyJ3MgRWFzaW5nIEVxdWF0aW9ucyBsaWNlbnNlOlxyXG5cclxuVEVSTVMgT0YgVVNFIC0gRUFTSU5HIEVRVUFUSU9OU1xyXG5cclxuT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxyXG5cclxuQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG5BbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cclxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG5cclxuXHQqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuXHQqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuXHQqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcblxyXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAYXV0aG9yIFplaCBGZXJuYW5kb1xyXG4gKiBCYXNlZCBvbiBSb2JlcnQgUGVubmVyJ3MgZWFzaW5nIGVxdWF0aW9ucyAtIHJlbWFkZSBmcm9tIFR3ZWVuZXIncyBlcXVhdGlvbnMsIGJ1dCBzaW1wbGlmaWVkXHJcbiAqIE5vdCBmdWxseSB0ZXN0ZWQhXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFzaW5nIHtcclxuXHJcblx0Ly8gQ29uc3RhbnRzXHJcblx0cHJpdmF0ZSBzdGF0aWMgSEFMRl9QSTpudW1iZXIgPSBNYXRoLlBJIC8gMjtcclxuXHRwcml2YXRlIHN0YXRpYyBUV09fUEk6bnVtYmVyID0gTWF0aC5QSSAqIDI7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBFUVVBVElPTlMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBzaW1wbGUgbGluZWFyIHR3ZWVuaW5nLCB3aXRoIG5vIGVhc2luZy5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBub25lKHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIHQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVhZHJhdGljICh0XjIpIGVhc2luZyBpbjogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBxdWFkSW4odDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdCp0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHF1YWRyYXRpYyAodF4yKSBlYXNpbmcgb3V0OiBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBxdWFkT3V0KHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIC10ICogKHQtMik7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVhZHJhdGljICh0XjIpIGVhc2luZyBpbiBhbmQgdGhlbiBvdXQ6IGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHksIHRoZW4gZGVjZWxlcmF0aW5nLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHF1YWRJbk91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdC8vcmV0dXJuIHQgPCAwLjUgPyBxdWFkSW4odCoyKSA6IHF1YWRPdXQoKHQtMC41KSoyKTtcclxuXHRcdHJldHVybiAoKHQgKj0gMikgPCAxKSA/IHQgKiB0ICogMC41IDogLTAuNSAqICgtLXQgKiAodC0yKSAtIDEpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIGN1YmljICh0XjMpIGVhc2luZyBpbjogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjdWJpY0luKHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIHQqdCp0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIGN1YmljICh0XjMpIGVhc2luZyBvdXQ6IGRlY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgY3ViaWNPdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgPSB0LTEpICogdCAqIHQgKyAxO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGN1YmljSW5PdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgKj0gMikgPCAxID8gRWFzaW5nLmN1YmljSW4odCkvMiA6IEVhc2luZy5jdWJpY091dCh0LTEpLzIrMC41OyAvLyBUT0RPOiByZWRvIHdpdGggaW4tbGluZSBjYWxjdWxhdGlvblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHF1YXJ0aWMgKHReNCkgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHF1YXJ0SW4odDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdCp0KnQqdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBxdWFydGljICh0XjQpIGVhc2luZyBvdXQ6IGRlY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgcXVhcnRPdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHR0LS07XHJcblx0XHRyZXR1cm4gLTEgKiAodCAqIHQgKiB0ICogdCAtIDEpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIHF1YXJ0SW5PdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgKj0gMikgPCAxID8gRWFzaW5nLnF1YXJ0SW4odCkvMiA6IEVhc2luZy5xdWFydE91dCh0LTEpLzIrMC41OyAvLyBUT0RPOiByZWRvIHdpdGggaW4tbGluZSBjYWxjdWxhdGlvblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHF1aW50aWMgKHReNSkgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHF1aW50SW4odDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdCp0KnQqdCp0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHF1aW50aWMgKHReNSkgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBxdWludE91dCh0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHQtLTtcclxuXHRcdHJldHVybiB0KnQqdCp0KnQgKyAxO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIHF1aW50SW5PdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgKj0gMikgPCAxID8gRWFzaW5nLnF1aW50SW4odCkvMiA6IEVhc2luZy5xdWludE91dCh0LTEpLzIrMC41OyAvLyBUT0RPOiByZWRvIHdpdGggaW4tbGluZSBjYWxjdWxhdGlvblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHNpbnVzb2lkYWwgKHNpbih0KSkgZWFzaW5nIGluOiBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIHNpbmVJbih0Om51bWJlcik6bnVtYmVyIHtcclxuXHRcdHJldHVybiAtMSAqIE1hdGguY29zKHQgKiBFYXNpbmcuSEFMRl9QSSkgKyAxO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHNpbnVzb2lkYWwgKHNpbih0KSkgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBzaW5lT3V0KHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIE1hdGguc2luKHQgKiBFYXNpbmcuSEFMRl9QSSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgc2luZUluT3V0KHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuICh0ICo9IDIpIDwgMSA/IEVhc2luZy5zaW5lSW4odCkvMiA6IEVhc2luZy5zaW5lT3V0KHQtMSkvMiswLjU7IC8vIFRPRE86IHJlZG8gd2l0aCBpbi1saW5lIGNhbGN1bGF0aW9uXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGFuIGV4cG9uZW50aWFsICgyXnQpIGVhc2luZyBpbjogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBleHBvSW4odDpudW1iZXIpOm51bWJlciB7XHJcblx0XHQvLyByZXR1cm4gKHQ9PTApID8gYiA6IGMgKiBNYXRoLnBvdygyLCAxMCAqICh0L2QgLSAxKSkgKyBiOyAvLyBvcmlnaW5hbFxyXG5cdFx0cmV0dXJuICh0PT0wKSA/IDAgOiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpIC0gMC4wMDE7IC8vIHp0d2VlbiBmaXhlZFxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhbiBleHBvbmVudGlhbCAoMl50KSBlYXNpbmcgb3V0OiBkZWNlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtXHR0XHRcdFx0Q3VycmVudCB0aW1lL3BoYXNlICgwLTEpLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIGV4cG9PdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHQvLyByZXR1cm4gKHQ9PWQpID8gYitjIDogYyAqICgtTWF0aC5wb3coMiwgLTEwICogdC9kKSArIDEpICsgYjsgLy8gb3JpZ2luYWxcclxuXHRcdC8vIHJldHVybiAodD09MSkgPyAxIDogKC1NYXRoLnBvdygyLCAtMTAgKiB0KSArIDEpOyAvLyB6dHdlZW5cclxuXHRcdC8vIHJldHVybiAodCA9PSBkKSA/IGIgKyBjIDogYyAqIDEuMDAxICogKC1NYXRoLnBvdygyLCAtMTAgKiB0IC8gZCkgKyAxKSArIGI7IC8vIHR3ZWVuZXIgZml4ZWRcclxuXHRcdC8vbG9nKFwiPlwiLCB0LCAodD09MSkgPyAxIDogMS4wMDEgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQpICsgMSkpXHJcblx0XHQvL3JldHVybiAodD09MSkgPyAxIDogMS4wMDEgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQpICsgMSk7IC8vIHp0d2VlbiBmaXhlZFxyXG5cdFx0cmV0dXJuICh0Pj0wLjk5OSkgPyAxIDogMS4wMDEgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQpICsgMSk7IC8vIHp0d2VlbiBmaXhlZCAyXHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZXhwb0luT3V0KHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuICh0ICo9IDIpIDwgMSA/IEVhc2luZy5leHBvSW4odCkvMiA6IEVhc2luZy5leHBvT3V0KHQtMSkvMiswLjU7IC8vIFRPRE86IHJlZG8gd2l0aCBpbi1saW5lIGNhbGN1bGF0aW9uXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgY2lyY3VsYXIgKHNxcnQoMS10XjIpKSBlYXNpbmcgaW46IGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHJldHVyblx0XHRcdFx0VGhlIG5ldyB2YWx1ZS9waGFzZSAoMC0xKS5cclxuXHQgKi9cclxuXHRzdGF0aWMgY2lyY0luKHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIC0xICogKE1hdGguc3FydCgxIC0gdCp0KSAtIDEpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIGNpcmN1bGFyIChzcXJ0KDEtdF4yKSkgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0XHRUaGUgbmV3IHZhbHVlL3BoYXNlICgwLTEpLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBjaXJjT3V0KHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0dC0tO1xyXG5cdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gdCp0KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjaXJjSW5PdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gKHQgKj0gMikgPCAxID8gRWFzaW5nLmNpcmNJbih0KS8yIDogRWFzaW5nLmNpcmNPdXQodC0xKS8yKzAuNTsgLy8gVE9ETzogcmVkbyB3aXRoIGluLWxpbmUgY2FsY3VsYXRpb25cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYW4gZWxhc3RpYyAoZXhwb25lbnRpYWxseSBkZWNheWluZyBzaW5lIHdhdmUpIGVhc2luZyBpbjogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcGFyYW1cdGFcdFx0XHRBbXBsaXR1ZGUuXHJcblx0ICogQHBhcmFtXHRwXHRcdFx0UGVyaW9kLlxyXG5cdCAqIEByZXR1cm5cdFx0XHRcdFRoZSBuZXcgdmFsdWUvcGhhc2UgKDAtMSkuXHJcblx0ICovXHJcblx0c3RhdGljIGVsYXN0aWNJbih0Om51bWJlciwgYTpudW1iZXIgPSAwLCBwOm51bWJlciA9IDAuMyk6bnVtYmVyIHtcclxuXHRcdGlmICh0PT0wKSByZXR1cm4gMDtcclxuXHRcdGlmICh0PT0xKSByZXR1cm4gMTtcclxuXHRcdHZhciBzOm51bWJlcjtcclxuXHRcdGlmIChhIDwgMSkge1xyXG5cdFx0XHRhID0gMTtcclxuXHRcdFx0cyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cyA9IHAgLyBFYXNpbmcuVFdPX1BJICogTWF0aC5hc2luKDEgLyBhKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0IC0gcykgKiBFYXNpbmcuVFdPX1BJIC8gcCkpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhbiBlbGFzdGljIChleHBvbmVudGlhbGx5IGRlY2F5aW5nIHNpbmUgd2F2ZSkgZWFzaW5nIG91dDogZGVjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcGFyYW1cdGFcdFx0XHRBbXBsaXR1ZGUuXHJcblx0ICogQHBhcmFtXHRwXHRcdFx0UGVyaW9kLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBlbGFzdGljT3V0KHQ6bnVtYmVyLCBhOm51bWJlciA9IDAsIHA6bnVtYmVyID0gMC4zKTpudW1iZXIge1xyXG5cdFx0aWYgKHQ9PTApIHJldHVybiAwO1xyXG5cdFx0aWYgKHQ9PTEpIHJldHVybiAxO1xyXG5cdFx0dmFyIHM6bnVtYmVyO1xyXG5cdFx0aWYgKGEgPCAxKSB7XHJcblx0XHRcdGEgPSAxO1xyXG5cdFx0XHRzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzID0gcCAvIEVhc2luZy5UV09fUEkgKiBNYXRoLmFzaW4oMSAvIGEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIChhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAtIHMpICogRWFzaW5nLlRXT19QSSAvIHAgKSArIDEpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIGJhY2sgKG92ZXJzaG9vdGluZyBjdWJpYyBlYXNpbmc6IChzKzEpKnReMyAtIHMqdF4yKSBlYXNpbmcgaW46IGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHBhcmFtXHRzXHRcdFx0T3ZlcnNob290IGFtbW91bnQ6IGhpZ2hlciBzIG1lYW5zIGdyZWF0ZXIgb3ZlcnNob290ICgwIHByb2R1Y2VzIGN1YmljIGVhc2luZyB3aXRoIG5vIG92ZXJzaG9vdCwgYW5kIHRoZSBkZWZhdWx0IHZhbHVlIG9mIDEuNzAxNTggcHJvZHVjZXMgYW4gb3ZlcnNob290IG9mIDEwIHBlcmNlbnQpLlxyXG5cdCAqIEBwYXJhbVx0cFx0XHRcdFBlcmlvZC5cclxuXHQgKi9cclxuXHRzdGF0aWMgYmFja0luKHQ6bnVtYmVyLCBzOm51bWJlciA9IDEuNzAxNTgpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdCp0KigocysxKSp0IC0gcyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgYmFjayAob3ZlcnNob290aW5nIGN1YmljIGVhc2luZzogKHMrMSkqdF4zIC0gcyp0XjIpIGVhc2luZyBvdXQ6IGRlY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHBhcmFtXHRzXHRcdFx0T3ZlcnNob290IGFtbW91bnQ6IGhpZ2hlciBzIG1lYW5zIGdyZWF0ZXIgb3ZlcnNob290ICgwIHByb2R1Y2VzIGN1YmljIGVhc2luZyB3aXRoIG5vIG92ZXJzaG9vdCwgYW5kIHRoZSBkZWZhdWx0IHZhbHVlIG9mIDEuNzAxNTggcHJvZHVjZXMgYW4gb3ZlcnNob290IG9mIDEwIHBlcmNlbnQpLlxyXG5cdCAqIEBwYXJhbVx0cFx0XHRcdFBlcmlvZC5cclxuXHQgKi9cclxuXHRzdGF0aWMgYmFja091dCh0Om51bWJlciwgczpudW1iZXIgPSAxLjcwMTU4KTpudW1iZXIge1xyXG5cdFx0dC0tO1xyXG5cdFx0cmV0dXJuIHQqdCooKHMrMSkqdCArIHMpICsgMTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBiYWNrSW5PdXQodDpudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuICh0ICo9IDIpIDwgMSA/IEVhc2luZy5iYWNrSW4odCkvMiA6IEVhc2luZy5iYWNrT3V0KHQtMSkvMiswLjU7IC8vIFRPRE86IHJlZG8gd2l0aCBpbi1saW5lIGNhbGN1bGF0aW9uXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgYm91bmNlIChleHBvbmVudGlhbGx5IGRlY2F5aW5nIHBhcmFib2xpYyBib3VuY2UpIGVhc2luZyBpbjogYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbVx0dFx0XHRcdEN1cnJlbnQgdGltZS9waGFzZSAoMC0xKS5cclxuXHQgKiBAcGFyYW1cdHBcdFx0XHRQZXJpb2QuXHJcblx0ICovXHJcblx0c3RhdGljIGJvdW5jZUluKHQ6bnVtYmVyKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIDEgLSBFYXNpbmcuYm91bmNlT3V0KDEtdCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBFYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgYm91bmNlIChleHBvbmVudGlhbGx5IGRlY2F5aW5nIHBhcmFib2xpYyBib3VuY2UpIGVhc2luZyBvdXQ6IGRlY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHkuXHJcblx0ICpcclxuXHQgKiBAcGFyYW1cdHRcdFx0XHRDdXJyZW50IHRpbWUvcGhhc2UgKDAtMSkuXHJcblx0ICogQHBhcmFtXHRwXHRcdFx0UGVyaW9kLlxyXG5cdCAqL1xyXG5cdHN0YXRpYyBib3VuY2VPdXQodDpudW1iZXIpOm51bWJlciB7XHJcblx0XHRpZiAodCA8ICgxLzIuNzUpKSB7XHJcblx0XHRcdHJldHVybiA3LjU2MjUqdCp0O1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgKDIvMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuIDcuNTYyNSoodC09KDEuNS8yLjc1KSkqdCArIC43NTtcclxuXHRcdH0gZWxzZSBpZiAodCA8ICgyLjUvMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuIDcuNTYyNSoodC09KDIuMjUvMi43NSkpKnQgKyAuOTM3NTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiA3LjU2MjUqKHQtPSgyLjYyNS8yLjc1KSkqdCArIC45ODQzNzU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTUJJTkFUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0c3RhdGljIGNvbWJpbmVkKHQ6bnVtYmVyLCBfX2VxdWF0aW9uczphbnlbXSk6bnVtYmVyIHtcclxuXHRcdHZhciBsOm51bWJlciA9IF9fZXF1YXRpb25zLmxlbmd0aDtcclxuXHRcdHZhciBlcTpudW1iZXIgPSBNYXRoLmZsb29yKHQgKiBsKTtcclxuXHRcdGlmIChlcSA9PSBfX2VxdWF0aW9ucy5sZW5ndGgpIGVxID0gbCAtIDE7XHJcblx0XHQvL3RyYWNlICh0LCBlcSwgdCAqIGwgLSBlcSk7XHJcblx0XHRyZXR1cm4gTnVtYmVyKF9fZXF1YXRpb25zW2VxXSh0ICogbCAtIGVxKSk7XHJcblx0fVxyXG59XHJcblxyXG4vLyBDcmVhdGUgYSBnbG9iYWwgb2JqZWN0IHdpdGggdGhlIGNsYXNzIC0gb25seSB1c2VkIGluIHRoZSBzaW5nbGUgZmlsZSB2ZXJzaW9uLCByZXBsYWNlZCBhdCBidWlsZCB0aW1lXHJcbi8vICNJRkRFRiBFUzVTSU5HTEUgLy8gd2luZG93W1wiRWFzaW5nXCJdID0gRWFzaW5nO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=