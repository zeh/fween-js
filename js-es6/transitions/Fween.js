/**
 * @author	Zeh Fernando
 * @version	1.0
 * @since	2015-08-03
 */
import Easing from './Easing';
import MathUtils from './../utils/MathUtils';
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
export default class Fween {
    static use(object1, object2) {
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
    }
    static getTicker() {
        if (!this.ticker)
            this.ticker = new FweenTicker();
        return this.ticker;
    }
}
// Main class - just a starting point
Fween.ticker = null;
// Create a global object with the class - only used in the single file version, replaced at build time
// #IFDEF ES5SINGLE // window["Fween"] = Fween;
// ================================================================================================================
// INTERNAL CLASSES -----------------------------------------------------------------------------------------------
// Aux classes
class FweenStepMetadata {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor() {
        // Class to maintain metadata related to each step of a Fween sequence
        // Properties
        this.hasStarted = false;
        this.hasCompleted = false;
        this.timeStart = 0.0;
        this.timeEnd = 0;
    }
    // ================================================================================================================
    // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
    get timeDuration() {
        return this.timeEnd - this.timeStart;
    }
}
export class FweenSequence {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor() {
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
    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            let timePaused = Fween.getTicker().getTime() - this.pauseTime;
            this.startTime += timePaused;
        }
        return this;
    }
    /**
     * Pause the sequence
     */
    pause() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.pauseTime = Fween.getTicker().getTime();
        }
        return this;
    }
    // Utility methods
    /**
     * Call a function
     */
    call(func) {
        this.addStep(new FweenStepCall(func));
        return this;
    }
    /**
     * Wait a number of seconds
     */
    wait(duration) {
        this.duration += this.duration;
        return this;
    }
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    // Core tween step control methods; reused by subclasses
    addStep(step) {
        this.steps.push(step);
        let tweenMetadata = new FweenStepMetadata();
        tweenMetadata.timeStart = this.startTime + this.duration;
        this.duration += step.getDuration();
        tweenMetadata.timeEnd = this.startTime + this.duration;
        this.stepsMetadatas.push(tweenMetadata);
    }
    update() {
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
                    this.steps[this.currentStep].update(MathUtils.map(Fween.getTicker().getTime(), this.stepsMetadatas[this.currentStep].timeStart, this.stepsMetadatas[this.currentStep].timeEnd, 0, 1, true));
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
    }
    getTransition(transition) {
        return transition == null ? Easing.none : transition;
    }
    destroy() {
        Fween.getTicker().remove(this);
    }
}
class FweenGetterSetterSequence extends FweenSequence {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor(targetGet, targetSet) {
        super();
        this.targetGet = targetGet;
        this.targetSet = targetSet;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    from(value) {
        this.addStep(new FweenStepValueFrom(this.targetSet, value));
        return this;
    }
    to(value, duration = 0, transition = null) {
        this.addStep(new FweenStepValueTo(this.targetGet, this.targetSet, value, duration, this.getTransition(transition)));
        return this;
    }
}
class FweenObjectSequence extends FweenSequence {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor(object) {
        super();
        this.targetObject = object;
    }
}
// Common steps
class FweenStepCall {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor(func) {
        this.action = func;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    start() { }
    update(t) { }
    end() {
        this.action();
    }
    getDuration() {
        return 0;
    }
}
// Steps for specific sequences: GetterSetter
class FweenStepValueFrom {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor(targetSet, targetValue) {
        this.targetSet = targetSet;
        this.targetValue = targetValue;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    start() { }
    update(t) { }
    end() {
        this.targetSet(this.targetValue);
    }
    getDuration() {
        return 0;
    }
}
class FweenStepValueTo {
    constructor(targetGet, targetSet, targetValue, duration, transition) {
        this.targetGet = targetGet;
        this.targetSet = targetSet;
        this.duration = duration;
        this.targetValue = targetValue;
        this.transition = transition;
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    start() {
        this.startValue = this.targetGet();
    }
    update(t) {
        this.targetSet(MathUtils.map(this.transition(t), 0, 1, this.startValue, this.targetValue));
    }
    end() {
        this.targetSet(this.targetValue);
    }
    getDuration() {
        return this.duration;
    }
}
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
export class FweenTicker {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor() {
        // Ticker class to control updates
        // Properties
        this.sequences = [];
        this.time = 0.0;
        this.updateBound = this.update.bind(this);
        this.updateBound();
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    update() {
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
    }
    getTime() {
        return this.time;
    }
    add(sequence) {
        this.sequences.push(sequence);
    }
    remove(sequence) {
        // Nullify first, remove later - otherwise it gets remove while doing Update(), which can cause the list to trip on itself
        var idx = this.sequences.indexOf(sequence);
        if (idx > -1)
            this.sequences[idx] = null;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zaXRpb25zL0Z3ZWVuLnRzIl0sIm5hbWVzIjpbIkZ3ZWVuIiwiRndlZW4udXNlIiwiRndlZW4uZ2V0VGlja2VyIiwiRndlZW5TdGVwTWV0YWRhdGEiLCJGd2VlblN0ZXBNZXRhZGF0YS5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcE1ldGFkYXRhLnRpbWVEdXJhdGlvbiIsIkZ3ZWVuU2VxdWVuY2UiLCJGd2VlblNlcXVlbmNlLmNvbnN0cnVjdG9yIiwiRndlZW5TZXF1ZW5jZS5wbGF5IiwiRndlZW5TZXF1ZW5jZS5wYXVzZSIsIkZ3ZWVuU2VxdWVuY2UuY2FsbCIsIkZ3ZWVuU2VxdWVuY2Uud2FpdCIsIkZ3ZWVuU2VxdWVuY2UuYWRkU3RlcCIsIkZ3ZWVuU2VxdWVuY2UudXBkYXRlIiwiRndlZW5TZXF1ZW5jZS5nZXRUcmFuc2l0aW9uIiwiRndlZW5TZXF1ZW5jZS5kZXN0cm95IiwiRndlZW5HZXR0ZXJTZXR0ZXJTZXF1ZW5jZSIsIkZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2UuY29uc3RydWN0b3IiLCJGd2VlbkdldHRlclNldHRlclNlcXVlbmNlLmZyb20iLCJGd2VlbkdldHRlclNldHRlclNlcXVlbmNlLnRvIiwiRndlZW5PYmplY3RTZXF1ZW5jZSIsIkZ3ZWVuT2JqZWN0U2VxdWVuY2UuY29uc3RydWN0b3IiLCJGd2VlblN0ZXBDYWxsIiwiRndlZW5TdGVwQ2FsbC5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcENhbGwuc3RhcnQiLCJGd2VlblN0ZXBDYWxsLnVwZGF0ZSIsIkZ3ZWVuU3RlcENhbGwuZW5kIiwiRndlZW5TdGVwQ2FsbC5nZXREdXJhdGlvbiIsIkZ3ZWVuU3RlcFZhbHVlRnJvbSIsIkZ3ZWVuU3RlcFZhbHVlRnJvbS5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcFZhbHVlRnJvbS5zdGFydCIsIkZ3ZWVuU3RlcFZhbHVlRnJvbS51cGRhdGUiLCJGd2VlblN0ZXBWYWx1ZUZyb20uZW5kIiwiRndlZW5TdGVwVmFsdWVGcm9tLmdldER1cmF0aW9uIiwiRndlZW5TdGVwVmFsdWVUbyIsIkZ3ZWVuU3RlcFZhbHVlVG8uY29uc3RydWN0b3IiLCJGd2VlblN0ZXBWYWx1ZVRvLnN0YXJ0IiwiRndlZW5TdGVwVmFsdWVUby51cGRhdGUiLCJGd2VlblN0ZXBWYWx1ZVRvLmVuZCIsIkZ3ZWVuU3RlcFZhbHVlVG8uZ2V0RHVyYXRpb24iLCJGd2VlblRpY2tlciIsIkZ3ZWVuVGlja2VyLmNvbnN0cnVjdG9yIiwiRndlZW5UaWNrZXIudXBkYXRlIiwiRndlZW5UaWNrZXIuZ2V0VGltZSIsIkZ3ZWVuVGlja2VyLmFkZCIsIkZ3ZWVuVGlja2VyLnJlbW92ZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUdILE9BQU8sTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUM5QixPQUFPLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3QyxBQWNBOzs7Ozs7OztHQU5HO0FBRUgsK0VBQStFO0FBRS9FLHlFQUF5RTs7SUFjeEVBLE9BQWNBLEdBQUdBLENBQUNBLE9BQVdBLEVBQUVBLE9BQVlBO1FBQzFDQyxFQUFFQSxDQUFDQSxDQUFDQSxPQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqQ0EsQUFDQUEsU0FEU0E7WUFDVEEsTUFBTUEsQ0FBQ0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUN6Q0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsVUFBVUEsSUFBSUEsT0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0VBLEFBQ0FBLGdCQURnQkE7WUFDaEJBLE1BQU1BLENBQUNBLElBQUlBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDeERBLENBQUNBO1FBRURBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLDBDQUEwQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRURELE9BQWNBLFNBQVNBO1FBQ3RCRSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNsREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0FBQ0ZGLENBQUNBO0FBM0JBLHFDQUFxQztBQUN0QixZQUFNLEdBQWUsSUFBSSxDQTBCeEM7QUFFRCxBQVFBLHVHQVJ1RztBQUN2RywrQ0FBK0M7QUFFL0MsbUhBQW1IO0FBQ25ILG1IQUFtSDtBQUVuSCxjQUFjOztJQVliRyxtSEFBbUhBO0lBQ25IQSxtSEFBbUhBO0lBRW5IQTtRQVhBQyxzRUFBc0VBO1FBRXRFQSxhQUFhQTtRQUNOQSxlQUFVQSxHQUFXQSxLQUFLQSxDQUFDQTtRQUMzQkEsaUJBQVlBLEdBQVdBLEtBQUtBLENBQUNBO1FBQzdCQSxjQUFTQSxHQUFVQSxHQUFHQSxDQUFDQTtRQUN2QkEsWUFBT0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFNMUJBLENBQUNBO0lBRURELG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFbkhBLElBQVdBLFlBQVlBO1FBQ3RCRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtJQUN0Q0EsQ0FBQ0E7QUFDRkYsQ0FBQ0E7QUFTRDtJQWdCQ0csbUhBQW1IQTtJQUNuSEEsbUhBQW1IQTtJQUVuSEE7UUFqQkFDLHdCQUF3QkE7UUFFeEJBLGFBQWFBO1FBQ0xBLFVBQUtBLEdBQXFCQSxFQUFFQSxDQUFDQTtRQUM3QkEsbUJBQWNBLEdBQTRCQSxFQUFFQSxDQUFDQTtRQUU3Q0EsY0FBU0EsR0FBV0EsS0FBS0EsQ0FBQ0E7UUFDMUJBLGdCQUFXQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUN2QkEsY0FBU0EsR0FBVUEsR0FBR0EsQ0FBQ0E7UUFDdkJBLGNBQVNBLEdBQVVBLEdBQUdBLENBQUNBO1FBQ3ZCQSxpQkFBWUEsR0FBVUEsR0FBR0EsQ0FBQ0E7UUFDMUJBLGFBQVFBLEdBQVVBLEdBQUdBLENBQUNBO1FBTzdCQSxBQUNBQSxxQkFEcUJBO1FBQ3JCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtRQUU3Q0EsQUFDQUEsY0FEY0E7UUFDZEEsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDN0JBLENBQUNBO0lBR0RELG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFbkhBLHVCQUF1QkE7SUFFdkJBOztPQUVHQTtJQUNJQSxJQUFJQTtRQUNWRSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDdEJBLElBQUlBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBLE9BQU9BLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1lBQzlEQSxJQUFJQSxDQUFDQSxTQUFTQSxJQUFJQSxVQUFVQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7UUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFREY7O09BRUdBO0lBQ0lBLEtBQUtBO1FBQ1hHLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3BCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDOUNBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRURILGtCQUFrQkE7SUFFbEJBOztPQUVHQTtJQUNJQSxJQUFJQSxDQUFDQSxJQUFhQTtRQUN4QkksSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRURKOztPQUVHQTtJQUNJQSxJQUFJQSxDQUFDQSxRQUFlQTtRQUMxQkssSUFBSUEsQ0FBQ0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDL0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBR0RMLG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFbkhBLHdEQUF3REE7SUFFOUNBLE9BQU9BLENBQUNBLElBQWVBO1FBQ2hDTSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUV0QkEsSUFBSUEsYUFBYUEsR0FBR0EsSUFBSUEsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUM1Q0EsYUFBYUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDekRBLElBQUlBLENBQUNBLFFBQVFBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3BDQSxhQUFhQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUV2REEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7SUFDekNBLENBQUNBO0lBRU1OLE1BQU1BO1FBQ1pPLDJDQUEyQ0E7UUFFM0NBLEFBQ0FBLG9CQURvQkE7UUFDcEJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQzNDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFBQTtRQUNmQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNQQSxJQUFJQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1lBRXRDQSxPQUFPQSxnQkFBZ0JBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO2dCQUNqRUEsZ0JBQWdCQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFFekJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO29CQUNwRkEsQUFDQUEsNENBRDRDQTtvQkFDNUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO3dCQUN2REEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7d0JBQ3JDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFDekRBLENBQUNBO29CQUVEQSxBQUNBQSxnQ0FEZ0NBO29CQUNoQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsT0FBT0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRTVMQSxBQUNBQSx5QkFEeUJBO29CQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2xGQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDekRBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBOzRCQUNuQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQzFEQSxJQUFJQSxDQUFDQSxZQUFZQSxJQUFJQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQTs0QkFDeEVBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ3hCQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTt3QkFDcEJBLENBQUNBO29CQUNGQSxDQUFDQTtnQkFDRkEsQ0FBQ0E7WUFDRkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFU1AsYUFBYUEsQ0FBQ0EsVUFBVUE7UUFDakNRLE1BQU1BLENBQUNBLFVBQVVBLElBQUlBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLEdBQUdBLFVBQVVBLENBQUNBO0lBQ3REQSxDQUFDQTtJQUVPUixPQUFPQTtRQUNkUyxLQUFLQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUNoQ0EsQ0FBQ0E7QUFDRlQsQ0FBQ0E7QUFFRCx3Q0FBd0MsYUFBYTtJQVNwRFUsbUhBQW1IQTtJQUNuSEEsbUhBQW1IQTtJQUVuSEEsWUFBWUEsU0FBc0JBLEVBQUVBLFNBQWdDQTtRQUNuRUMsT0FBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBO0lBQzVCQSxDQUFDQTtJQUdERCxtSEFBbUhBO0lBQ25IQSxtSEFBbUhBO0lBRTVHQSxJQUFJQSxDQUFDQSxLQUFZQTtRQUN2QkUsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsa0JBQWtCQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM1REEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFTUYsRUFBRUEsQ0FBQ0EsS0FBWUEsRUFBRUEsUUFBUUEsR0FBVUEsQ0FBQ0EsRUFBRUEsVUFBVUEsR0FBd0JBLElBQUlBO1FBQ2xGRyxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLEtBQUtBLEVBQUVBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3BIQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtBQUNGSCxDQUFDQTtBQUVELGtDQUFrQyxhQUFhO0lBUTlDSSxtSEFBbUhBO0lBQ25IQSxtSEFBbUhBO0lBRW5IQSxZQUFZQSxNQUFhQTtRQUN4QkMsT0FBT0EsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsTUFBTUEsQ0FBQ0E7SUFDNUJBLENBQUNBO0FBV0ZELENBQUNBO0FBRUQsQUFFQSxlQUZlOztJQVFkRSxtSEFBbUhBO0lBQ25IQSxtSEFBbUhBO0lBRW5IQSxZQUFZQSxJQUFhQTtRQUN4QkMsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBR0RELG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFNUdBLEtBQUtBLEtBQVVFLENBQUNBO0lBRWhCRixNQUFNQSxDQUFDQSxDQUFRQSxJQUFTRyxDQUFDQTtJQUV6QkgsR0FBR0E7UUFDVEksSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7SUFDZkEsQ0FBQ0E7SUFFTUosV0FBV0E7UUFDakJLLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO0lBQ1ZBLENBQUNBO0FBQ0ZMLENBQUNBO0FBRUQsQUFFQSw2Q0FGNkM7O0lBVzVDTSxtSEFBbUhBO0lBQ25IQSxtSEFBbUhBO0lBRW5IQSxZQUFZQSxTQUFnQ0EsRUFBRUEsV0FBa0JBO1FBQy9EQyxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsV0FBV0EsQ0FBQ0E7SUFDaENBLENBQUNBO0lBR0RELG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFNUdBLEtBQUtBLEtBQVVFLENBQUNBO0lBRWhCRixNQUFNQSxDQUFDQSxDQUFRQSxJQUFTRyxDQUFDQTtJQUV6QkgsR0FBR0E7UUFDVEksSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7SUFDbENBLENBQUNBO0lBRU1KLFdBQVdBO1FBQ2pCSyxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNWQSxDQUFDQTtBQUNGTCxDQUFDQTtBQUVEO0lBWUNNLFlBQVlBLFNBQXNCQSxFQUFFQSxTQUFnQ0EsRUFBRUEsV0FBa0JBLEVBQUVBLFFBQWVBLEVBQUVBLFVBQStCQTtRQUN6SUMsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUN6QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsV0FBV0EsQ0FBQ0E7UUFDL0JBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLFVBQVVBLENBQUNBO0lBQzlCQSxDQUFDQTtJQUVERCxtSEFBbUhBO0lBQ25IQSxtSEFBbUhBO0lBRTVHQSxLQUFLQTtRQUNYRSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFFTUYsTUFBTUEsQ0FBQ0EsQ0FBUUE7UUFDckJHLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO0lBQzVGQSxDQUFDQTtJQUVNSCxHQUFHQTtRQUNUSSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtJQUNsQ0EsQ0FBQ0E7SUFFTUosV0FBV0E7UUFDakJLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO0lBQ3RCQSxDQUFDQTtBQUNGTCxDQUFDQTtBQUVELEFBa0pBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUhFOztJQWFETSxtSEFBbUhBO0lBQ25IQSxtSEFBbUhBO0lBRW5IQTtRQVhBQyxrQ0FBa0NBO1FBRWxDQSxhQUFhQTtRQUNMQSxjQUFTQSxHQUF3QkEsRUFBRUEsQ0FBQ0E7UUFDcENBLFNBQUlBLEdBQVVBLEdBQUdBLENBQUNBO1FBUXpCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBR0RELG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFM0dBLE1BQU1BO1FBQ2JFLE1BQU1BLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7UUFFL0NBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBO1FBRTlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNoREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9CQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUM1QkEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1QkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFTUYsT0FBT0E7UUFDYkcsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRU1ILEdBQUdBLENBQUNBLFFBQXNCQTtRQUNoQ0ksSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7SUFDL0JBLENBQUNBO0lBRU1KLE1BQU1BLENBQUNBLFFBQXNCQTtRQUNuQ0ssQUFDQUEsMEhBRDBIQTtZQUN0SEEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDM0NBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO0lBQzFDQSxDQUFDQTtBQUNGTCxDQUFDQTtBQUFBIiwiZmlsZSI6InRyYW5zaXRpb25zL0Z3ZWVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBhdXRob3JcdFplaCBGZXJuYW5kb1xyXG4gKiBAdmVyc2lvblx0MS4wXHJcbiAqIEBzaW5jZVx0MjAxNS0wOC0wM1xyXG4gKi9cclxuXHJcbmltcG9ydCBTaW1wbGVTaWduYWwgZnJvbSAnLi8uLi9zaWduYWxzL1NpbXBsZVNpZ25hbCc7XHJcbmltcG9ydCBFYXNpbmcgZnJvbSAnLi9FYXNpbmcnO1xyXG5pbXBvcnQgTWF0aFV0aWxzIGZyb20gJy4vLi4vdXRpbHMvTWF0aFV0aWxzJztcclxuXHJcbi8qXHJcbiBJZGVhcyBmb3IgdHdlZW5pbmcgLSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS96ZWgvdW5pdHktdGlkYml0cy9ibG9iL21hc3Rlci90cmFuc2l0aW9ucy9aVHdlZW4uY3NcclxuXHJcbiBaVHdlZW4udXNlKG9iailcclxuIC50byhvLCB0LCB0cmFuc2l0aW9uKVxyXG4gLmNhbGwoZilcclxuIC53YWl0KHQpXHJcbiAudXNlKGdldHRlciwgc2V0dGVyPylcclxuICovXHJcblxyXG4vLyBUT0RPOiB0aGlzIGxpYnJhcnkgaGFzIC50aW1lLCAuZHVyYXRpb24sIGFuZCAuZ2V0RHVyYXRpb24oKS4gTWFrZSB5b3VyIG1pbmQhXHJcblxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemVoL3VuaXR5LXRpZGJpdHMvYmxvYi9tYXN0ZXIvdHJhbnNpdGlvbnMvWlR3ZWVuLmNzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGd2VlbiB7XHJcblx0XHJcblx0Ly8gTWFpbiBjbGFzcyAtIGp1c3QgYSBzdGFydGluZyBwb2ludFxyXG5cdHByaXZhdGUgc3RhdGljIHRpY2tlcjpGd2VlblRpY2tlciA9IG51bGw7XHJcblx0XHJcblx0Ly8gUHJvcGVydGllc1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIFNUQVRJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFxyXG5cdHB1YmxpYyBzdGF0aWMgdXNlKG9iamVjdDE6KCk9Pm51bWJlciwgb2JqZWN0MjoodjpudW1iZXIpID0+IHZvaWQpOkZ3ZWVuU2VxdWVuY2U7XHJcblx0cHVibGljIHN0YXRpYyB1c2Uob2JqZWN0MTpPYmplY3QpOkZ3ZWVuU2VxdWVuY2U7XHJcblx0cHVibGljIHN0YXRpYyB1c2Uob2JqZWN0MTphbnksIG9iamVjdDI/OmFueSk6RndlZW5TZXF1ZW5jZSB7XHJcblx0XHRpZiAodHlwZW9mKG9iamVjdDEpID09IFwib2JqZWN0XCIpIHtcclxuXHRcdFx0Ly8gT2JqZWN0XHJcblx0XHRcdHJldHVybiBuZXcgRndlZW5PYmplY3RTZXF1ZW5jZShvYmplY3QxKTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mKG9iamVjdDEpID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Yob2JqZWN0MikgPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdC8vIEdldHRlci9zZXR0ZXJcclxuXHRcdFx0cmV0dXJuIG5ldyBGd2VlbkdldHRlclNldHRlclNlcXVlbmNlKG9iamVjdDEsIG9iamVjdDIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnNvbGUuZXJyb3IoXCJUd2VlbmluZyBwYXJhbWV0ZXJzIHdlcmUgbm90IHVuZGVyc3Rvb2QuXCIpO1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGdldFRpY2tlcigpOkZ3ZWVuVGlja2VyIHtcclxuXHRcdGlmICghdGhpcy50aWNrZXIpIHRoaXMudGlja2VyID0gbmV3IEZ3ZWVuVGlja2VyKCk7XHJcblx0XHRyZXR1cm4gdGhpcy50aWNrZXI7XHJcblx0fVxyXG59XHJcblxyXG4vLyBDcmVhdGUgYSBnbG9iYWwgb2JqZWN0IHdpdGggdGhlIGNsYXNzIC0gb25seSB1c2VkIGluIHRoZSBzaW5nbGUgZmlsZSB2ZXJzaW9uLCByZXBsYWNlZCBhdCBidWlsZCB0aW1lXHJcbi8vICNJRkRFRiBFUzVTSU5HTEUgLy8gd2luZG93W1wiRndlZW5cIl0gPSBGd2VlbjtcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gSU5URVJOQUwgQ0xBU1NFUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLy8gQXV4IGNsYXNzZXNcclxuXHJcbmNsYXNzIEZ3ZWVuU3RlcE1ldGFkYXRhIHtcclxuXHRcclxuXHQvLyBDbGFzcyB0byBtYWludGFpbiBtZXRhZGF0YSByZWxhdGVkIHRvIGVhY2ggc3RlcCBvZiBhIEZ3ZWVuIHNlcXVlbmNlXHJcblx0XHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHB1YmxpYyBoYXNTdGFydGVkOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgaGFzQ29tcGxldGVkOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgdGltZVN0YXJ0Om51bWJlciA9IDAuMDtcclxuXHRwdWJsaWMgdGltZUVuZDpudW1iZXIgPSAwO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBQ0NFU1NPUiBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBnZXQgdGltZUR1cmF0aW9uKCk6bnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLnRpbWVFbmQgLSB0aGlzLnRpbWVTdGFydDtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUZ3ZWVuU3RlcCB7XHJcblx0c3RhcnQoKTp2b2lkO1xyXG5cdHVwZGF0ZSh0Om51bWJlcik6dm9pZDtcclxuXHRlbmQoKTp2b2lkO1xyXG5cdGdldER1cmF0aW9uKCk6bnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRndlZW5TZXF1ZW5jZSB7XHJcblx0XHJcblx0Ly8gT25lIHNlcXVlbmNlIG9mIHN0ZXBzXHJcblx0XHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgc3RlcHM6QXJyYXk8SUZ3ZWVuU3RlcD4gPSBbXTtcclxuXHRwcml2YXRlIHN0ZXBzTWV0YWRhdGFzOkFycmF5PEZ3ZWVuU3RlcE1ldGFkYXRhPiA9IFtdO1xyXG5cclxuXHRwcml2YXRlIGlzUGxheWluZzpib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBjdXJyZW50U3RlcDpudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgc3RhcnRUaW1lOm51bWJlciA9IDAuMDtcclxuXHRwcml2YXRlIHBhdXNlVGltZTpudW1iZXIgPSAwLjA7XHJcblx0cHJpdmF0ZSBleGVjdXRlZFRpbWU6bnVtYmVyID0gMC4wO1xyXG5cdHByaXZhdGUgZHVyYXRpb246bnVtYmVyID0gMC4wO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHQvLyBDcmVhdGUgYSBuZXcgRndlZW5cclxuXHRcdHRoaXMuc3RhcnRUaW1lID0gRndlZW4uZ2V0VGlja2VyKCkuZ2V0VGltZSgpO1xyXG5cclxuXHRcdC8vIEFkZCB0byBsaXN0XHJcblx0XHRGd2Vlbi5nZXRUaWNrZXIoKS5hZGQodGhpcyk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Ly8gUGxheSBjb250cm9sIG1ldGhvZHNcclxuXHJcblx0LyoqXHJcblx0ICogUGxheSAob3IgcmVzdW1lKSB0aGUgc2VxdWVuY2VcclxuXHQgKi9cclxuXHRwdWJsaWMgcGxheSgpOkZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFx0aWYgKCF0aGlzLmlzUGxheWluZykge1xyXG5cdFx0XHR0aGlzLmlzUGxheWluZyA9IHRydWU7XHJcblx0XHRcdGxldCB0aW1lUGF1c2VkID0gRndlZW4uZ2V0VGlja2VyKCkuZ2V0VGltZSgpIC0gdGhpcy5wYXVzZVRpbWU7XHJcblx0XHRcdHRoaXMuc3RhcnRUaW1lICs9IHRpbWVQYXVzZWQ7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFBhdXNlIHRoZSBzZXF1ZW5jZVxyXG5cdCAqL1xyXG5cdHB1YmxpYyBwYXVzZSgpOkZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFx0aWYgKHRoaXMuaXNQbGF5aW5nKSB7XHJcblx0XHRcdHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XHJcblx0XHRcdHRoaXMucGF1c2VUaW1lID0gRndlZW4uZ2V0VGlja2VyKCkuZ2V0VGltZSgpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHQvLyBVdGlsaXR5IG1ldGhvZHNcclxuXHJcblx0LyoqXHJcblx0ICogQ2FsbCBhIGZ1bmN0aW9uXHJcblx0ICovXHJcblx0cHVibGljIGNhbGwoZnVuYzpGdW5jdGlvbik6RndlZW5TZXF1ZW5jZSB7XHJcblx0XHR0aGlzLmFkZFN0ZXAobmV3IEZ3ZWVuU3RlcENhbGwoZnVuYykpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBXYWl0IGEgbnVtYmVyIG9mIHNlY29uZHNcclxuXHQgKi9cclxuXHRwdWJsaWMgd2FpdChkdXJhdGlvbjpudW1iZXIpOkZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFx0dGhpcy5kdXJhdGlvbiArPSB0aGlzLmR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBSSVZBVEUgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Ly8gQ29yZSB0d2VlbiBzdGVwIGNvbnRyb2wgbWV0aG9kczsgcmV1c2VkIGJ5IHN1YmNsYXNzZXNcclxuXHJcblx0cHJvdGVjdGVkIGFkZFN0ZXAoc3RlcDpJRndlZW5TdGVwKTp2b2lkIHtcclxuXHRcdHRoaXMuc3RlcHMucHVzaChzdGVwKTtcclxuXHJcblx0XHRsZXQgdHdlZW5NZXRhZGF0YSA9IG5ldyBGd2VlblN0ZXBNZXRhZGF0YSgpO1xyXG5cdFx0dHdlZW5NZXRhZGF0YS50aW1lU3RhcnQgPSB0aGlzLnN0YXJ0VGltZSArIHRoaXMuZHVyYXRpb247XHJcblx0XHR0aGlzLmR1cmF0aW9uICs9IHN0ZXAuZ2V0RHVyYXRpb24oKTtcclxuXHRcdHR3ZWVuTWV0YWRhdGEudGltZUVuZCA9IHRoaXMuc3RhcnRUaW1lICsgdGhpcy5kdXJhdGlvbjtcclxuXHJcblx0XHR0aGlzLnN0ZXBzTWV0YWRhdGFzLnB1c2godHdlZW5NZXRhZGF0YSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlKCk6dm9pZCB7XHJcblx0XHQvLyBVcGRhdGUgY3VycmVudCBzdGVwKHMpIGJhc2VkIG9uIHRoZSB0aW1lXHJcblxyXG5cdFx0Ly8gQ2hlY2sgaWYgZmluaXNoZWRcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRTdGVwID49IHRoaXMuc3RlcHMubGVuZ3RoKSB7XHJcblx0XHRcdHRoaXMuZGVzdHJveSgpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgc2hvdWxkVXBkYXRlT25jZSA9IHRoaXMuaXNQbGF5aW5nO1xyXG5cclxuXHRcdFx0d2hpbGUgKHNob3VsZFVwZGF0ZU9uY2UgJiYgdGhpcy5jdXJyZW50U3RlcCA8IHRoaXMuc3RlcHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0c2hvdWxkVXBkYXRlT25jZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZiAoRndlZW4uZ2V0VGlja2VyKCkuZ2V0VGltZSgpID49IHRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0udGltZVN0YXJ0KSB7XHJcblx0XHRcdFx0XHQvLyBTdGFydCB0aGUgY3VycmVudCB0d2VlbiBzdGVwIGlmIG5lY2Vzc2FyeVxyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLmhhc1N0YXJ0ZWQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdGVwc1t0aGlzLmN1cnJlbnRTdGVwXS5zdGFydCgpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLmhhc1N0YXJ0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgY3VycmVudCB0d2VlbiBzdGVwXHJcblx0XHRcdFx0XHR0aGlzLnN0ZXBzW3RoaXMuY3VycmVudFN0ZXBdLnVwZGF0ZShNYXRoVXRpbHMubWFwKEZ3ZWVuLmdldFRpY2tlcigpLmdldFRpbWUoKSwgdGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS50aW1lU3RhcnQsIHRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0udGltZUVuZCwgMCwgMSwgdHJ1ZSkpO1xyXG5cclxuXHRcdFx0XHRcdC8vIENoZWNrIGlmIGl0J3MgZmluaXNoZWRcclxuXHRcdFx0XHRcdGlmIChGd2Vlbi5nZXRUaWNrZXIoKS5nZXRUaW1lKCkgPj0gdGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS50aW1lRW5kKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS5oYXNDb21wbGV0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0ZXBzW3RoaXMuY3VycmVudFN0ZXBdLmVuZCgpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0uaGFzQ29tcGxldGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmV4ZWN1dGVkVGltZSArPSB0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLnRpbWVEdXJhdGlvbjtcclxuXHRcdFx0XHRcdFx0XHRzaG91bGRVcGRhdGVPbmNlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN1cnJlbnRTdGVwKys7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBnZXRUcmFuc2l0aW9uKHRyYW5zaXRpb24pOih0Om51bWJlcikgPT4gbnVtYmVyIHtcclxuXHRcdHJldHVybiB0cmFuc2l0aW9uID09IG51bGwgPyBFYXNpbmcubm9uZSA6IHRyYW5zaXRpb247XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGRlc3Ryb3koKTp2b2lkIHtcclxuXHRcdEZ3ZWVuLmdldFRpY2tlcigpLnJlbW92ZSh0aGlzKTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIEZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2UgZXh0ZW5kcyBGd2VlblNlcXVlbmNlIHtcclxuXHRcclxuXHQvLyBBIHNlcXVlbmNlIGZvciBnZXR0ZXIvc2V0dGVyIHBhaXJzXHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIHRhcmdldEdldDooKSA9PiBudW1iZXI7XHJcblx0cHJpdmF0ZSB0YXJnZXRTZXQ6KHZhbHVlOm51bWJlcikgPT4gdm9pZDtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNvbnN0cnVjdG9yKHRhcmdldEdldDooKSA9PiBudW1iZXIsIHRhcmdldFNldDoodmFsdWU6bnVtYmVyKSA9PiB2b2lkKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMudGFyZ2V0R2V0ID0gdGFyZ2V0R2V0O1xyXG5cdFx0dGhpcy50YXJnZXRTZXQgPSB0YXJnZXRTZXQ7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIGZyb20odmFsdWU6bnVtYmVyKTpGd2VlbkdldHRlclNldHRlclNlcXVlbmNlIHtcclxuXHRcdHRoaXMuYWRkU3RlcChuZXcgRndlZW5TdGVwVmFsdWVGcm9tKHRoaXMudGFyZ2V0U2V0LCB2YWx1ZSkpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdG8odmFsdWU6bnVtYmVyLCBkdXJhdGlvbjpudW1iZXIgPSAwLCB0cmFuc2l0aW9uOih0Om51bWJlcikgPT4gbnVtYmVyID0gbnVsbCk6RndlZW5HZXR0ZXJTZXR0ZXJTZXF1ZW5jZSB7XHJcblx0XHR0aGlzLmFkZFN0ZXAobmV3IEZ3ZWVuU3RlcFZhbHVlVG8odGhpcy50YXJnZXRHZXQsIHRoaXMudGFyZ2V0U2V0LCB2YWx1ZSwgZHVyYXRpb24sIHRoaXMuZ2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uKSkpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBGd2Vlbk9iamVjdFNlcXVlbmNlIGV4dGVuZHMgRndlZW5TZXF1ZW5jZSB7XHJcblx0XHJcblx0Ly8gQSBzZXF1ZW5jZSBmb3IgY29tbW9uIG9iamVjdHMnIHByb3BlcnRpZXNcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgdGFyZ2V0T2JqZWN0Ok9iamVjdDtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHJcblx0Y29uc3RydWN0b3Iob2JqZWN0Ok9iamVjdCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLnRhcmdldE9iamVjdCA9IG9iamVjdDtcclxuXHR9XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdC8qXHJcblx0IHB1YmxpYyBaVHdlZW5HYW1lT2JqZWN0U2VxdWVuY2Ugc2NhbGVGcm9tKFZlY3RvcjMgc2NhbGUpIHtcclxuXHQgYWRkU3RlcChuZXcgWlR3ZWVuU3RlcFNjYWxlRnJvbSh0YXJnZXRHYW1lT2JqZWN0LCBzY2FsZSkpO1xyXG5cdCByZXR1cm4gdGhpcztcclxuXHQgfVxyXG5cdCAqL1xyXG59XHJcblxyXG4vLyBDb21tb24gc3RlcHNcclxuXHJcbmNsYXNzIEZ3ZWVuU3RlcENhbGwge1xyXG5cclxuXHQvLyBBIHN0ZXAgdG8gY2FsbCBhIGZ1bmN0aW9uXHJcblx0cHJpdmF0ZSBhY3Rpb246RnVuY3Rpb247XHRcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNvbnN0cnVjdG9yKGZ1bmM6RnVuY3Rpb24pIHtcclxuXHRcdHRoaXMuYWN0aW9uID0gZnVuYztcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgc3RhcnQoKTp2b2lkIHsgfVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlKHQ6bnVtYmVyKTp2b2lkIHsgfVxyXG5cclxuXHRwdWJsaWMgZW5kKCk6dm9pZCB7XHJcblx0XHR0aGlzLmFjdGlvbigpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldER1cmF0aW9uKCk6bnVtYmVyIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuLy8gU3RlcHMgZm9yIHNwZWNpZmljIHNlcXVlbmNlczogR2V0dGVyU2V0dGVyXHJcblxyXG5jbGFzcyBGd2VlblN0ZXBWYWx1ZUZyb20ge1xyXG5cclxuXHQvLyBBIHN0ZXAgdG8gc2V0IHRoZSBzdGFydGluZyB2YWx1ZVxyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSB0YXJnZXRTZXQ6KHZhbHVlOm51bWJlcikgPT4gdm9pZDtcclxuXHRwcml2YXRlIHRhcmdldFZhbHVlOm51bWJlcjtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNvbnN0cnVjdG9yKHRhcmdldFNldDoodmFsdWU6bnVtYmVyKSA9PiB2b2lkLCB0YXJnZXRWYWx1ZTpudW1iZXIpIHtcclxuXHRcdHRoaXMudGFyZ2V0U2V0ID0gdGFyZ2V0U2V0O1xyXG5cdFx0dGhpcy50YXJnZXRWYWx1ZSA9IHRhcmdldFZhbHVlO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBzdGFydCgpOnZvaWQgeyB9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGUodDpudW1iZXIpOnZvaWQgeyB9XHJcblxyXG5cdHB1YmxpYyBlbmQoKTp2b2lkIHtcclxuXHRcdHRoaXMudGFyZ2V0U2V0KHRoaXMudGFyZ2V0VmFsdWUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldER1cmF0aW9uKCk6bnVtYmVyIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgRndlZW5TdGVwVmFsdWVUbyB7XHJcblxyXG5cdC8vIEEgc3RlcCB0byB0d2VlbiB0byBhIHZhbHVlXHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIHRhcmdldEdldDooKSA9PiBudW1iZXI7XHJcblx0cHJpdmF0ZSB0YXJnZXRTZXQ6KHZhbHVlOm51bWJlcikgPT4gdm9pZDtcclxuXHRwcml2YXRlIGR1cmF0aW9uOm51bWJlcjtcclxuXHRwcml2YXRlIHN0YXJ0VmFsdWU6bnVtYmVyO1xyXG5cdHByaXZhdGUgdGFyZ2V0VmFsdWU6bnVtYmVyO1xyXG5cdHByaXZhdGUgdHJhbnNpdGlvbjoodDpudW1iZXIpID0+IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IodGFyZ2V0R2V0OigpID0+IG51bWJlciwgdGFyZ2V0U2V0Oih2YWx1ZTpudW1iZXIpID0+IHZvaWQsIHRhcmdldFZhbHVlOm51bWJlciwgZHVyYXRpb246bnVtYmVyLCB0cmFuc2l0aW9uOih0Om51bWJlcikgPT4gbnVtYmVyKSB7XHJcblx0XHR0aGlzLnRhcmdldEdldCA9IHRhcmdldEdldDtcclxuXHRcdHRoaXMudGFyZ2V0U2V0ID0gdGFyZ2V0U2V0O1xyXG5cdFx0dGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0dGhpcy50YXJnZXRWYWx1ZSA9IHRhcmdldFZhbHVlO1xyXG5cdFx0dGhpcy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHR9XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBzdGFydCgpOnZvaWQge1xyXG5cdFx0dGhpcy5zdGFydFZhbHVlID0gdGhpcy50YXJnZXRHZXQoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGUodDpudW1iZXIpOnZvaWQge1xyXG5cdFx0dGhpcy50YXJnZXRTZXQoTWF0aFV0aWxzLm1hcCh0aGlzLnRyYW5zaXRpb24odCksIDAsIDEsIHRoaXMuc3RhcnRWYWx1ZSwgdGhpcy50YXJnZXRWYWx1ZSkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGVuZCgpOnZvaWQge1xyXG5cdFx0dGhpcy50YXJnZXRTZXQodGhpcy50YXJnZXRWYWx1ZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0RHVyYXRpb24oKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuZHVyYXRpb247XHJcblx0fVxyXG59XHJcblxyXG4vKlxyXG4vLyBTdGVwcyBmb3IgR2FtZU9iamVjdCBzZXF1ZW5jZXNcclxuXHJcbmNsYXNzIFpUd2VlblN0ZXBTY2FsZUZyb206SVpUd2VlblN0ZXAge1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBHYW1lT2JqZWN0IHRhcmdldDtcclxuXHRwcml2YXRlIFZlY3RvcjMgdGFyZ2V0VmFsdWU7XHJcblxyXG5cdC8vIEV4dGVuc2lvbiBmdW5jdGlvbnNcclxuXHRwdWJsaWMgWlR3ZWVuU3RlcFNjYWxlRnJvbShHYW1lT2JqZWN0IHRhcmdldCwgVmVjdG9yMyB0YXJnZXRWYWx1ZSkge1xyXG5cdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR0aGlzLnRhcmdldFZhbHVlID0gdGFyZ2V0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCBzdGFydCgpIHsgfVxyXG5cclxuXHRwdWJsaWMgdm9pZCB1cGRhdGUoZmxvYXQgdCkgeyB9XHJcblxyXG5cdHB1YmxpYyB2b2lkIGVuZCgpIHtcclxuXHRcdHRhcmdldC50cmFuc2Zvcm0ubG9jYWxTY2FsZSA9IHRhcmdldFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGZsb2F0IGdldER1cmF0aW9uKCkge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBaVHdlZW5TdGVwU2NhbGVUbzpJWlR3ZWVuU3RlcCB7XHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIEdhbWVPYmplY3QgdGFyZ2V0O1xyXG5cdHByaXZhdGUgZmxvYXQgZHVyYXRpb247XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHN0YXJ0VmFsdWU7XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHRhcmdldFZhbHVlO1xyXG5cdHByaXZhdGUgVmVjdG9yMyB0ZW1wVmFsdWU7XHJcblx0cHJpdmF0ZSBGdW5jPGZsb2F0LCBmbG9hdD4gdHJhbnNpdGlvbjtcclxuXHJcblx0Ly8gRXh0ZW5zaW9uIGZ1bmN0aW9uc1xyXG5cdHB1YmxpYyBaVHdlZW5TdGVwU2NhbGVUbyhHYW1lT2JqZWN0IHRhcmdldCwgVmVjdG9yMyB0YXJnZXRWYWx1ZSwgZmxvYXQgZHVyYXRpb24sIEZ1bmM8ZmxvYXQsIGZsb2F0PiB0cmFuc2l0aW9uKSB7XHJcblx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMudGFyZ2V0VmFsdWUgPSB0YXJnZXRWYWx1ZTtcclxuXHRcdHRoaXMudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCBzdGFydCgpIHtcclxuXHRcdHRoaXMuc3RhcnRWYWx1ZSA9IHRhcmdldC50cmFuc2Zvcm0ubG9jYWxTY2FsZTtcclxuXHRcdHRoaXMudGVtcFZhbHVlID0gbmV3IFZlY3RvcjMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHVwZGF0ZShmbG9hdCB0KSB7XHJcblx0XHRNYXRoVXRpbHMuYXBwbHlMZXJwKHN0YXJ0VmFsdWUsIHRhcmdldFZhbHVlLCB0cmFuc2l0aW9uKHQpLCByZWYgdGVtcFZhbHVlKTtcclxuXHRcdHRhcmdldC50cmFuc2Zvcm0ubG9jYWxTY2FsZSA9IHRlbXBWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIGVuZCgpIHtcclxuXHRcdHRhcmdldC50cmFuc2Zvcm0ubG9jYWxTY2FsZSA9IHRhcmdldFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGZsb2F0IGdldER1cmF0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGR1cmF0aW9uO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgWlR3ZWVuU3RlcFBvc2l0aW9uRnJvbTpJWlR3ZWVuU3RlcCB7XHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIEdhbWVPYmplY3QgdGFyZ2V0O1xyXG5cdHByaXZhdGUgVmVjdG9yMyB0YXJnZXRWYWx1ZTtcclxuXHJcblx0Ly8gRXh0ZW5zaW9uIGZ1bmN0aW9uc1xyXG5cdHB1YmxpYyBaVHdlZW5TdGVwUG9zaXRpb25Gcm9tKEdhbWVPYmplY3QgdGFyZ2V0LCBWZWN0b3IzIHRhcmdldFZhbHVlKSB7XHJcblx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdHRoaXMudGFyZ2V0VmFsdWUgPSB0YXJnZXRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHN0YXJ0KCkgeyB9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHVwZGF0ZShmbG9hdCB0KSB7IH1cclxuXHJcblx0cHVibGljIHZvaWQgZW5kKCkge1xyXG5cdFx0dGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFBvc2l0aW9uID0gdGFyZ2V0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZmxvYXQgZ2V0RHVyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFpUd2VlblN0ZXBQb3NpdGlvblRvOklaVHdlZW5TdGVwIHtcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgR2FtZU9iamVjdCB0YXJnZXQ7XHJcblx0cHJpdmF0ZSBmbG9hdCBkdXJhdGlvbjtcclxuXHRwcml2YXRlIFZlY3RvcjMgc3RhcnRWYWx1ZTtcclxuXHRwcml2YXRlIFZlY3RvcjMgdGFyZ2V0VmFsdWU7XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHRlbXBWYWx1ZTtcclxuXHRwcml2YXRlIEZ1bmM8ZmxvYXQsIGZsb2F0PiB0cmFuc2l0aW9uO1xyXG5cclxuXHQvLyBFeHRlbnNpb24gZnVuY3Rpb25zXHJcblx0cHVibGljIFpUd2VlblN0ZXBQb3NpdGlvblRvKEdhbWVPYmplY3QgdGFyZ2V0LCBWZWN0b3IzIHRhcmdldFZhbHVlLCBmbG9hdCBkdXJhdGlvbiwgRnVuYzxmbG9hdCwgZmxvYXQ+IHRyYW5zaXRpb24pIHtcclxuXHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0dGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0dGhpcy50YXJnZXRWYWx1ZSA9IHRhcmdldFZhbHVlO1xyXG5cdFx0dGhpcy50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHN0YXJ0KCkge1xyXG5cdFx0dGhpcy5zdGFydFZhbHVlID0gdGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFBvc2l0aW9uO1xyXG5cdFx0dGhpcy50ZW1wVmFsdWUgPSBuZXcgVmVjdG9yMygpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgdXBkYXRlKGZsb2F0IHQpIHtcclxuXHRcdE1hdGhVdGlscy5hcHBseUxlcnAoc3RhcnRWYWx1ZSwgdGFyZ2V0VmFsdWUsIHRyYW5zaXRpb24odCksIHJlZiB0ZW1wVmFsdWUpO1xyXG5cdFx0dGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFBvc2l0aW9uID0gdGVtcFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgZW5kKCkge1xyXG5cdFx0dGFyZ2V0LnRyYW5zZm9ybS5sb2NhbFBvc2l0aW9uID0gdGFyZ2V0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZmxvYXQgZ2V0RHVyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gZHVyYXRpb247XHJcblx0fVxyXG59XHJcblxyXG4vLyBBdXhpbGlhcnkgZnVuY3Rpb25zXHJcblxyXG5jbGFzcyBNYXRoVXRpbHMge1xyXG5cdHB1YmxpYyBzdGF0aWMgZmxvYXQgbGVycChmbG9hdCBzdGFydCwgZmxvYXQgZW5kLCBmbG9hdCB0KSB7XHJcblx0Ly8gTGVycDogbmVlZGVkIGJlY2F1c2UgTWF0aGYubGVycCBjbGFtcHMgYmV0d2VlbiAwIGFuZCAxXHJcblx0XHRyZXR1cm4gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogdDtcclxufVxyXG5cclxucHVibGljIHN0YXRpYyB2b2lkIGFwcGx5TGVycChWZWN0b3IzIHN0YXJ0LCBWZWN0b3IzIGVuZCwgZmxvYXQgdCwgcmVmIFZlY3RvcjMgcmVjZWl2ZXIpIHtcclxuXHQvLyBMZXJwOiBuZWVkZWQgYmVjYXVzZSBNYXRoZi5sZXJwIGNsYW1wcyBiZXR3ZWVuIDAgYW5kIDFcclxuXHQvLyBEdW1wcyBpbnRvIGEgdGFyZ2V0IHRvIGF2b2lkIEdDXHJcblx0cmVjZWl2ZXIueCA9IHN0YXJ0LnggKyAoZW5kLnggLSBzdGFydC54KSAqIHQ7XHJcblx0cmVjZWl2ZXIueSA9IHN0YXJ0LnkgKyAoZW5kLnkgLSBzdGFydC55KSAqIHQ7XHJcblx0cmVjZWl2ZXIueiA9IHN0YXJ0LnogKyAoZW5kLnogLSBzdGFydC56KSAqIHQ7XHJcbn1cclxufVxyXG4qL1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBGd2VlblRpY2tlciB7XHJcblxyXG5cdC8vIFRpY2tlciBjbGFzcyB0byBjb250cm9sIHVwZGF0ZXNcclxuXHRcclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBzZXF1ZW5jZXM6QXJyYXk8RndlZW5TZXF1ZW5jZT4gPSBbXTtcclxuXHRwcml2YXRlIHRpbWU6bnVtYmVyID0gMC4wO1xyXG5cdHByaXZhdGUgdXBkYXRlQm91bmQ6KCkgPT4gdm9pZDtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy51cGRhdGVCb3VuZCA9IHRoaXMudXBkYXRlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLnVwZGF0ZUJvdW5kKCk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHJpdmF0ZSB1cGRhdGUoKTp2b2lkIHtcclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGVCb3VuZCk7XHJcblxyXG5cdFx0dGhpcy50aW1lID0gRGF0ZS5ub3coKSAvIDEwMDA7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlcXVlbmNlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5zZXF1ZW5jZXNbaV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdHRoaXMuc2VxdWVuY2VzW2ldLnVwZGF0ZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuc2VxdWVuY2VzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRUaW1lKCk6bnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLnRpbWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkKHNlcXVlbmNlOkZ3ZWVuU2VxdWVuY2UpOnZvaWQge1xyXG5cdFx0dGhpcy5zZXF1ZW5jZXMucHVzaChzZXF1ZW5jZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVtb3ZlKHNlcXVlbmNlOkZ3ZWVuU2VxdWVuY2UpOnZvaWQge1xyXG5cdFx0Ly8gTnVsbGlmeSBmaXJzdCwgcmVtb3ZlIGxhdGVyIC0gb3RoZXJ3aXNlIGl0IGdldHMgcmVtb3ZlIHdoaWxlIGRvaW5nIFVwZGF0ZSgpLCB3aGljaCBjYW4gY2F1c2UgdGhlIGxpc3QgdG8gdHJpcCBvbiBpdHNlbGZcclxuXHRcdHZhciBpZHggPSB0aGlzLnNlcXVlbmNlcy5pbmRleE9mKHNlcXVlbmNlKTtcclxuXHRcdGlmIChpZHggPiAtMSkgdGhpcy5zZXF1ZW5jZXNbaWR4XSA9IG51bGw7XHJcblx0fVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==