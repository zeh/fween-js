(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
// Create a global object with the class - only used in the single file version, replaced at build time
window["Easing"] = Easing;
},{}],2:[function(require,module,exports){
/**
 * @author	Zeh Fernando
 * @version	1.0
 * @since	2015-08-03
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Easing_1 = require('./Easing');
var MathUtils_1 = require('./../utils/MathUtils');
/*
 Ideas for tweening - from https://github.com/zeh/unity-tidbits/blob/master/transitions/ZTween.cs

 ZTween.use(obj)
 .to(o, t, transition)
 .call(f)
 .wait(t)
 .use(getter, setter?)
 */
// TODO: this library has .time, .duration, and .getDuration(). Make your mind!
// https://github.com/zeh/unity-tidbits/blob/master/transitions/ZTween.cs
var Fween = (function () {
    function Fween() {
    }
    Fween.use = function (object1, object2) {
        if (typeof (object1) == "object") {
            // Object
            return new FweenObjectSequence(object1);
        }
        else if (typeof (object1) == "function" && typeof (object2) == "function") {
            // Getter/setter
            return new FweenGetterSetterSequence(object1, object2);
        }
        console.error("Tweening parameters were not understood.");
        return null;
    };
    Fween.getTicker = function () {
        if (!this.ticker)
            this.ticker = new FweenTicker();
        return this.ticker;
    };
    // Main class - just a starting point
    Fween.ticker = null;
    return Fween;
})();
exports.default = Fween;
// Create a global object with the class - only used in the single file version, replaced at build time
window["Fween"] = Fween;
// ================================================================================================================
// INTERNAL CLASSES -----------------------------------------------------------------------------------------------
// Aux classes
var FweenStepMetadata = (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function FweenStepMetadata() {
        // Class to maintain metadata related to each step of a Fween sequence
        // Properties
        this.hasStarted = false;
        this.hasCompleted = false;
        this.timeStart = 0.0;
        this.timeEnd = 0;
    }
    Object.defineProperty(FweenStepMetadata.prototype, "timeDuration", {
        // ================================================================================================================
        // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
        get: function () {
            return this.timeEnd - this.timeStart;
        },
        enumerable: true,
        configurable: true
    });
    return FweenStepMetadata;
})();
var FweenSequence = (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function FweenSequence() {
        // One sequence of steps
        // Properties
        this.steps = [];
        this.stepsMetadatas = [];
        this.isPlaying = false;
        this.currentStep = 0;
        this.startTime = 0.0;
        this.pauseTime = 0.0;
        this.executedTime = 0.0;
        this.duration = 0.0;
        // Create a new Fween
        this.startTime = Fween.getTicker().getTime();
        // Add to list
        Fween.getTicker().add(this);
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    // Play control methods
    /**
     * Play (or resume) the sequence
     */
    FweenSequence.prototype.play = function () {
        if (!this.isPlaying) {
            this.isPlaying = true;
            var timePaused = Fween.getTicker().getTime() - this.pauseTime;
            this.startTime += timePaused;
        }
        return this;
    };
    /**
     * Pause the sequence
     */
    FweenSequence.prototype.pause = function () {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.pauseTime = Fween.getTicker().getTime();
        }
        return this;
    };
    // Utility methods
    /**
     * Call a function
     */
    FweenSequence.prototype.call = function (func) {
        this.addStep(new FweenStepCall(func));
        return this;
    };
    /**
     * Wait a number of seconds
     */
    FweenSequence.prototype.wait = function (duration) {
        this.duration += this.duration;
        return this;
    };
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    // Core tween step control methods; reused by subclasses
    FweenSequence.prototype.addStep = function (step) {
        this.steps.push(step);
        var tweenMetadata = new FweenStepMetadata();
        tweenMetadata.timeStart = this.startTime + this.duration;
        this.duration += step.getDuration();
        tweenMetadata.timeEnd = this.startTime + this.duration;
        this.stepsMetadatas.push(tweenMetadata);
    };
    FweenSequence.prototype.update = function () {
        // Update current step(s) based on the time
        // Check if finished
        if (this.currentStep >= this.steps.length) {
            this.destroy();
        }
        else {
            var shouldUpdateOnce = this.isPlaying;
            while (shouldUpdateOnce && this.currentStep < this.steps.length) {
                shouldUpdateOnce = false;
                if (Fween.getTicker().getTime() >= this.stepsMetadatas[this.currentStep].timeStart) {
                    // Start the current tween step if necessary
                    if (!this.stepsMetadatas[this.currentStep].hasStarted) {
                        this.steps[this.currentStep].start();
                        this.stepsMetadatas[this.currentStep].hasStarted = true;
                    }
                    // Update the current tween step
                    this.steps[this.currentStep].update(MathUtils_1.default.map(Fween.getTicker().getTime(), this.stepsMetadatas[this.currentStep].timeStart, this.stepsMetadatas[this.currentStep].timeEnd, 0, 1, true));
                    // Check if it's finished
                    if (Fween.getTicker().getTime() >= this.stepsMetadatas[this.currentStep].timeEnd) {
                        if (!this.stepsMetadatas[this.currentStep].hasCompleted) {
                            this.steps[this.currentStep].end();
                            this.stepsMetadatas[this.currentStep].hasCompleted = true;
                            this.executedTime += this.stepsMetadatas[this.currentStep].timeDuration;
                            shouldUpdateOnce = true;
                            this.currentStep++;
                        }
                    }
                }
            }
        }
    };
    FweenSequence.prototype.getTransition = function (transition) {
        return transition == null ? Easing_1.default.none : transition;
    };
    FweenSequence.prototype.destroy = function () {
        Fween.getTicker().remove(this);
    };
    return FweenSequence;
})();
exports.FweenSequence = FweenSequence;
var FweenGetterSetterSequence = (function (_super) {
    __extends(FweenGetterSetterSequence, _super);
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function FweenGetterSetterSequence(targetGet, targetSet) {
        _super.call(this);
        this.targetGet = targetGet;
        this.targetSet = targetSet;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    FweenGetterSetterSequence.prototype.from = function (value) {
        this.addStep(new FweenStepValueFrom(this.targetSet, value));
        return this;
    };
    FweenGetterSetterSequence.prototype.to = function (value, duration, transition) {
        if (duration === void 0) { duration = 0; }
        if (transition === void 0) { transition = null; }
        this.addStep(new FweenStepValueTo(this.targetGet, this.targetSet, value, duration, this.getTransition(transition)));
        return this;
    };
    return FweenGetterSetterSequence;
})(FweenSequence);
var FweenObjectSequence = (function (_super) {
    __extends(FweenObjectSequence, _super);
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function FweenObjectSequence(object) {
        _super.call(this);
        this.targetObject = object;
    }
    return FweenObjectSequence;
})(FweenSequence);
// Common steps
var FweenStepCall = (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function FweenStepCall(func) {
        this.action = func;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    FweenStepCall.prototype.start = function () { };
    FweenStepCall.prototype.update = function (t) { };
    FweenStepCall.prototype.end = function () {
        this.action();
    };
    FweenStepCall.prototype.getDuration = function () {
        return 0;
    };
    return FweenStepCall;
})();
// Steps for specific sequences: GetterSetter
var FweenStepValueFrom = (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function FweenStepValueFrom(targetSet, targetValue) {
        this.targetSet = targetSet;
        this.targetValue = targetValue;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    FweenStepValueFrom.prototype.start = function () { };
    FweenStepValueFrom.prototype.update = function (t) { };
    FweenStepValueFrom.prototype.end = function () {
        this.targetSet(this.targetValue);
    };
    FweenStepValueFrom.prototype.getDuration = function () {
        return 0;
    };
    return FweenStepValueFrom;
})();
var FweenStepValueTo = (function () {
    function FweenStepValueTo(targetGet, targetSet, targetValue, duration, transition) {
        this.targetGet = targetGet;
        this.targetSet = targetSet;
        this.duration = duration;
        this.targetValue = targetValue;
        this.transition = transition;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    FweenStepValueTo.prototype.start = function () {
        this.startValue = this.targetGet();
    };
    FweenStepValueTo.prototype.update = function (t) {
        this.targetSet(MathUtils_1.default.map(this.transition(t), 0, 1, this.startValue, this.targetValue));
    };
    FweenStepValueTo.prototype.end = function () {
        this.targetSet(this.targetValue);
    };
    FweenStepValueTo.prototype.getDuration = function () {
        return this.duration;
    };
    return FweenStepValueTo;
})();
/*
// Steps for GameObject sequences

class ZTweenStepScaleFrom:IZTweenStep {

    // Properties
    private GameObject target;
    private Vector3 targetValue;

    // Extension functions
    public ZTweenStepScaleFrom(GameObject target, Vector3 targetValue) {
        this.target = target;
        this.targetValue = targetValue;
    }

    public void start() { }

    public void update(float t) { }

    public void end() {
        target.transform.localScale = targetValue;
    }

    public float getDuration() {
        return 0;
    }
}

class ZTweenStepScaleTo:IZTweenStep {

    // Properties
    private GameObject target;
    private float duration;
    private Vector3 startValue;
    private Vector3 targetValue;
    private Vector3 tempValue;
    private Func<float, float> transition;

    // Extension functions
    public ZTweenStepScaleTo(GameObject target, Vector3 targetValue, float duration, Func<float, float> transition) {
        this.target = target;
        this.duration = duration;
        this.targetValue = targetValue;
        this.transition = transition;
    }

    public void start() {
        this.startValue = target.transform.localScale;
        this.tempValue = new Vector3();
    }

    public void update(float t) {
        MathUtils.applyLerp(startValue, targetValue, transition(t), ref tempValue);
        target.transform.localScale = tempValue;
    }

    public void end() {
        target.transform.localScale = targetValue;
    }

    public float getDuration() {
        return duration;
    }
}

class ZTweenStepPositionFrom:IZTweenStep {

    // Properties
    private GameObject target;
    private Vector3 targetValue;

    // Extension functions
    public ZTweenStepPositionFrom(GameObject target, Vector3 targetValue) {
        this.target = target;
        this.targetValue = targetValue;
    }

    public void start() { }

    public void update(float t) { }

    public void end() {
        target.transform.localPosition = targetValue;
    }

    public float getDuration() {
        return 0;
    }
}

class ZTweenStepPositionTo:IZTweenStep {

    // Properties
    private GameObject target;
    private float duration;
    private Vector3 startValue;
    private Vector3 targetValue;
    private Vector3 tempValue;
    private Func<float, float> transition;

    // Extension functions
    public ZTweenStepPositionTo(GameObject target, Vector3 targetValue, float duration, Func<float, float> transition) {
        this.target = target;
        this.duration = duration;
        this.targetValue = targetValue;
        this.transition = transition;
    }

    public void start() {
        this.startValue = target.transform.localPosition;
        this.tempValue = new Vector3();
    }

    public void update(float t) {
        MathUtils.applyLerp(startValue, targetValue, transition(t), ref tempValue);
        target.transform.localPosition = tempValue;
    }

    public void end() {
        target.transform.localPosition = targetValue;
    }

    public float getDuration() {
        return duration;
    }
}

// Auxiliary functions

class MathUtils {
    public static float lerp(float start, float end, float t) {
    // Lerp: needed because Mathf.lerp clamps between 0 and 1
        return start + (end - start) * t;
}

public static void applyLerp(Vector3 start, Vector3 end, float t, ref Vector3 receiver) {
    // Lerp: needed because Mathf.lerp clamps between 0 and 1
    // Dumps into a target to avoid GC
    receiver.x = start.x + (end.x - start.x) * t;
    receiver.y = start.y + (end.y - start.y) * t;
    receiver.z = start.z + (end.z - start.z) * t;
}
}
*/
var FweenTicker = (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function FweenTicker() {
        // Ticker class to control updates
        // Properties
        this.sequences = [];
        this.time = 0.0;
        this.updateBound = this.update.bind(this);
        this.updateBound();
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    FweenTicker.prototype.update = function () {
        window.requestAnimationFrame(this.updateBound);
        this.time = Date.now() / 1000;
        for (var i = 0; i < this.sequences.length; i++) {
            if (this.sequences[i] != null) {
                this.sequences[i].update();
            }
            else {
                this.sequences.splice(i, 1);
                i--;
            }
        }
    };
    FweenTicker.prototype.getTime = function () {
        return this.time;
    };
    FweenTicker.prototype.add = function (sequence) {
        this.sequences.push(sequence);
    };
    FweenTicker.prototype.remove = function (sequence) {
        // Nullify first, remove later - otherwise it gets remove while doing Update(), which can cause the list to trip on itself
        var idx = this.sequences.indexOf(sequence);
        if (idx > -1)
            this.sequences[idx] = null;
    };
    return FweenTicker;
})();
exports.FweenTicker = FweenTicker;
},{"./../utils/MathUtils":3,"./Easing":1}],3:[function(require,module,exports){
/**
 * @author Zeh Fernando
 */
var MathUtils = (function () {
    function MathUtils() {
    }
    // Inlining: http://www.bytearray.org/?p=4789
    // Not working: returning a buffer underflow every time I try using it
    /**
     * Clamps a number to a range, by restricting it to a minimum and maximum values: if the passed value is lower than the minimum value, it's replaced by the minimum; if it's higher than the maximum value, it's replaced by the maximum; if not, it's unchanged.
     * @param value	The value to be clamped.
     * @param min		Minimum value allowed.
     * @param max		Maximum value allowed.
     * @return			The newly clamped value.
     */
    MathUtils.clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return value < min ? min : value > max ? max : value;
    };
    MathUtils.clampAuto = function (value, clamp1, clamp2) {
        if (clamp1 === void 0) { clamp1 = 0; }
        if (clamp2 === void 0) { clamp2 = 1; }
        if (clamp2 < clamp1) {
            var v = clamp2;
            clamp2 = clamp1;
            clamp1 = v;
        }
        return value < clamp1 ? clamp1 : value > clamp2 ? clamp2 : value;
    };
    /**
     * Maps a value from a range, determined by old minimum and maximum values, to a new range, determined by new minimum and maximum values. These minimum and maximum values are referential; the new value is not clamped by them.
     * @param value	The value to be re-mapped.
     * @param oldMin	The previous minimum value.
     * @param oldMax	The previous maximum value.
     * @param newMin	The new minimum value.
     * @param newMax	The new maximum value.
     * @return			The new value, mapped to the new range.
     */
    MathUtils.map = function (value, oldMin, oldMax, newMin, newMax, clamp) {
        if (newMin === void 0) { newMin = 0; }
        if (newMax === void 0) { newMax = 1; }
        if (clamp === void 0) { clamp = false; }
        if (oldMin == oldMax)
            return newMin;
        this.map_p = ((value - oldMin) / (oldMax - oldMin) * (newMax - newMin)) + newMin;
        if (clamp)
            this.map_p = newMin < newMax ? this.clamp(this.map_p, newMin, newMax) : this.clamp(this.map_p, newMax, newMin);
        return this.map_p;
    };
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
    MathUtils.rangeMod = function (value, min, pseudoMax) {
        var range = pseudoMax - min;
        value = (value - min) % range;
        if (value < 0)
            value = range - (-value % range);
        value += min;
        return value;
    };
    MathUtils.isPowerOfTwo = function (value) {
        // Return true if a number if a power of two (2, 4, 8, etc)
        // There's probably a better way, but trying to avoid bitwise manipulations
        while (value % 2 == 0 && value > 2)
            value /= 2;
        return value == 2;
    };
    MathUtils.getHighestPowerOfTwo = function (value) {
        // Return a power of two number that is higher than the passed value
        var c = 1;
        while (c < value)
            c *= 2;
        return c;
    };
    MathUtils.DEG2RAD = 1 / 180 * Math.PI;
    MathUtils.RAD2DEG = 1 / Math.PI * 180;
    return MathUtils;
})();
exports.default = MathUtils;
},{}]},{},[2]);
