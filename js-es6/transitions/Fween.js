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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zaXRpb25zL0Z3ZWVuLnRzIl0sIm5hbWVzIjpbIkZ3ZWVuIiwiRndlZW4udXNlIiwiRndlZW4uZ2V0VGlja2VyIiwiRndlZW5TdGVwTWV0YWRhdGEiLCJGd2VlblN0ZXBNZXRhZGF0YS5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcE1ldGFkYXRhLnRpbWVEdXJhdGlvbiIsIkZ3ZWVuU2VxdWVuY2UiLCJGd2VlblNlcXVlbmNlLmNvbnN0cnVjdG9yIiwiRndlZW5TZXF1ZW5jZS5wbGF5IiwiRndlZW5TZXF1ZW5jZS5wYXVzZSIsIkZ3ZWVuU2VxdWVuY2UuY2FsbCIsIkZ3ZWVuU2VxdWVuY2Uud2FpdCIsIkZ3ZWVuU2VxdWVuY2UuYWRkU3RlcCIsIkZ3ZWVuU2VxdWVuY2UudXBkYXRlIiwiRndlZW5TZXF1ZW5jZS5nZXRUcmFuc2l0aW9uIiwiRndlZW5TZXF1ZW5jZS5kZXN0cm95IiwiRndlZW5HZXR0ZXJTZXR0ZXJTZXF1ZW5jZSIsIkZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2UuY29uc3RydWN0b3IiLCJGd2VlbkdldHRlclNldHRlclNlcXVlbmNlLmZyb20iLCJGd2VlbkdldHRlclNldHRlclNlcXVlbmNlLnRvIiwiRndlZW5PYmplY3RTZXF1ZW5jZSIsIkZ3ZWVuT2JqZWN0U2VxdWVuY2UuY29uc3RydWN0b3IiLCJGd2VlblN0ZXBDYWxsIiwiRndlZW5TdGVwQ2FsbC5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcENhbGwuc3RhcnQiLCJGd2VlblN0ZXBDYWxsLnVwZGF0ZSIsIkZ3ZWVuU3RlcENhbGwuZW5kIiwiRndlZW5TdGVwQ2FsbC5nZXREdXJhdGlvbiIsIkZ3ZWVuU3RlcFZhbHVlRnJvbSIsIkZ3ZWVuU3RlcFZhbHVlRnJvbS5jb25zdHJ1Y3RvciIsIkZ3ZWVuU3RlcFZhbHVlRnJvbS5zdGFydCIsIkZ3ZWVuU3RlcFZhbHVlRnJvbS51cGRhdGUiLCJGd2VlblN0ZXBWYWx1ZUZyb20uZW5kIiwiRndlZW5TdGVwVmFsdWVGcm9tLmdldER1cmF0aW9uIiwiRndlZW5TdGVwVmFsdWVUbyIsIkZ3ZWVuU3RlcFZhbHVlVG8uY29uc3RydWN0b3IiLCJGd2VlblN0ZXBWYWx1ZVRvLnN0YXJ0IiwiRndlZW5TdGVwVmFsdWVUby51cGRhdGUiLCJGd2VlblN0ZXBWYWx1ZVRvLmVuZCIsIkZ3ZWVuU3RlcFZhbHVlVG8uZ2V0RHVyYXRpb24iLCJGd2VlblRpY2tlciIsIkZ3ZWVuVGlja2VyLmNvbnN0cnVjdG9yIiwiRndlZW5UaWNrZXIudXBkYXRlIiwiRndlZW5UaWNrZXIuZ2V0VGltZSIsIkZ3ZWVuVGlja2VyLmFkZCIsIkZ3ZWVuVGlja2VyLnJlbW92ZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUdILE9BQU8sTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUM5QixPQUFPLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3QyxBQWNBOzs7Ozs7OztHQU5HO0FBRUgsK0VBQStFO0FBRS9FLHlFQUF5RTs7SUFjeEVBLE9BQWNBLEdBQUdBLENBQUNBLE9BQVdBLEVBQUVBLE9BQVlBO1FBQzFDQyxFQUFFQSxDQUFDQSxDQUFDQSxPQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqQ0EsQUFDQUEsU0FEU0E7WUFDVEEsTUFBTUEsQ0FBQ0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUN6Q0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsVUFBVUEsSUFBSUEsT0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0VBLEFBQ0FBLGdCQURnQkE7WUFDaEJBLE1BQU1BLENBQUNBLElBQUlBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDeERBLENBQUNBO1FBRURBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLDBDQUEwQ0Es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QUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUJBLENBQUNBLEVBQUVBLENBQUNBO1lBQ0xBLENBQUNBO1FBQ0ZBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRU1GLE9BQU9BO1FBQ2JHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO0lBQ2xCQSxDQUFDQTtJQUVNSCxHQUFHQSxDQUFDQSxRQUFzQkE7UUFDaENJLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQy9CQSxDQUFDQTtJQUVNSixNQUFNQSxDQUFDQSxRQUFzQkE7UUFDbkNLLEFBQ0FBLDBIQUQwSEE7WUFDdEhBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzNDQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7QUFDRkwsQ0FBQ0E7QUFBQSIsImZpbGUiOiJ0cmFuc2l0aW9ucy9Gd2Vlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAYXV0aG9yXHRaZWggRmVybmFuZG9cclxuICogQHZlcnNpb25cdDEuMFxyXG4gKiBAc2luY2VcdDIwMTUtMDgtMDNcclxuICovXHJcblxyXG5pbXBvcnQgU2ltcGxlU2lnbmFsIGZyb20gJy4vLi4vc2lnbmFscy9TaW1wbGVTaWduYWwnO1xyXG5pbXBvcnQgRWFzaW5nIGZyb20gJy4vRWFzaW5nJztcclxuaW1wb3J0IE1hdGhVdGlscyBmcm9tICcuLy4uL3V0aWxzL01hdGhVdGlscyc7XHJcblxyXG4vKlxyXG4gSWRlYXMgZm9yIHR3ZWVuaW5nIC0gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vemVoL3VuaXR5LXRpZGJpdHMvYmxvYi9tYXN0ZXIvdHJhbnNpdGlvbnMvWlR3ZWVuLmNzXHJcblxyXG4gWlR3ZWVuLnVzZShvYmopXHJcbiAudG8obywgdCwgdHJhbnNpdGlvbilcclxuIC5jYWxsKGYpXHJcbiAud2FpdCh0KVxyXG4gLnVzZShnZXR0ZXIsIHNldHRlcj8pXHJcbiAqL1xyXG5cclxuLy8gVE9ETzogdGhpcyBsaWJyYXJ5IGhhcyAudGltZSwgLmR1cmF0aW9uLCBhbmQgLmdldER1cmF0aW9uKCkuIE1ha2UgeW91ciBtaW5kIVxyXG5cclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3plaC91bml0eS10aWRiaXRzL2Jsb2IvbWFzdGVyL3RyYW5zaXRpb25zL1pUd2Vlbi5jc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRndlZW4ge1xyXG5cdFxyXG5cdC8vIE1haW4gY2xhc3MgLSBqdXN0IGEgc3RhcnRpbmcgcG9pbnRcclxuXHRwcml2YXRlIHN0YXRpYyB0aWNrZXI6RndlZW5UaWNrZXIgPSBudWxsO1xyXG5cdFxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBTVEFUSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcclxuXHRwdWJsaWMgc3RhdGljIHVzZShvYmplY3QxOigpPT5udW1iZXIsIG9iamVjdDI6KHY6bnVtYmVyKSA9PiB2b2lkKTpGd2VlblNlcXVlbmNlO1xyXG5cdHB1YmxpYyBzdGF0aWMgdXNlKG9iamVjdDE6T2JqZWN0KTpGd2VlblNlcXVlbmNlO1xyXG5cdHB1YmxpYyBzdGF0aWMgdXNlKG9iamVjdDE6YW55LCBvYmplY3QyPzphbnkpOkZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFx0aWYgKHR5cGVvZihvYmplY3QxKSA9PSBcIm9iamVjdFwiKSB7XHJcblx0XHRcdC8vIE9iamVjdFxyXG5cdFx0XHRyZXR1cm4gbmV3IEZ3ZWVuT2JqZWN0U2VxdWVuY2Uob2JqZWN0MSk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZihvYmplY3QxKSA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mKG9iamVjdDIpID09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHQvLyBHZXR0ZXIvc2V0dGVyXHJcblx0XHRcdHJldHVybiBuZXcgRndlZW5HZXR0ZXJTZXR0ZXJTZXF1ZW5jZShvYmplY3QxLCBvYmplY3QyKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zb2xlLmVycm9yKFwiVHdlZW5pbmcgcGFyYW1ldGVycyB3ZXJlIG5vdCB1bmRlcnN0b29kLlwiKTtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBnZXRUaWNrZXIoKTpGd2VlblRpY2tlciB7XHJcblx0XHRpZiAoIXRoaXMudGlja2VyKSB0aGlzLnRpY2tlciA9IG5ldyBGd2VlblRpY2tlcigpO1xyXG5cdFx0cmV0dXJuIHRoaXMudGlja2VyO1xyXG5cdH1cclxufVxyXG5cclxuLy8gQ3JlYXRlIGEgZ2xvYmFsIG9iamVjdCB3aXRoIHRoZSBjbGFzcyAtIG9ubHkgdXNlZCBpbiB0aGUgc2luZ2xlIGZpbGUgdmVyc2lvbiwgcmVwbGFjZWQgYXQgYnVpbGQgdGltZVxyXG4vLyAjSUZERUYgRVM1U0lOR0xFIC8vIHdpbmRvd1tcIkZ3ZWVuXCJdID0gRndlZW47XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIElOVEVSTkFMIENMQVNTRVMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8vIEF1eCBjbGFzc2VzXHJcblxyXG5jbGFzcyBGd2VlblN0ZXBNZXRhZGF0YSB7XHJcblx0XHJcblx0Ly8gQ2xhc3MgdG8gbWFpbnRhaW4gbWV0YWRhdGEgcmVsYXRlZCB0byBlYWNoIHN0ZXAgb2YgYSBGd2VlbiBzZXF1ZW5jZVxyXG5cdFxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwdWJsaWMgaGFzU3RhcnRlZDpib29sZWFuID0gZmFsc2U7XHJcblx0cHVibGljIGhhc0NvbXBsZXRlZDpib29sZWFuID0gZmFsc2U7XHJcblx0cHVibGljIHRpbWVTdGFydDpudW1iZXIgPSAwLjA7XHJcblx0cHVibGljIHRpbWVFbmQ6bnVtYmVyID0gMDtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQUNDRVNTT1IgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRpbWVEdXJhdGlvbigpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy50aW1lRW5kIC0gdGhpcy50aW1lU3RhcnQ7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElGd2VlblN0ZXAge1xyXG5cdHN0YXJ0KCk6dm9pZDtcclxuXHR1cGRhdGUodDpudW1iZXIpOnZvaWQ7XHJcblx0ZW5kKCk6dm9pZDtcclxuXHRnZXREdXJhdGlvbigpOm51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFxyXG5cdC8vIE9uZSBzZXF1ZW5jZSBvZiBzdGVwc1xyXG5cdFxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIHN0ZXBzOkFycmF5PElGd2VlblN0ZXA+ID0gW107XHJcblx0cHJpdmF0ZSBzdGVwc01ldGFkYXRhczpBcnJheTxGd2VlblN0ZXBNZXRhZGF0YT4gPSBbXTtcclxuXHJcblx0cHJpdmF0ZSBpc1BsYXlpbmc6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgY3VycmVudFN0ZXA6bnVtYmVyID0gMDtcclxuXHRwcml2YXRlIHN0YXJ0VGltZTpudW1iZXIgPSAwLjA7XHJcblx0cHJpdmF0ZSBwYXVzZVRpbWU6bnVtYmVyID0gMC4wO1xyXG5cdHByaXZhdGUgZXhlY3V0ZWRUaW1lOm51bWJlciA9IDAuMDtcclxuXHRwcml2YXRlIGR1cmF0aW9uOm51bWJlciA9IDAuMDtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDT05TVFJVQ1RPUiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly8gQ3JlYXRlIGEgbmV3IEZ3ZWVuXHJcblx0XHR0aGlzLnN0YXJ0VGltZSA9IEZ3ZWVuLmdldFRpY2tlcigpLmdldFRpbWUoKTtcclxuXHJcblx0XHQvLyBBZGQgdG8gbGlzdFxyXG5cdFx0RndlZW4uZ2V0VGlja2VyKCkuYWRkKHRoaXMpO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdC8vIFBsYXkgY29udHJvbCBtZXRob2RzXHJcblxyXG5cdC8qKlxyXG5cdCAqIFBsYXkgKG9yIHJlc3VtZSkgdGhlIHNlcXVlbmNlXHJcblx0ICovXHJcblx0cHVibGljIHBsYXkoKTpGd2VlblNlcXVlbmNlIHtcclxuXHRcdGlmICghdGhpcy5pc1BsYXlpbmcpIHtcclxuXHRcdFx0dGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xyXG5cdFx0XHRsZXQgdGltZVBhdXNlZCA9IEZ3ZWVuLmdldFRpY2tlcigpLmdldFRpbWUoKSAtIHRoaXMucGF1c2VUaW1lO1xyXG5cdFx0XHR0aGlzLnN0YXJ0VGltZSArPSB0aW1lUGF1c2VkO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBQYXVzZSB0aGUgc2VxdWVuY2VcclxuXHQgKi9cclxuXHRwdWJsaWMgcGF1c2UoKTpGd2VlblNlcXVlbmNlIHtcclxuXHRcdGlmICh0aGlzLmlzUGxheWluZykge1xyXG5cdFx0XHR0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnBhdXNlVGltZSA9IEZ3ZWVuLmdldFRpY2tlcigpLmdldFRpbWUoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Ly8gVXRpbGl0eSBtZXRob2RzXHJcblxyXG5cdC8qKlxyXG5cdCAqIENhbGwgYSBmdW5jdGlvblxyXG5cdCAqL1xyXG5cdHB1YmxpYyBjYWxsKGZ1bmM6RnVuY3Rpb24pOkZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFx0dGhpcy5hZGRTdGVwKG5ldyBGd2VlblN0ZXBDYWxsKGZ1bmMpKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogV2FpdCBhIG51bWJlciBvZiBzZWNvbmRzXHJcblx0ICovXHJcblx0cHVibGljIHdhaXQoZHVyYXRpb246bnVtYmVyKTpGd2VlblNlcXVlbmNlIHtcclxuXHRcdHRoaXMuZHVyYXRpb24gKz0gdGhpcy5kdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQUklWQVRFIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdC8vIENvcmUgdHdlZW4gc3RlcCBjb250cm9sIG1ldGhvZHM7IHJldXNlZCBieSBzdWJjbGFzc2VzXHJcblxyXG5cdHByb3RlY3RlZCBhZGRTdGVwKHN0ZXA6SUZ3ZWVuU3RlcCk6dm9pZCB7XHJcblx0XHR0aGlzLnN0ZXBzLnB1c2goc3RlcCk7XHJcblxyXG5cdFx0bGV0IHR3ZWVuTWV0YWRhdGEgPSBuZXcgRndlZW5TdGVwTWV0YWRhdGEoKTtcclxuXHRcdHR3ZWVuTWV0YWRhdGEudGltZVN0YXJ0ID0gdGhpcy5zdGFydFRpbWUgKyB0aGlzLmR1cmF0aW9uO1xyXG5cdFx0dGhpcy5kdXJhdGlvbiArPSBzdGVwLmdldER1cmF0aW9uKCk7XHJcblx0XHR0d2Vlbk1ldGFkYXRhLnRpbWVFbmQgPSB0aGlzLnN0YXJ0VGltZSArIHRoaXMuZHVyYXRpb247XHJcblxyXG5cdFx0dGhpcy5zdGVwc01ldGFkYXRhcy5wdXNoKHR3ZWVuTWV0YWRhdGEpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHVwZGF0ZSgpOnZvaWQge1xyXG5cdFx0Ly8gVXBkYXRlIGN1cnJlbnQgc3RlcChzKSBiYXNlZCBvbiB0aGUgdGltZVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIGZpbmlzaGVkXHJcblx0XHRpZiAodGhpcy5jdXJyZW50U3RlcCA+PSB0aGlzLnN0ZXBzLmxlbmd0aCkge1xyXG5cdFx0XHR0aGlzLmRlc3Ryb3koKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHNob3VsZFVwZGF0ZU9uY2UgPSB0aGlzLmlzUGxheWluZztcclxuXHJcblx0XHRcdHdoaWxlIChzaG91bGRVcGRhdGVPbmNlICYmIHRoaXMuY3VycmVudFN0ZXAgPCB0aGlzLnN0ZXBzLmxlbmd0aCkge1xyXG5cdFx0XHRcdHNob3VsZFVwZGF0ZU9uY2UgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0aWYgKEZ3ZWVuLmdldFRpY2tlcigpLmdldFRpbWUoKSA+PSB0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLnRpbWVTdGFydCkge1xyXG5cdFx0XHRcdFx0Ly8gU3RhcnQgdGhlIGN1cnJlbnQgdHdlZW4gc3RlcCBpZiBuZWNlc3NhcnlcclxuXHRcdFx0XHRcdGlmICghdGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS5oYXNTdGFydGVkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3RlcHNbdGhpcy5jdXJyZW50U3RlcF0uc3RhcnQoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS5oYXNTdGFydGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGN1cnJlbnQgdHdlZW4gc3RlcFxyXG5cdFx0XHRcdFx0dGhpcy5zdGVwc1t0aGlzLmN1cnJlbnRTdGVwXS51cGRhdGUoTWF0aFV0aWxzLm1hcChGd2Vlbi5nZXRUaWNrZXIoKS5nZXRUaW1lKCksIHRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0udGltZVN0YXJ0LCB0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLnRpbWVFbmQsIDAsIDEsIHRydWUpKTtcclxuXHJcblx0XHRcdFx0XHQvLyBDaGVjayBpZiBpdCdzIGZpbmlzaGVkXHJcblx0XHRcdFx0XHRpZiAoRndlZW4uZ2V0VGlja2VyKCkuZ2V0VGltZSgpID49IHRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0udGltZUVuZCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuc3RlcHNNZXRhZGF0YXNbdGhpcy5jdXJyZW50U3RlcF0uaGFzQ29tcGxldGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zdGVwc1t0aGlzLmN1cnJlbnRTdGVwXS5lbmQoKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0ZXBzTWV0YWRhdGFzW3RoaXMuY3VycmVudFN0ZXBdLmhhc0NvbXBsZXRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5leGVjdXRlZFRpbWUgKz0gdGhpcy5zdGVwc01ldGFkYXRhc1t0aGlzLmN1cnJlbnRTdGVwXS50aW1lRHVyYXRpb247XHJcblx0XHRcdFx0XHRcdFx0c2hvdWxkVXBkYXRlT25jZSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdXJyZW50U3RlcCsrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgZ2V0VHJhbnNpdGlvbih0cmFuc2l0aW9uOih0Om51bWJlcikgPT4gbnVtYmVyKToodDpudW1iZXIpID0+IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdHJhbnNpdGlvbiA9PSBudWxsID8gRWFzaW5nLm5vbmUgOiB0cmFuc2l0aW9uO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBkZXN0cm95KCk6dm9pZCB7XHJcblx0XHRGd2Vlbi5nZXRUaWNrZXIoKS5yZW1vdmUodGhpcyk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBGd2VlbkdldHRlclNldHRlclNlcXVlbmNlIGV4dGVuZHMgRndlZW5TZXF1ZW5jZSB7XHJcblx0XHJcblx0Ly8gQSBzZXF1ZW5jZSBmb3IgZ2V0dGVyL3NldHRlciBwYWlyc1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSB0YXJnZXRHZXQ6KCkgPT4gbnVtYmVyO1xyXG5cdHByaXZhdGUgdGFyZ2V0U2V0Oih2YWx1ZTpudW1iZXIpID0+IHZvaWQ7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3Rvcih0YXJnZXRHZXQ6KCkgPT4gbnVtYmVyLCB0YXJnZXRTZXQ6KHZhbHVlOm51bWJlcikgPT4gdm9pZCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLnRhcmdldEdldCA9IHRhcmdldEdldDtcclxuXHRcdHRoaXMudGFyZ2V0U2V0ID0gdGFyZ2V0U2V0O1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBmcm9tKHZhbHVlOm51bWJlcik6RndlZW5HZXR0ZXJTZXR0ZXJTZXF1ZW5jZSB7XHJcblx0XHR0aGlzLmFkZFN0ZXAobmV3IEZ3ZWVuU3RlcFZhbHVlRnJvbSh0aGlzLnRhcmdldFNldCwgdmFsdWUpKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHRvKHZhbHVlOm51bWJlciwgZHVyYXRpb246bnVtYmVyID0gMCwgdHJhbnNpdGlvbjoodDpudW1iZXIpID0+IG51bWJlciA9IG51bGwpOkZ3ZWVuR2V0dGVyU2V0dGVyU2VxdWVuY2Uge1xyXG5cdFx0dGhpcy5hZGRTdGVwKG5ldyBGd2VlblN0ZXBWYWx1ZVRvKHRoaXMudGFyZ2V0R2V0LCB0aGlzLnRhcmdldFNldCwgdmFsdWUsIGR1cmF0aW9uLCB0aGlzLmdldFRyYW5zaXRpb24odHJhbnNpdGlvbikpKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgRndlZW5PYmplY3RTZXF1ZW5jZSBleHRlbmRzIEZ3ZWVuU2VxdWVuY2Uge1xyXG5cdFxyXG5cdC8vIEEgc2VxdWVuY2UgZm9yIGNvbW1vbiBvYmplY3RzJyBwcm9wZXJ0aWVzXHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIHRhcmdldE9iamVjdDpPYmplY3Q7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKG9iamVjdDpPYmplY3QpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy50YXJnZXRPYmplY3QgPSBvYmplY3Q7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHQvKlxyXG5cdCBwdWJsaWMgWlR3ZWVuR2FtZU9iamVjdFNlcXVlbmNlIHNjYWxlRnJvbShWZWN0b3IzIHNjYWxlKSB7XHJcblx0IGFkZFN0ZXAobmV3IFpUd2VlblN0ZXBTY2FsZUZyb20odGFyZ2V0R2FtZU9iamVjdCwgc2NhbGUpKTtcclxuXHQgcmV0dXJuIHRoaXM7XHJcblx0IH1cclxuXHQgKi9cclxufVxyXG5cclxuLy8gQ29tbW9uIHN0ZXBzXHJcblxyXG5jbGFzcyBGd2VlblN0ZXBDYWxsIHtcclxuXHJcblx0Ly8gQSBzdGVwIHRvIGNhbGwgYSBmdW5jdGlvblxyXG5cdHByaXZhdGUgYWN0aW9uOkZ1bmN0aW9uO1x0XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3RvcihmdW5jOkZ1bmN0aW9uKSB7XHJcblx0XHR0aGlzLmFjdGlvbiA9IGZ1bmM7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIHN0YXJ0KCk6dm9pZCB7IH1cclxuXHJcblx0cHVibGljIHVwZGF0ZSh0Om51bWJlcik6dm9pZCB7IH1cclxuXHJcblx0cHVibGljIGVuZCgpOnZvaWQge1xyXG5cdFx0dGhpcy5hY3Rpb24oKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXREdXJhdGlvbigpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcbn1cclxuXHJcbi8vIFN0ZXBzIGZvciBzcGVjaWZpYyBzZXF1ZW5jZXM6IEdldHRlclNldHRlclxyXG5cclxuY2xhc3MgRndlZW5TdGVwVmFsdWVGcm9tIHtcclxuXHJcblx0Ly8gQSBzdGVwIHRvIHNldCB0aGUgc3RhcnRpbmcgdmFsdWVcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgdGFyZ2V0U2V0Oih2YWx1ZTpudW1iZXIpID0+IHZvaWQ7XHJcblx0cHJpdmF0ZSB0YXJnZXRWYWx1ZTpudW1iZXI7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3Rvcih0YXJnZXRTZXQ6KHZhbHVlOm51bWJlcikgPT4gdm9pZCwgdGFyZ2V0VmFsdWU6bnVtYmVyKSB7XHJcblx0XHR0aGlzLnRhcmdldFNldCA9IHRhcmdldFNldDtcclxuXHRcdHRoaXMudGFyZ2V0VmFsdWUgPSB0YXJnZXRWYWx1ZTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgc3RhcnQoKTp2b2lkIHsgfVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlKHQ6bnVtYmVyKTp2b2lkIHsgfVxyXG5cclxuXHRwdWJsaWMgZW5kKCk6dm9pZCB7XHJcblx0XHR0aGlzLnRhcmdldFNldCh0aGlzLnRhcmdldFZhbHVlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXREdXJhdGlvbigpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIEZ3ZWVuU3RlcFZhbHVlVG8ge1xyXG5cclxuXHQvLyBBIHN0ZXAgdG8gdHdlZW4gdG8gYSB2YWx1ZVxyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSB0YXJnZXRHZXQ6KCkgPT4gbnVtYmVyO1xyXG5cdHByaXZhdGUgdGFyZ2V0U2V0Oih2YWx1ZTpudW1iZXIpID0+IHZvaWQ7XHJcblx0cHJpdmF0ZSBkdXJhdGlvbjpudW1iZXI7XHJcblx0cHJpdmF0ZSBzdGFydFZhbHVlOm51bWJlcjtcclxuXHRwcml2YXRlIHRhcmdldFZhbHVlOm51bWJlcjtcclxuXHRwcml2YXRlIHRyYW5zaXRpb246KHQ6bnVtYmVyKSA9PiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHRhcmdldEdldDooKSA9PiBudW1iZXIsIHRhcmdldFNldDoodmFsdWU6bnVtYmVyKSA9PiB2b2lkLCB0YXJnZXRWYWx1ZTpudW1iZXIsIGR1cmF0aW9uOm51bWJlciwgdHJhbnNpdGlvbjoodDpudW1iZXIpID0+IG51bWJlcikge1xyXG5cdFx0dGhpcy50YXJnZXRHZXQgPSB0YXJnZXRHZXQ7XHJcblx0XHR0aGlzLnRhcmdldFNldCA9IHRhcmdldFNldDtcclxuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMudGFyZ2V0VmFsdWUgPSB0YXJnZXRWYWx1ZTtcclxuXHRcdHRoaXMudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgc3RhcnQoKTp2b2lkIHtcclxuXHRcdHRoaXMuc3RhcnRWYWx1ZSA9IHRoaXMudGFyZ2V0R2V0KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlKHQ6bnVtYmVyKTp2b2lkIHtcclxuXHRcdHRoaXMudGFyZ2V0U2V0KE1hdGhVdGlscy5tYXAodGhpcy50cmFuc2l0aW9uKHQpLCAwLCAxLCB0aGlzLnN0YXJ0VmFsdWUsIHRoaXMudGFyZ2V0VmFsdWUpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBlbmQoKTp2b2lkIHtcclxuXHRcdHRoaXMudGFyZ2V0U2V0KHRoaXMudGFyZ2V0VmFsdWUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldER1cmF0aW9uKCk6bnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmR1cmF0aW9uO1xyXG5cdH1cclxufVxyXG5cclxuLypcclxuLy8gU3RlcHMgZm9yIEdhbWVPYmplY3Qgc2VxdWVuY2VzXHJcblxyXG5jbGFzcyBaVHdlZW5TdGVwU2NhbGVGcm9tOklaVHdlZW5TdGVwIHtcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgR2FtZU9iamVjdCB0YXJnZXQ7XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHRhcmdldFZhbHVlO1xyXG5cclxuXHQvLyBFeHRlbnNpb24gZnVuY3Rpb25zXHJcblx0cHVibGljIFpUd2VlblN0ZXBTY2FsZUZyb20oR2FtZU9iamVjdCB0YXJnZXQsIFZlY3RvcjMgdGFyZ2V0VmFsdWUpIHtcclxuXHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0dGhpcy50YXJnZXRWYWx1ZSA9IHRhcmdldFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgc3RhcnQoKSB7IH1cclxuXHJcblx0cHVibGljIHZvaWQgdXBkYXRlKGZsb2F0IHQpIHsgfVxyXG5cclxuXHRwdWJsaWMgdm9pZCBlbmQoKSB7XHJcblx0XHR0YXJnZXQudHJhbnNmb3JtLmxvY2FsU2NhbGUgPSB0YXJnZXRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBmbG9hdCBnZXREdXJhdGlvbigpIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgWlR3ZWVuU3RlcFNjYWxlVG86SVpUd2VlblN0ZXAge1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBHYW1lT2JqZWN0IHRhcmdldDtcclxuXHRwcml2YXRlIGZsb2F0IGR1cmF0aW9uO1xyXG5cdHByaXZhdGUgVmVjdG9yMyBzdGFydFZhbHVlO1xyXG5cdHByaXZhdGUgVmVjdG9yMyB0YXJnZXRWYWx1ZTtcclxuXHRwcml2YXRlIFZlY3RvcjMgdGVtcFZhbHVlO1xyXG5cdHByaXZhdGUgRnVuYzxmbG9hdCwgZmxvYXQ+IHRyYW5zaXRpb247XHJcblxyXG5cdC8vIEV4dGVuc2lvbiBmdW5jdGlvbnNcclxuXHRwdWJsaWMgWlR3ZWVuU3RlcFNjYWxlVG8oR2FtZU9iamVjdCB0YXJnZXQsIFZlY3RvcjMgdGFyZ2V0VmFsdWUsIGZsb2F0IGR1cmF0aW9uLCBGdW5jPGZsb2F0LCBmbG9hdD4gdHJhbnNpdGlvbikge1xyXG5cdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHR0aGlzLnRhcmdldFZhbHVlID0gdGFyZ2V0VmFsdWU7XHJcblx0XHR0aGlzLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHZvaWQgc3RhcnQoKSB7XHJcblx0XHR0aGlzLnN0YXJ0VmFsdWUgPSB0YXJnZXQudHJhbnNmb3JtLmxvY2FsU2NhbGU7XHJcblx0XHR0aGlzLnRlbXBWYWx1ZSA9IG5ldyBWZWN0b3IzKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCB1cGRhdGUoZmxvYXQgdCkge1xyXG5cdFx0TWF0aFV0aWxzLmFwcGx5TGVycChzdGFydFZhbHVlLCB0YXJnZXRWYWx1ZSwgdHJhbnNpdGlvbih0KSwgcmVmIHRlbXBWYWx1ZSk7XHJcblx0XHR0YXJnZXQudHJhbnNmb3JtLmxvY2FsU2NhbGUgPSB0ZW1wVmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCBlbmQoKSB7XHJcblx0XHR0YXJnZXQudHJhbnNmb3JtLmxvY2FsU2NhbGUgPSB0YXJnZXRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBmbG9hdCBnZXREdXJhdGlvbigpIHtcclxuXHRcdHJldHVybiBkdXJhdGlvbjtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFpUd2VlblN0ZXBQb3NpdGlvbkZyb206SVpUd2VlblN0ZXAge1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBHYW1lT2JqZWN0IHRhcmdldDtcclxuXHRwcml2YXRlIFZlY3RvcjMgdGFyZ2V0VmFsdWU7XHJcblxyXG5cdC8vIEV4dGVuc2lvbiBmdW5jdGlvbnNcclxuXHRwdWJsaWMgWlR3ZWVuU3RlcFBvc2l0aW9uRnJvbShHYW1lT2JqZWN0IHRhcmdldCwgVmVjdG9yMyB0YXJnZXRWYWx1ZSkge1xyXG5cdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR0aGlzLnRhcmdldFZhbHVlID0gdGFyZ2V0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCBzdGFydCgpIHsgfVxyXG5cclxuXHRwdWJsaWMgdm9pZCB1cGRhdGUoZmxvYXQgdCkgeyB9XHJcblxyXG5cdHB1YmxpYyB2b2lkIGVuZCgpIHtcclxuXHRcdHRhcmdldC50cmFuc2Zvcm0ubG9jYWxQb3NpdGlvbiA9IHRhcmdldFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGZsb2F0IGdldER1cmF0aW9uKCkge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBaVHdlZW5TdGVwUG9zaXRpb25UbzpJWlR3ZWVuU3RlcCB7XHJcblxyXG5cdC8vIFByb3BlcnRpZXNcclxuXHRwcml2YXRlIEdhbWVPYmplY3QgdGFyZ2V0O1xyXG5cdHByaXZhdGUgZmxvYXQgZHVyYXRpb247XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHN0YXJ0VmFsdWU7XHJcblx0cHJpdmF0ZSBWZWN0b3IzIHRhcmdldFZhbHVlO1xyXG5cdHByaXZhdGUgVmVjdG9yMyB0ZW1wVmFsdWU7XHJcblx0cHJpdmF0ZSBGdW5jPGZsb2F0LCBmbG9hdD4gdHJhbnNpdGlvbjtcclxuXHJcblx0Ly8gRXh0ZW5zaW9uIGZ1bmN0aW9uc1xyXG5cdHB1YmxpYyBaVHdlZW5TdGVwUG9zaXRpb25UbyhHYW1lT2JqZWN0IHRhcmdldCwgVmVjdG9yMyB0YXJnZXRWYWx1ZSwgZmxvYXQgZHVyYXRpb24sIEZ1bmM8ZmxvYXQsIGZsb2F0PiB0cmFuc2l0aW9uKSB7XHJcblx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMudGFyZ2V0VmFsdWUgPSB0YXJnZXRWYWx1ZTtcclxuXHRcdHRoaXMudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdm9pZCBzdGFydCgpIHtcclxuXHRcdHRoaXMuc3RhcnRWYWx1ZSA9IHRhcmdldC50cmFuc2Zvcm0ubG9jYWxQb3NpdGlvbjtcclxuXHRcdHRoaXMudGVtcFZhbHVlID0gbmV3IFZlY3RvcjMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIHVwZGF0ZShmbG9hdCB0KSB7XHJcblx0XHRNYXRoVXRpbHMuYXBwbHlMZXJwKHN0YXJ0VmFsdWUsIHRhcmdldFZhbHVlLCB0cmFuc2l0aW9uKHQpLCByZWYgdGVtcFZhbHVlKTtcclxuXHRcdHRhcmdldC50cmFuc2Zvcm0ubG9jYWxQb3NpdGlvbiA9IHRlbXBWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB2b2lkIGVuZCgpIHtcclxuXHRcdHRhcmdldC50cmFuc2Zvcm0ubG9jYWxQb3NpdGlvbiA9IHRhcmdldFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGZsb2F0IGdldER1cmF0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGR1cmF0aW9uO1xyXG5cdH1cclxufVxyXG5cclxuLy8gQXV4aWxpYXJ5IGZ1bmN0aW9uc1xyXG5cclxuY2xhc3MgTWF0aFV0aWxzIHtcclxuXHRwdWJsaWMgc3RhdGljIGZsb2F0IGxlcnAoZmxvYXQgc3RhcnQsIGZsb2F0IGVuZCwgZmxvYXQgdCkge1xyXG5cdC8vIExlcnA6IG5lZWRlZCBiZWNhdXNlIE1hdGhmLmxlcnAgY2xhbXBzIGJldHdlZW4gMCBhbmQgMVxyXG5cdFx0cmV0dXJuIHN0YXJ0ICsgKGVuZCAtIHN0YXJ0KSAqIHQ7XHJcbn1cclxuXHJcbnB1YmxpYyBzdGF0aWMgdm9pZCBhcHBseUxlcnAoVmVjdG9yMyBzdGFydCwgVmVjdG9yMyBlbmQsIGZsb2F0IHQsIHJlZiBWZWN0b3IzIHJlY2VpdmVyKSB7XHJcblx0Ly8gTGVycDogbmVlZGVkIGJlY2F1c2UgTWF0aGYubGVycCBjbGFtcHMgYmV0d2VlbiAwIGFuZCAxXHJcblx0Ly8gRHVtcHMgaW50byBhIHRhcmdldCB0byBhdm9pZCBHQ1xyXG5cdHJlY2VpdmVyLnggPSBzdGFydC54ICsgKGVuZC54IC0gc3RhcnQueCkgKiB0O1xyXG5cdHJlY2VpdmVyLnkgPSBzdGFydC55ICsgKGVuZC55IC0gc3RhcnQueSkgKiB0O1xyXG5cdHJlY2VpdmVyLnogPSBzdGFydC56ICsgKGVuZC56IC0gc3RhcnQueikgKiB0O1xyXG59XHJcbn1cclxuKi9cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRndlZW5UaWNrZXIge1xyXG5cclxuXHQvLyBUaWNrZXIgY2xhc3MgdG8gY29udHJvbCB1cGRhdGVzXHJcblx0XHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHByaXZhdGUgc2VxdWVuY2VzOkFycmF5PEZ3ZWVuU2VxdWVuY2U+ID0gW107XHJcblx0cHJpdmF0ZSB0aW1lOm51bWJlciA9IDAuMDtcclxuXHRwcml2YXRlIHVwZGF0ZUJvdW5kOigpID0+IHZvaWQ7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMudXBkYXRlQm91bmQgPSB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy51cGRhdGVCb3VuZCgpO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQVUJMSUMgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHByaXZhdGUgdXBkYXRlKCk6dm9pZCB7XHJcblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlQm91bmQpO1xyXG5cclxuXHRcdHRoaXMudGltZSA9IERhdGUubm93KCkgLyAxMDAwO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZXF1ZW5jZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuc2VxdWVuY2VzW2ldICE9IG51bGwpIHtcclxuXHRcdFx0XHR0aGlzLnNlcXVlbmNlc1tpXS51cGRhdGUoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnNlcXVlbmNlcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0aS0tO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0VGltZSgpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy50aW1lO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZChzZXF1ZW5jZTpGd2VlblNlcXVlbmNlKTp2b2lkIHtcclxuXHRcdHRoaXMuc2VxdWVuY2VzLnB1c2goc2VxdWVuY2UpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZShzZXF1ZW5jZTpGd2VlblNlcXVlbmNlKTp2b2lkIHtcclxuXHRcdC8vIE51bGxpZnkgZmlyc3QsIHJlbW92ZSBsYXRlciAtIG90aGVyd2lzZSBpdCBnZXRzIHJlbW92ZSB3aGlsZSBkb2luZyBVcGRhdGUoKSwgd2hpY2ggY2FuIGNhdXNlIHRoZSBsaXN0IHRvIHRyaXAgb24gaXRzZWxmXHJcblx0XHR2YXIgaWR4ID0gdGhpcy5zZXF1ZW5jZXMuaW5kZXhPZihzZXF1ZW5jZSk7XHJcblx0XHRpZiAoaWR4ID4gLTEpIHRoaXMuc2VxdWVuY2VzW2lkeF0gPSBudWxsO1xyXG5cdH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=