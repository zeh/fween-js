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
define(["require", "exports", './Easing', './../utils/MathUtils'], function (require, exports, Easing_1, MathUtils_1) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Fween;
    // Create a global object with the class - only used in the single file version, replaced at build time
    // #IFDEF ES5SINGLE // window["Fween"] = Fween;
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
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zaXRpb25zL0Z3ZWVuLnRzIl0sIm5hbWVzIjpbIkZ3ZWVuIiwiRndlZW4uY29uc3RydWN0b3IiLCJGd2Vlbi51c2UiLCJGd2Vlbi5nZXRUaWNrZXIiLCJGd2VlblN0ZXBNZXRhZGF0YSIsIkZ3ZWVuU3RlcE1ldGFkYXRhLmNvbnN0cnVjdG9yIiwiRndlZW5TdGVwTWV0YWRhdGEudGltZUR1cmF0aW9uIiwiRndlZW5TZXF1ZW5jZSIsIkZ3ZWVuU2VxdWVuY2UuY29uc3RydWN0b3IiLCJGd2VlblNlcXVlbmNlLnBsYXkiLCJGd2VlblNlcXVlbmNlLnBhdXNlIiwiRndlZW5TZXF1ZW5jZS5jYWxsIiwiRndlZW5TZXF1ZW5jZS53YWl0IiwiRndlZW5TZXF1ZW5jZS5hZGRTdGVwIiwiRndlZW5TZXF1ZW5jZS51cGRhdGUiLCJGd2VlblNlcXVlbmNlLmdldFRyYW5zaXRpb24iLCJGd2VlblNlcXVlbmNlLmRlc3Ryb3kiLCJGd2VlbkdldHRlclNldHRlclNlcXVlbmNlIiwiRndlZW5HZXR0ZXJTZXR0ZXJTZXF1ZW5jZS5jb25zdHJ1Y3RvciIsIkZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2UuZnJvbSIsIkZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2UudG8iLCJGd2Vlbk9iamVjdFNlcXVlbmNlIiwiRndlZW5PYmplY3RTZXF1ZW5jZS5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcENhbGwiLCJGd2VlblN0ZXBDYWxsLmNvbnN0cnVjdG9yIiwiRndlZW5TdGVwQ2FsbC5zdGFydCIsIkZ3ZWVuU3RlcENhbGwudXBkYXRlIiwiRndlZW5TdGVwQ2FsbC5lbmQiLCJGd2VlblN0ZXBDYWxsLmdldER1cmF0aW9uIiwiRndlZW5TdGVwVmFsdWVGcm9tIiwiRndlZW5TdGVwVmFsdWVGcm9tLmNvbnN0cnVjdG9yIiwiRndlZW5TdGVwVmFsdWVGcm9tLnN0YXJ0IiwiRndlZW5TdGVwVmFsdWVGcm9tLnVwZGF0ZSIsIkZ3ZWVuU3RlcFZhbHVlRnJvbS5lbmQiLCJGd2VlblN0ZXBWYWx1ZUZyb20uZ2V0RHVyYXRpb24iLCJGd2VlblN0ZXBWYWx1ZVRvIiwiRndlZW5TdGVwVmFsdWVUby5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcFZhbHVlVG8uc3RhcnQiLCJGd2VlblN0ZXBWYWx1ZVRvLnVwZGF0ZSIsIkZ3ZWVuU3RlcFZhbHVlVG8uZW5kIiwiRndlZW5TdGVwVmFsdWVUby5nZXREdXJhdGlvbiIsIkZ3ZWVuVGlja2VyIiwiRndlZW5UaWNrZXIuY29uc3RydWN0b3IiLCJGd2VlblRpY2tlci51cGRhdGUiLCJGd2VlblRpY2tlci5nZXRUaW1lIiwiRndlZW5UaWNrZXIuYWRkIiwiRndlZW5UaWNrZXIucmVtb3ZlIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHOzs7Ozs7O0lBTUg7Ozs7Ozs7O09BUUc7SUFFSCwrRUFBK0U7SUFFL0UseUVBQXlFO0lBRXpFO1FBQUFBO1FBNkJBQyxDQUFDQTtRQWpCY0QsU0FBR0EsR0FBakJBLFVBQWtCQSxPQUFXQSxFQUFFQSxPQUFZQTtZQUMxQ0UsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxTQUFTQTtnQkFDVEEsTUFBTUEsQ0FBQ0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUN6Q0EsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsVUFBVUEsSUFBSUEsT0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNFQSxnQkFBZ0JBO2dCQUNoQkEsTUFBTUEsQ0FBQ0EsSUFBSUEseUJBQXlCQSxDQUFDQSxPQUFPQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUN4REEsQ0FBQ0E7WUFFREEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsMENBQTBDQSxDQUFDQSxDQUFDQTtZQUMxREEsTUFBTUEs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d0JBQ2hDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxtQkFBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsT0FBT0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBRTVMQSx5QkFBeUJBO3dCQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2xGQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDekRBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO2dDQUNuQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0NBQzFEQSxJQUFJQSxDQUFDQSxZQUFZQSxJQUFJQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQTtnQ0FDeEVBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FB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RUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO1FBQzFDQSxDQUFDQTtRQUNGTCxrQkFBQ0E7SUFBREEsQ0FsREEsQUFrRENBLElBQUE7SUFsRFksbUJBQVcsY0FrRHZCLENBQUEiLCJmaWxlIjoidHJhbnNpdGlvbnMvRndlZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGF1dGhvclx0WmVoIEZlcm5hbmRvXHJcbiAqIEB2ZXJzaW9uXHQxLjBcclxuICogQHNpbmNlXHQyMDE1LTA4LTAzXHJcbiAqL1xyXG5cclxuaW1wb3J0IFNpbXBsZVNpZ25hbCBmcm9tICcuLy4uL3NpZ25hbHMvU2ltcGxlU2lnbmFsJztcclxuaW1wb3J0IEVhc2luZyBmcm9tICcuL0Vhc2luZyc7XHJcbmltcG9ydCBNYXRoVXRpbHMgZnJvbSAnLi8uLi91dGlscy9NYXRoVXRpbHMnO1xyXG5cclxuLypcclxuIElkZWFzIGZvciB0d2VlbmluZyAtIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3plaC91bml0eS10aWRiaXRzL2Jsb2IvbWFzdGVyL3RyYW5zaXRpb25zL1pUd2Vlbi5jc1xyXG5cclxuIFpUd2Vlbi51c2Uob2JqKVxyXG4gLnRvKG8sIHQsIHRyYW5zaXRpb24pXHJcbiAuY2FsbChmKVxyXG4gLndhaXQodClcclxuIC51c2UoZ2V0dGVyLCBzZXR0ZXI/KVxyXG4gKi9cclxuXHJcbi8vIFRPRE86IHRoaXMgbGlicmFyeSBoYXMgLnRpbWUsIC5kdXJhdGlvbiwgYW5kIC5nZXREdXJhdGlvbigpLiBNYWtlIHlvdXIgbWluZCFcclxuXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96ZWgvdW5pdHktdGlkYml0cy9ibG9iL21hc3Rlci90cmFuc2l0aW9ucy9aVHdlZW4uY3NcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ3ZWVuIHtcclxuXHRcclxuXHQvLyBNYWluIGNsYXNzIC0ganVzdCBhIHN0YXJ0aW5nIHBvaW50XHJcblx0cHJpdmF0ZSBzdGF0aWMgdGlja2VyOkZ3ZWVuVGlja2VyID0gbnVsbDtcclxuXHRcclxuXHQvLyBQcm9wZXJ0aWVzXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgU1RBVElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHJcblx0cHVibGljIHN0YXRpYyB1c2Uob2JqZWN0MTooKT0+bnVtYmVyLCBvYmplY3QyOih2Om51bWJlcikgPT4gdm9pZCk6RndlZW5TZXF1ZW5jZTtcclxuXHRwdWJsaWMgc3RhdGljIHVzZShvYmplY3QxOk9iamVjdCk6RndlZW5TZXF1ZW5jZTtcclxuXHRwdWJsaWMgc3RhdGljIHVzZShvYmplY3QxOmFueSwgb2JqZWN0Mj86YW55KTpGd2VlblNlcXVlbmNlIHtcclxuXHRcdGlmICh0eXBlb2Yob2JqZWN0MSkgPT0gXCJvYmplY3RcIikge1xyXG5cdFx0XHQvLyBPYmplY3RcclxuXHRcdFx0cmV0dXJuIG5ldyBGd2Vlbk9iamVjdFNlcXVlbmNlKG9iamVjdDEpO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2Yob2JqZWN0MSkgPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZihvYmplY3QyKSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0Ly8gR2V0dGVyL3NldHRlclxyXG5cdFx0XHRyZXR1cm4gbmV3IEZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2Uob2JqZWN0MSwgb2JqZWN0Mik7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc29sZS5lcnJvcihcIlR3ZWVuaW5nIHBhcmFtZXRlcnMgd2VyZSBub3QgdW5kZXJzdG9vZC5cIik7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VGlja2VyKCk6RndlZW5UaWNrZXIge1xyXG5cdFx0aWYgKCF0aGlzLnRpY2tlcikgdGhpcy50aWNrZXIgPSBuZXcgRndlZW5UaWNrZXIoKTtcclxuXHRcdHJldHVybiB0aGlzLnRpY2tlcjtcclxuXHR9XHJcbn1cclxuXHJcbi8vIENyZWF0ZSBhIGdsb2JhbCBvYmplY3Qgd2l0aCB0aGUgY2xhc3MgLSBvbmx5IHVzZWQgaW4gdGhlIHNpbmdsZSBmaWxlIHZlcnNpb24sIHJlcGxhY2VkIGF0IGJ1aWxkIHRpbWVcclxuLy8gI0lGREVGIEVTNVNJTkdMRSAvLyB3aW5kb3dbXCJGd2VlblwiXSA9IEZ3ZWVuO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBJTlRFUk5BTCBDTEFTU0VTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vLyBBdXggY2xhc3Nlc1xyXG5cclxuY2xhc3MgRndlZW5TdGVwTWV0YWRhdGEge1xyXG5cdFxyXG5cdC8vIENsYXNzIHRvIG1haW50YWluIG1ldGFkYXRhIHJlbGF0ZWQgdG8gZWFjaCBzdGVwIG9mIGEgRndlZW4gc2VxdWVuY2VcclxuXHRcclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHVibGljIGhhc1N0YXJ0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cdHB1YmxpYyBoYXNDb21wbGV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cdHB1YmxpYyB0aW1lU3RhcnQ6bnVtYmVyID0gMC4wO1xyXG5cdHB1YmxpYyB0aW1lRW5kOm51bWJlciA9IDA7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFDQ0VTU09SIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIGdldCB0aW1lRHVyYXRpb24oKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMudGltZUVuZCAtIHRoaXMudGltZVN0YXJ0O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRndlZW5TdGVwIHtcclxuXHRzdGFydCgpOnZvaWQ7XHJcblx0dXBkYXRlKHQ6bnVtYmVyKTp2b2lkO1xyXG5cdGVuZCgpOnZvaWQ7XHJcblx0Z2V0RHVyYXRpb24oKTpudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGd2VlblNlcXVlbmNlIHtcclxuXHRcclxuXHQvLyBPbmUgc2VxdWVuY2Ugb2Ygc3RlcHNcclxuXHRcclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBzdGVwczpBcnJheTxJRndlZW5TdGVwPiA9IFtdO1xyXG5cdHByaXZhdGUgc3RlcHNNZXRhZGF0YXM6QXJyYXk8RndlZW5TdGVwTWV0YWRhdGE+ID0gW107XHJcblxyXG5cdHByaXZhdGUgaXNQbGF5aW5nOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIGN1cnJlbnRTdGVwOm51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBzdGFydFRpbWU6bnVtYmVyID0gMC4wO1xyXG5cdHByaXZhdGUgcGF1c2VUaW1lOm51bWJlciA9IDAuMDtcclxuXHRwcml2YXRlIGV4ZWN1dGVkVGltZTpudW1iZXIgPSAwLjA7XHJcblx0cHJpdmF0ZSBkdXJhdGlvbjpudW1iZXIgPSAwLjA7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdC8vIENyZWF0ZSBhIG5ldyBGd2VlblxyXG5cdFx0dGhpcy5zdGFydFRpbWUgPSBGd2Vlbi5nZXRUaWNrZXIoKS5nZXRUaW1lKCk7XHJcblxyXG5cdFx0Ly8gQWRkIHRvIGxpc3RcclxuXHRcdEZ3ZWVuLmdldFRpY2tlcigpLmFkZCh0aGlzKTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHQvLyBQbGF5IGNvbnRyb2wgbWV0aG9kc1xyXG5cclxuXHQvKipcclxuXHQgKiBQbGF5IChvciByZXN1bWUpIHRoZSBzZXF1ZW5jZVxyXG5cdCAqL1xyXG5cdHB1YmxpYyBwbGF5KCk6RndlZW5TZXF1ZW5jZSB7XHJcblx0XHRpZiAoIXRoaXMuaXNQbGF5aW5nKSB7XHJcblx0XHRcdHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcclxuXHRcdFx0bGV0IHRpbWVQYXVzZWQgPSBGd2Vlbi5nZXRUaWNrZXIoKS5nZXRUaW1lKCkgLSB0aGlzLnBhdXNlVGltZTtcclxuXHRcdFx0dGhpcy5zdGFydFRpbWUgKz0gdGltZVBhdXNlZDtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUGF1c2UgdGhlIHNlcXVlbmNlXHJcblx0ICovXHJcblx0cHVibGljIHBhdXNlKCk6RndlZW5TZXF1ZW5jZSB7XHJcblx0XHRpZiAodGhpcy5pc1BsYXlpbmcpIHtcclxuXHRcdFx0dGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5wYXVzZVRpbWUgPSBGd2Vlbi5nZXRUaWNrZXIoKS5nZXRUaW1lKCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8vIFV0aWxpdHkgbWV0aG9kc1xyXG5cclxuXHQvKipcclxuXHQgKiBDYWxsIGEgZnVuY3Rpb25cclxuXHQgKi9cclxuXHRwdWJsaWMgY2FsbChmdW5jOkZ1bmN0aW9uKTpGd2VlblNlcXVlbmNlIHtcclxuXHRcdHRoaXMuYWRkU3RlcChuZXcgRndlZW5TdGVwQ2FsbChmdW5jKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFdhaXQgYSBudW1iZXIgb2Ygc2Vjb25kc1xyXG5cdCAqL1xyXG5cdHB1YmxpYyB3YWl0KGR1cmF0aW9uOm51bWJlcik6RndlZW5TZXF1ZW5jZSB7XHJcblx0XHR0aGlzLmR1cmF0aW9uICs9IHRoaXMuZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFJJVkFURSBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHQvLyBDb3JlIHR3ZWVuIHN0ZXAgY29udHJvbCBtZXRob2RzOyByZXVzZWQgYnkgc3ViY2xhc3Nlc1xyXG5cclxuXHRwcm90ZWN0ZWQgYWRkU3RlcChzdGVwOklGd2VlblN0ZXApOnZvaWQge1xyXG5cdFx0dGhpcy5zdGVwcy5wdXNoKHN0ZXApO1xyXG5cclxuXHRcdGxldCB0d2Vlbk1ldGFkYXRhID0gbmV3IEZ3ZWVuU3RlcE1ldGFkYXRhKCk7XHJcblx0XHR0d2Vlbk1ldGFkYXRhLnRpbWVTdGFydCA9IHRoaXMuc3RhcnRUaW1lICsgdGhpcy5kdXJhdGlvbjtcclxuXHRcdHRoaXMuZHVyYXRpb24gKz0gc3RlcC5nZXREdXJhdGlvbigpO1xyXG5cdFx0dHdlZW5NZXRhZGF0YS50aW1lRW5kID0gdGhpcy5zdGFydFRpbWUgKyB0aGlzLmR1cmF0aW9uO1xyXG5cclxuXHRcdHRoaXMuc3RlcHNNZXRhZGF0YXMucHVzaCh0d2Vlbk1ldGFkYXRhKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGUoKTp2b2lkIHtcclxuXHRcdC8vIFVwZGF0ZSBjdXJyZW50IHN0ZXAocykgYmFzZWQgb24gdGhlIHRpbWVcclxuXHJcblx0XHQvLyBDaGVjayBpZiBmaW5pc2hlZFxyXG5cdFx0aWYgKHRoaXMuY3VycmVudFN0ZXAgPj0gdGhpcy5zdGVwcy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy5kZXN0cm95KClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBzaG91bGRVcGRhdGVPbmNlID0gdGhpcy5pc1BsYXlpbmc7XHJcblxyXG5cdFx0XHR3aGlsZSAoc2hvdWxkVXBkYXRlT25jZSAmJiB0aGlzLmN1cnJlbnRTdGVwIDwgdGhpcy5zdGVwcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRzaG91bGRVcGRhdGVPbmNlID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdGlmIChGd2Vlbi5nZXRUaWNrZXIoKS5nZXRUaW1lKCkgPj0gdGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS50aW1lU3RhcnQpIHtcclxuXHRcdFx0XHRcdC8vIFN0YXJ0IHRoZSBjdXJyZW50IHR3ZWVuIHN0ZXAgaWYgbmVjZXNzYXJ5XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0uaGFzU3RhcnRlZCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN0ZXBzW3RoaXMuY3VycmVudFN0ZXBdLnN0YXJ0KCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0uaGFzU3RhcnRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBjdXJyZW50IHR3ZWVuIHN0ZXBcclxuXHRcdFx0XHRcdHRoaXMuc3RlcHNbdGhpcy5jdXJyZW50U3RlcF0udXBkYXRlKE1hdGhVdGlscy5tYXAoRndlZW4uZ2V0VGlja2VyKCkuZ2V0VGltZSgpLCB0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLnRpbWVTdGFydCwgdGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS50aW1lRW5kLCAwLCAxLCB0cnVlKSk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgaXQncyBmaW5pc2hlZFxyXG5cdFx0XHRcdFx0aWYgKEZ3ZWVuLmdldFRpY2tlcigpLmdldFRpbWUoKSA+PSB0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLnRpbWVFbmQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLmhhc0NvbXBsZXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuc3RlcHNbdGhpcy5jdXJyZW50U3RlcF0uZW5kKCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS5oYXNDb21wbGV0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZXhlY3V0ZWRUaW1lICs9IHRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0udGltZUR1cmF0aW9uO1xyXG5cdFx0XHRcdFx0XHRcdHNob3VsZFVwZGF0ZU9uY2UgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3VycmVudFN0ZXArKztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGdldFRyYW5zaXRpb24odHJhbnNpdGlvbjoodDpudW1iZXIpID0+IG51bWJlcik6KHQ6bnVtYmVyKSA9PiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRyYW5zaXRpb24gPT0gbnVsbCA/IEVhc2luZy5ub25lIDogdHJhbnNpdGlvbjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZGVzdHJveSgpOnZvaWQge1xyXG5cdFx0RndlZW4uZ2V0VGlja2VyKCkucmVtb3ZlKHRoaXMpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgRndlZW5HZXR0ZXJTZXR0ZXJTZXF1ZW5jZSBleHRlbmRzIEZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFxyXG5cdC8vIEEgc2VxdWVuY2UgZm9yIGdldHRlci9zZXR0ZXIgcGFpcnNcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgdGFyZ2V0R2V0OigpID0+IG51bWJlcjtcclxuXHRwcml2YXRlIHRhcmdldFNldDoodmFsdWU6bnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IodGFyZ2V0R2V0OigpID0+IG51bWJlciwgdGFyZ2V0U2V0Oih2YWx1ZTpudW1iZXIpID0+IHZvaWQpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy50YXJnZXRHZXQgPSB0YXJnZXRHZXQ7XHJcblx0XHR0aGlzLnRhcmdldFNldCA9IHRhcmdldFNldDtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgZnJvbSh2YWx1ZTpudW1iZXIpOkZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2Uge1xyXG5cdFx0dGhpcy5hZGRTdGVwKG5ldyBGd2VlblN0ZXBWYWx1ZUZyb20odGhpcy50YXJnZXRTZXQsIHZhbHVlKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB0byh2YWx1ZTpudW1iZXIsIGR1cmF0aW9uOm51bWJlciA9IDAsIHRyYW5zaXRpb246KHQ6bnVtYmVyKSA9PiBudW1iZXIgPSBudWxsKTpGd2VlbkdldHRlclNldHRlclNlcXVlbmNlIHtcclxuXHRcdHRoaXMuYWRkU3RlcChuZXcgRndlZW5TdGVwVmFsdWVUbyh0aGlzLnRhcmdldEdldCwgdGhpcy50YXJnZXRTZXQsIHZhbHVlLCBkdXJhdGlvbiwgdGhpcy5nZXRUcmFuc2l0aW9uKHRyYW5zaXRpb24pKSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIEZ3ZWVuT2JqZWN0U2VxdWVuY2UgZXh0ZW5kcyBGd2VlblNlcXVlbmNlIHtcclxuXHRcclxuXHQvLyBBIHNlcXVlbmNlIGZvciBjb21tb24gb2JqZWN0cycgcHJvcGVydGllc1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSB0YXJnZXRPYmplY3Q6T2JqZWN0O1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcclxuXHRjb25zdHJ1Y3RvcihvYmplY3Q6T2JqZWN0KSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMudGFyZ2V0T2JqZWN0ID0gb2JqZWN0O1xyXG5cdH1cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0LypcclxuXHQgcHVibGljIFpUd2VlbkdhbWVPYmplY3RTZXF1ZW5jZSBzY2FsZUZyb20oVmVjdG9yMyBzY2FsZSkge1xyXG5cdCBhZGRTdGVwKG5ldyBaVHdlZW5TdGVwU2NhbGVGcm9tKHRhcmdldEdhbWVPYmplY3QsIHNjYWxlKSk7XHJcblx0IHJldHVybiB0aGlzO1xyXG5cdCB9XHJcblx0ICovXHJcbn1cclxuXHJcbi8vIENvbW1vbiBzdGVwc1xyXG5cclxuY2xhc3MgRndlZW5TdGVwQ2FsbCB7XHJcblxyXG5cdC8vIEEgc3RlcCB0byBjYWxsIGEgZnVuY3Rpb25cclxuXHRwcml2YXRlIGFjdGlvbjpGdW5jdGlvbjtcdFxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IoZnVuYzpGdW5jdGlvbikge1xyXG5cdFx0dGhpcy5hY3Rpb24gPSBmdW5jO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBzdGFydCgpOnZvaWQgeyB9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGUodDpudW1iZXIpOnZvaWQgeyB9XHJcblxyXG5cdHB1YmxpYyBlbmQoKTp2b2lkIHtcclxuXHRcdHRoaXMuYWN0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0RHVyYXRpb24oKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG4vLyBTdGVwcyBmb3Igc3BlY2lmaWMgc2VxdWVuY2VzOiBHZXR0ZXJTZXR0ZXJcclxuXHJcbmNsYXNzIEZ3ZWVuU3RlcFZhbHVlRnJvbSB7XHJcblxyXG5cdC8vIEEgc3RlcCB0byBzZXQgdGhlIHN0YXJ0aW5nIHZhbHVlXHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIHRhcmdldFNldDoodmFsdWU6bnVtYmVyKSA9PiB2b2lkO1xyXG5cdHByaXZhdGUgdGFyZ2V0VmFsdWU6bnVtYmVyO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IodGFyZ2V0U2V0Oih2YWx1ZTpudW1iZXIpID0+IHZvaWQsIHRhcmdldFZhbHVlOm51bWJlcikge1xyXG5cdFx0dGhpcy50YXJnZXRTZXQgPSB0YXJnZXRTZXQ7XHJcblx0XHR0aGlzLnRhcmdldFZhbHVlID0gdGFyZ2V0VmFsdWU7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIHN0YXJ0KCk6dm9pZCB7IH1cclxuXHJcblx0cHVibGljIHVwZGF0ZSh0Om51bWJlcik6dm9pZCB7IH1cclxuXHJcblx0cHVibGljIGVuZCgpOnZvaWQge1xyXG5cdFx0dGhpcy50YXJnZXRTZXQodGhpcy50YXJnZXRWYWx1ZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0RHVyYXRpb24oKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBGd2VlblN0ZXBWYWx1ZVRvIHtcclxuXHJcblx0Ly8gQSBzdGVwIHRvIHR3ZWVuIHRvIGEgdmFsdWVcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgdGFyZ2V0R2V0OigpID0+IG51bWJlcjtcclxuXHRwcml2YXRlIHRhcmdldFNldDoodmFsdWU6bnVtYmVyKSA9PiB2b2lkO1xyXG5cdHByaXZhdGUgZHVyYXRpb246bnVtYmVyO1xyXG5cdHByaXZhdGUgc3RhcnRWYWx1ZTpudW1iZXI7XHJcblx0cHJpdmF0ZSB0YXJnZXRWYWx1ZTpudW1iZXI7XHJcblx0cHJpdmF0ZSB0cmFuc2l0aW9uOih0Om51bWJlcikgPT4gbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcih0YXJnZXRHZXQ6KCkgPT4gbnVtYmVyLCB0YXJnZXRTZXQ6KHZhbHVlOm51bWJlcikgPT4gdm9pZCwgdGFyZ2V0VmFsdWU6bnVtYmVyLCBkdXJhdGlvbjpudW1iZXIsIHRyYW5zaXRpb246KHQ6bnVtYmVyKSA9PiBudW1iZXIpIHtcclxuXHRcdHRoaXMudGFyZ2V0R2V0ID0gdGFyZ2V0R2V0O1xyXG5cdFx0dGhpcy50YXJnZXRTZXQgPSB0YXJnZXRTZXQ7XHJcblx0XHR0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHR0aGlzLnRhcmdldFZhbHVlID0gdGFyZ2V0VmFsdWU7XHJcblx0XHR0aGlzLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xyXG5cdH1cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIHN0YXJ0KCk6dm9pZCB7XHJcblx0XHR0aGlzLnN0YXJ0VmFsdWUgPSB0aGlzLnRhcmdldEdldCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHVwZGF0ZSh0Om51bWJlcik6dm9pZCB7XHJcblx0XHR0aGlzLnRhcmdldFNldChNYXRoVXRpbHMubWFwKHRoaXMudHJhbnNpdGlvbih0KSwgMCwgMSwgdGhpcy5zdGFydFZhbHVlLCB0aGlzLnRhcmdldFZhbHVlKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZW5kKCk6dm9pZCB7XHJcblx0XHR0aGlzLnRhcmdldFNldCh0aGlzLnRhcmdldFZhbHVlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXREdXJhdGlvbigpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5kdXJhdGlvbjtcclxuXHR9XHJcbn1cclxuXHJcbi8qXHJcbi8vIFN0ZXBzIGZvciBHYW1lT2JqZWN0IHNlcXVlbmNlc1xyXG5cclxuY2xhc3MgWlR3ZWVuU3RlcFNjYWxlRnJvbTpJWlR3ZWVuU3RlcCB7XHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIEdhbWVPYmplY3QgdGFyZ2V0O1xyXG5cdHByaXZhdGUgVmVjdG9yMyB0YXJnZXRWYWx1ZTtcclxuXHJcblx0Ly8gRXh0ZW5zaW9uIGZ1bmN0aW9uc1xyXG5cdHB1YmxpYyBaVHdlZW5TdGVwU2NhbGVGcm9tKEdhbWVPYmplY3QgdGFyZ2V0LCBWZWN0b3IzIHRhcmdldFZhbHVlKSB7XHJcblx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdHRoaXMudGFyZ2V0VmFsdWUgPSB0YXJnZXRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHN0YXJ0KCkgeyB9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHVwZGF0ZShmbG9hdCB0KSB7IH1cclxuXHJcblx0cHVibGljIHZvaWQgZW5kKCkge1xyXG5cdFx0dGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFNjYWxlID0gdGFyZ2V0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZmxvYXQgZ2V0RHVyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFpUd2VlblN0ZXBTY2FsZVRvOklaVHdlZW5TdGVwIHtcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgR2FtZU9iamVjdCB0YXJnZXQ7XHJcblx0cHJpdmF0ZSBmbG9hdCBkdXJhdGlvbjtcclxuXHRwcml2YXRlIFZlY3RvcjMgc3RhcnRWYWx1ZTtcclxuXHRwcml2YXRlIFZlY3RvcjMgdGFyZ2V0VmFsdWU7XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHRlbXBWYWx1ZTtcclxuXHRwcml2YXRlIEZ1bmM8ZmxvYXQsIGZsb2F0PiB0cmFuc2l0aW9uO1xyXG5cclxuXHQvLyBFeHRlbnNpb24gZnVuY3Rpb25zXHJcblx0cHVibGljIFpUd2VlblN0ZXBTY2FsZVRvKEdhbWVPYmplY3QgdGFyZ2V0LCBWZWN0b3IzIHRhcmdldFZhbHVlLCBmbG9hdCBkdXJhdGlvbiwgRnVuYzxmbG9hdCwgZmxvYXQ+IHRyYW5zaXRpb24pIHtcclxuXHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0dGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0dGhpcy50YXJnZXRWYWx1ZSA9IHRhcmdldFZhbHVlO1xyXG5cdFx0dGhpcy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHN0YXJ0KCkge1xyXG5cdFx0dGhpcy5zdGFydFZhbHVlID0gdGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFNjYWxlO1xyXG5cdFx0dGhpcy50ZW1wVmFsdWUgPSBuZXcgVmVjdG9yMygpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgdXBkYXRlKGZsb2F0IHQpIHtcclxuXHRcdE1hdGhVdGlscy5hcHBseUxlcnAoc3RhcnRWYWx1ZSwgdGFyZ2V0VmFsdWUsIHRyYW5zaXRpb24odCksIHJlZiB0ZW1wVmFsdWUpO1xyXG5cdFx0dGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFNjYWxlID0gdGVtcFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgZW5kKCkge1xyXG5cdFx0dGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFNjYWxlID0gdGFyZ2V0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZmxvYXQgZ2V0RHVyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gZHVyYXRpb247XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBaVHdlZW5TdGVwUG9zaXRpb25Gcm9tOklaVHdlZW5TdGVwIHtcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgR2FtZU9iamVjdCB0YXJnZXQ7XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHRhcmdldFZhbHVlO1xyXG5cclxuXHQvLyBFeHRlbnNpb24gZnVuY3Rpb25zXHJcblx0cHVibGljIFpUd2VlblN0ZXBQb3NpdGlvbkZyb20oR2FtZU9iamVjdCB0YXJnZXQsIFZlY3RvcjMgdGFyZ2V0VmFsdWUpIHtcclxuXHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0dGhpcy50YXJnZXRWYWx1ZSA9IHRhcmdldFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgc3RhcnQoKSB7IH1cclxuXHJcblx0cHVibGljIHZvaWQgdXBkYXRlKGZsb2F0IHQpIHsgfVxyXG5cclxuXHRwdWJsaWMgdm9pZCBlbmQoKSB7XHJcblx0XHR0YXJnZXQudHJhbnNmb3JtLmxvY2FsUG9zaXRpb24gPSB0YXJnZXRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBmbG9hdCBnZXREdXJhdGlvbigpIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgWlR3ZWVuU3RlcFBvc2l0aW9uVG86SVpUd2VlblN0ZXAge1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBHYW1lT2JqZWN0IHRhcmdldDtcclxuXHRwcml2YXRlIGZsb2F0IGR1cmF0aW9uO1xyXG5cdHByaXZhdGUgVmVjdG9yMyBzdGFydFZhbHVlO1xyXG5cdHByaXZhdGUgVmVjdG9yMyB0YXJnZXRWYWx1ZTtcclxuXHRwcml2YXRlIFZlY3RvcjMgdGVtcFZhbHVlO1xyXG5cdHByaXZhdGUgRnVuYzxmbG9hdCwgZmxvYXQ+IHRyYW5zaXRpb247XHJcblxyXG5cdC8vIEV4dGVuc2lvbiBmdW5jdGlvbnNcclxuXHRwdWJsaWMgWlR3ZWVuU3RlcFBvc2l0aW9uVG8oR2FtZU9iamVjdCB0YXJnZXQsIFZlY3RvcjMgdGFyZ2V0VmFsdWUsIGZsb2F0IGR1cmF0aW9uLCBGdW5jPGZsb2F0LCBmbG9hdD4gdHJhbnNpdGlvbikge1xyXG5cdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHR0aGlzLnRhcmdldFZhbHVlID0gdGFyZ2V0VmFsdWU7XHJcblx0XHR0aGlzLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgc3RhcnQoKSB7XHJcblx0XHR0aGlzLnN0YXJ0VmFsdWUgPSB0YXJnZXQudHJhbnNmb3JtLmxvY2FsUG9zaXRpb247XHJcblx0XHR0aGlzLnRlbXBWYWx1ZSA9IG5ldyBWZWN0b3IzKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCB1cGRhdGUoZmxvYXQgdCkge1xyXG5cdFx0TWF0aFV0aWxzLmFwcGx5TGVycChzdGFydFZhbHVlLCB0YXJnZXRWYWx1ZSwgdHJhbnNpdGlvbih0KSwgcmVmIHRlbXBWYWx1ZSk7XHJcblx0XHR0YXJnZXQudHJhbnNmb3JtLmxvY2FsUG9zaXRpb24gPSB0ZW1wVmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCBlbmQoKSB7XHJcblx0XHR0YXJnZXQudHJhbnNmb3JtLmxvY2FsUG9zaXRpb24gPSB0YXJnZXRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBmbG9hdCBnZXREdXJhdGlvbigpIHtcclxuXHRcdHJldHVybiBkdXJhdGlvbjtcclxuXHR9XHJcbn1cclxuXHJcbi8vIEF1eGlsaWFyeSBmdW5jdGlvbnNcclxuXHJcbmNsYXNzIE1hdGhVdGlscyB7XHJcblx0cHVibGljIHN0YXRpYyBmbG9hdCBsZXJwKGZsb2F0IHN0YXJ0LCBmbG9hdCBlbmQsIGZsb2F0IHQpIHtcclxuXHQvLyBMZXJwOiBuZWVkZWQgYmVjYXVzZSBNYXRoZi5sZXJwIGNsYW1wcyBiZXR3ZWVuIDAgYW5kIDFcclxuXHRcdHJldHVybiBzdGFydCArIChlbmQgLSBzdGFydCkgKiB0O1xyXG59XHJcblxyXG5wdWJsaWMgc3RhdGljIHZvaWQgYXBwbHlMZXJwKFZlY3RvcjMgc3RhcnQsIFZlY3RvcjMgZW5kLCBmbG9hdCB0LCByZWYgVmVjdG9yMyByZWNlaXZlcikge1xyXG5cdC8vIExlcnA6IG5lZWRlZCBiZWNhdXNlIE1hdGhmLmxlcnAgY2xhbXBzIGJldHdlZW4gMCBhbmQgMVxyXG5cdC8vIER1bXBzIGludG8gYSB0YXJnZXQgdG8gYXZvaWQgR0NcclxuXHRyZWNlaXZlci54ID0gc3RhcnQueCArIChlbmQueCAtIHN0YXJ0LngpICogdDtcclxuXHRyZWNlaXZlci55ID0gc3RhcnQueSArIChlbmQueSAtIHN0YXJ0LnkpICogdDtcclxuXHRyZWNlaXZlci56ID0gc3RhcnQueiArIChlbmQueiAtIHN0YXJ0LnopICogdDtcclxufVxyXG59XHJcbiovXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEZ3ZWVuVGlja2VyIHtcclxuXHJcblx0Ly8gVGlja2VyIGNsYXNzIHRvIGNvbnRyb2wgdXBkYXRlc1xyXG5cdFxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIHNlcXVlbmNlczpBcnJheTxGd2VlblNlcXVlbmNlPiA9IFtdO1xyXG5cdHByaXZhdGUgdGltZTpudW1iZXIgPSAwLjA7XHJcblx0cHJpdmF0ZSB1cGRhdGVCb3VuZDooKSA9PiB2b2lkO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnVwZGF0ZUJvdW5kID0gdGhpcy51cGRhdGUuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMudXBkYXRlQm91bmQoKTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwcml2YXRlIHVwZGF0ZSgpOnZvaWQge1xyXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZUJvdW5kKTtcclxuXHJcblx0XHR0aGlzLnRpbWUgPSBEYXRlLm5vdygpIC8gMTAwMDtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VxdWVuY2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnNlcXVlbmNlc1tpXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5zZXF1ZW5jZXNbaV0udXBkYXRlKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5zZXF1ZW5jZXMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldFRpbWUoKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMudGltZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGQoc2VxdWVuY2U6RndlZW5TZXF1ZW5jZSk6dm9pZCB7XHJcblx0XHR0aGlzLnNlcXVlbmNlcy5wdXNoKHNlcXVlbmNlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW1vdmUoc2VxdWVuY2U6RndlZW5TZXF1ZW5jZSk6dm9pZCB7XHJcblx0XHQvLyBOdWxsaWZ5IGZpcnN0LCByZW1vdmUgbGF0ZXIgLSBvdGhlcndpc2UgaXQgZ2V0cyByZW1vdmUgd2hpbGUgZG9pbmcgVXBkYXRlKCksIHdoaWNoIGNhbiBjYXVzZSB0aGUgbGlzdCB0byB0cmlwIG9uIGl0c2VsZlxyXG5cdFx0dmFyIGlkeCA9IHRoaXMuc2VxdWVuY2VzLmluZGV4T2Yoc2VxdWVuY2UpO1xyXG5cdFx0aWYgKGlkeCA+IC0xKSB0aGlzLnNlcXVlbmNlc1tpZHhdID0gbnVsbDtcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9