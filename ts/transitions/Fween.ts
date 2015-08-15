/**
 * Created by zeh fernando on 8/3/2015
 */

import SimpleSignal from './../signals/SimpleSignal';
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


// https://github.com/zeh/unity-tidbits/blob/master/transitions/ZTween.cs

export default class Fween {

	// ================================================================================================================
	// PUBLIC STATIC INTERFACE ----------------------------------------------------------------------------------------

	static use(object1, object2) {
		if (typeof(object1) == "object") {
			// Object
			return new FweenObjectSequence(object1);
		} else if (typeof(object1) == "function" && typeof(object2) == "function") {
			// Getter/setter
			return new FweenGetterSetterSequence(object1, object2);
		} else {
			console.error("Tweening parameters were not understood.");
			return null;
		}
	}


	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	get numItems() {
		return this.functions.length;
	}
}

// ================================================================================================================
// INTERNAL CLASSES -----------------------------------------------------------------------------------------------

// Aux classes

class FweenStepMetadata {
	constructor() {
		this.hasStarted = false;
		this.hasCompleted = false;
		this.timeStart = 0.0;
		this.timeEnd = 0.0;
	}

	get timeDuration() {
		return this.timeEnd - this.timeStart;
	}
}

class FweenSequence {

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
		if (!window.fweenTicker) window.fweenTicker = new FweenTicker();

		// Create a new Fween
		this.sequenceSteps = []; // IFweenStep
		this.sequenceStepsMetadatas = []; // FweenStepMetadata

		this.isPlaying = true;
		this.currentStep = 0;
		this.startTime = window.window.fweenTicker.getTime();
		this.pauseTime = 0.0;
		this.executedTime = 0.0;
		this.duration = 0.0;

		// Add to list
		window.fweenTicker.add(this);
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	// Play control methods

	play() {
		if (!this.isPlaying) {
			this.isPlaying = true;
			var timePaused = window.fweenTicker.getTime() - this.pauseTime;
			this.startTime += timePaused;
		}
		return this;
	}

	pause() {
		if (this.isPlaying) {
			this.isPlaying = false;
			this.pauseTime = window.fweenTicker.getTime();
		}
		return this;
	}

	// Utility methods

	call(func) {
		this.addStep(new FweenStepCall(func));
		return this;
	}

	wait(duration) {
		this.duration += this.duration;
		return this;
	}


	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

	// Core tween step control methods

	addStep(step) {
		this.sequenceSteps.push(step);

		var tweenMetadata = new FweenStepMetadata();
		tweenMetadata.timeStart = this.startTime + this.duration;
		this.duration += step.getDuration();
		tweenMetadata.timeEnd = this.startTime + this.duration;

		this.sequenceStepsMetadatas.push(tweenMetadata);
	}

	update() {
		// Update current step(s) based on the time

		// Check if finished
		if (this.currentStep >= this.sequenceSteps.length) {
			this.destroy()
		} else {
			var shouldUpdateOnce = this.isPlaying;

			while (shouldUpdateOnce && this.currentStep < this.sequenceSteps.length) {
				shouldUpdateOnce = false;

				if (window.fweenTicker.getTime() >= this.sequenceStepsMetadatas[this.currentStep].timeStart) {
					// Start the current tween step if necessary
					if (!this.sequenceStepsMetadatas[this.currentStep].hasStarted) {
						this.sequenceSteps[this.currentStep].start();
						this.sequenceStepsMetadatas[this.currentStep].hasStarted = true;
					}

					// Update the current tween step
					this.sequenceSteps[this.currentStep].update(MathUtils.map(window.fweenTicker.getTime(), this.sequenceStepsMetadatas[this.currentStep].timeStart, this.sequenceStepsMetadatas[this.currentStep].timeEnd, 0, 1, true));

					// Check if it's finished
					if (window.fweenTicker.getTime() >= this.sequenceStepsMetadatas[this.currentStep].timeEnd) {
						if (!this.sequenceStepsMetadatas[this.currentStep].hasCompleted) {
							this.sequenceSteps[this.currentStep].end();
							this.sequenceStepsMetadatas[this.currentStep].hasCompleted = true;
							this.executedTime += this.sequenceStepsMetadatas[this.currentStep].timeDuration;
							shouldUpdateOnce = true;
							this.currentStep++;
						}
					}
				}
			}
		}
	}

	destroy() {
		window.fweenTicker.remove(this);
	}

	getTransition(transition) {
		return transition == null ? Easing.none : transition;
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

class FweenGameObjectSequence extends FweenSequence {

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(object) {
		super();
		this.targetObject = object;
	}

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	/*
	 public ZTweenGameObjectSequence scaleFrom(Vector3 scale) {
	 addStep(new ZTweenStepScaleFrom(targetGameObject, scale));
	 return this;
	 }
	 */
}

class FweenStepCall {

	// Extension functions
	constructor(func) {
		this.action = func;
	}

	start() { }

	update(t) { }

	end() {
		this.action();
	}

	getDuration() {
		return 0;
	}
}

// Steps for generic sequences

// Steps for GetterSetter sequences

class FweenStepValueFrom {

	constructor(targetSet, targetValue) {
		this.targetSet = targetSet;
		this.targetValue = targetValue;
	}

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

class FweenTicker {

	constructor() {
		this.fweenSequences = [];

		this.time = 0;

		this.updateBound = this.update.bind(this);
		this.updateBound();
	}

	update() {
		requestAnimationFrame(this.updateBound);

		this.time = Date.now() / 1000;

		for (var i = 0; i < this.fweenSequences.length; i++) {
			if (this.fweenSequences[i] != null) {
				this.fweenSequences[i].update();
			} else {
				this.fweenSequences.splice(i, 1);
				i--;
			}
		}
	}

	getTime() {
		return this.time;
	}

	add(fweenSequence) {
		this.fweenSequences.push(fweenSequence);
	}

	remove(fweenSequence) {
		// Nullify first, remove later - otherwise it gets remove while doing Update(), which can cause the list to trip on itself
		var idx = this.fweenSequences.indexOf(fweenSequence);
		if (idx > -1) this.fweenSequences[idx] = null;
	}
}
