/**
 * @author	Zeh Fernando
 * @version	1.0
 * @since	2015-08-03
 */

import SimpleSignal from './../signals/SimpleSignal';
import Easing from './Easing';
import MathUtils from './../utils/MathUtils';

/*
 Ideas for tweening - from https://github.com/zeh/unity-tidbits/blob/master/transitions/ZTween.cs

 DONE:

 Fween
 .use(getter, setter?)
 .from(value)
 .to(value, t, transition)
 .call(f)
 .wait(t)

 .play()
 .pause()
 .isPlaying()

 TODO:
 .stop()
 .seek()

 .use(obj)
 + transition with element style objects
 + transition with css transitions

 */

// TODO: this library has .time, .duration, and .getDuration(). Make your mind!

// https://github.com/zeh/unity-tidbits/blob/master/transitions/ZTween.cs

export default class Fween {

	// Main class - just a starting point
	private static ticker:FweenTicker = null;

	// Properties

	// ================================================================================================================
	// PUBLIC STATIC INTERFACE ----------------------------------------------------------------------------------------

	public static use(object1:() => number, object2:(v:number) => void):FweenGetterSetterSequence;
	public static use(object1:Object):FweenObjectSequence;
	public static use(object1:any, object2?:any):FweenSequence {
		if (typeof(object1) === "object") {
			// Object
			return new FweenObjectSequence(object1);
		} else if (typeof(object1) === "function" && typeof(object2) === "function") {
			// Getter/setter
			return new FweenGetterSetterSequence(object1, object2);
		}

		console.error("Tweening parameters were not understood.");
		return null;
	}

	public static getTicker():FweenTicker {
		if (!this.ticker) this.ticker = new FweenTicker();
		return this.ticker;
	}
}

// Create a global object with the class - only used in the single file version, replaced at build time
// #IFDEF ES5SINGLE // window["Fween"] = Fween;

// ================================================================================================================
// INTERNAL CLASSES -----------------------------------------------------------------------------------------------

// Aux classes

class FweenStepMetadata {

	// Class to maintain metadata related to each step of a Fween sequence

	// Properties
	public hasStarted:boolean = false;
	public hasCompleted:boolean = false;
	public timeStart:number = 0.0;
	public timeEnd:number = 0;

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
	}

	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	public get timeDuration():number {
		return this.timeEnd - this.timeStart;
	}
}

export interface IFweenStep {
	start():void;
	update(t:number):void;
	end():void;
	getDuration():number;
}

export class FweenSequence {

	// One sequence of steps

	// Properties
	private _steps:Array<IFweenStep> = [];
	private _stepsMetadatas:Array<FweenStepMetadata> = [];

	private _isPlaying:boolean = false;
	private _currentStep:number = 0;
	private _startTime:number = 0.0;
	private _pauseTime:number = 0.0;
	private _executedTime:number = 0.0;
	private _duration:number = 0.0;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
		// Create a new Fween
		this._startTime = Fween.getTicker().getTime();

		// Add to list
		Fween.getTicker().add(this);
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	// Play control methods

	/**
	 * Play (or resume) the sequence
	 */
	public play():FweenSequence {
		if (!this._isPlaying) {
			this._isPlaying = true;
			let timePaused = Fween.getTicker().getTime() - this._pauseTime;
			this._startTime += timePaused;
		}
		return this;
	}

	/**
	 * Pause the sequence
	 */
	public pause():FweenSequence {
		if (this._isPlaying) {
			this._isPlaying = false;
			this._pauseTime = Fween.getTicker().getTime();
		}
		return this;
	}

	public isPlaying():boolean {
		return this._isPlaying;
	}

	// Utility methods

	/**
	 * Call a function
	 */
	public call(func:Function):FweenSequence {
		this.addStep(new FweenStepCall(func));
		return this;
	}

	/**
	 * Wait a number of seconds
	 */
	public wait(duration:number):FweenSequence {
		this._duration += this._duration;
		return this;
	}


	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

	// Core tween step control methods; reused by subclasses

	protected addStep(step:IFweenStep):void {
		this._steps.push(step);

		let tweenMetadata = new FweenStepMetadata();
		tweenMetadata.timeStart = this._startTime + this._duration;
		this._duration += step.getDuration();
		tweenMetadata.timeEnd = this._startTime + this._duration;

		this._stepsMetadatas.push(tweenMetadata);
	}

	public update():void {
		// Update current step(s) based on the time

		// Check if finished
		if (this._currentStep >= this._steps.length) {
			this.destroy();
		} else {
			let shouldUpdateOnce = this._isPlaying;

			while (shouldUpdateOnce && this._currentStep < this._steps.length) {
				shouldUpdateOnce = false;

				if (Fween.getTicker().getTime() >= this._stepsMetadatas[this._currentStep].timeStart) {
					// Start the current tween step if necessary
					if (!this._stepsMetadatas[this._currentStep].hasStarted) {
						this._steps[this._currentStep].start();
						this._stepsMetadatas[this._currentStep].hasStarted = true;
					}

					// Update the current tween step
					this._steps[this._currentStep].update(MathUtils.map(Fween.getTicker().getTime(), this._stepsMetadatas[this._currentStep].timeStart, this._stepsMetadatas[this._currentStep].timeEnd, 0, 1, true));

					// Check if it's finished
					if (Fween.getTicker().getTime() >= this._stepsMetadatas[this._currentStep].timeEnd) {
						if (!this._stepsMetadatas[this._currentStep].hasCompleted) {
							this._steps[this._currentStep].end();
							this._stepsMetadatas[this._currentStep].hasCompleted = true;
							this._executedTime += this._stepsMetadatas[this._currentStep].timeDuration;
							shouldUpdateOnce = true;
							this._currentStep++;
						}
					}
				}
			}
		}
	}

	protected getTransition(transition:(t:number) => number):(t:number) => number {
		return transition == null ? Easing.none : transition;
	}

	private destroy():void {
		Fween.getTicker().remove(this);
	}
}

class FweenGetterSetterSequence extends FweenSequence {

	// A sequence for getter/setter pairs

	// Properties
	private _targetGet:() => number;
	private _targetSet:(value:number) => void;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(targetGet:() => number, targetSet:(value:number) => void) {
		super();

		this._targetGet = targetGet;
		this._targetSet = targetSet;
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public from(value:number):FweenGetterSetterSequence {
		this.addStep(new FweenStepValueFrom(this._targetSet, value));
		return this;
	}

	public to(value:number, duration:number = 0, transition:(t:number) => number = null):FweenGetterSetterSequence {
		this.addStep(new FweenStepValueTo(this._targetGet, this._targetSet, value, duration, this.getTransition(transition)));
		return this;
	}
}

class FweenObjectSequence extends FweenSequence {

	// A sequence for common objects' properties

	// Properties
	private _targetObject:Object;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(object:Object) {
		super();

		this._targetObject = object;
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

// Common steps

class FweenStepCall {

	// A step to call a function
	private _action:Function;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(func:Function) {
		this._action = func;
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start():void { }

	public update(t:number):void { }

	public end():void {
		this._action();
	}

	public getDuration():number {
		return 0;
	}
}

// Steps for specific sequences: GetterSetter

class FweenStepValueFrom {

	// A step to set the starting value

	// Properties
	private _targetSet:(value:number) => void;
	private _targetValue:number;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(targetSet:(value:number) => void, targetValue:number) {
		this._targetSet = targetSet;
		this._targetValue = targetValue;
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start():void { }

	public update(t:number):void { }

	public end():void {
		this._targetSet(this._targetValue);
	}

	public getDuration():number {
		return 0;
	}
}

class FweenStepValueTo {

	// A step to tween to a value

	// Properties
	private _targetGet:() => number;
	private _targetSet:(value:number) => void;
	private _duration:number;
	private _startValue:number;
	private _targetValue:number;
	private _transition:(t:number) => number;

	constructor(targetGet:() => number, targetSet:(value:number) => void, targetValue:number, duration:number, transition:(t:number) => number) {
		this._targetGet = targetGet;
		this._targetSet = targetSet;
		this._duration = duration;
		this._targetValue = targetValue;
		this._transition = transition;
	}

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start():void {
		this._startValue = this._targetGet();
	}

	public update(t:number):void {
		this._targetSet(MathUtils.map(this._transition(t), 0, 1, this._startValue, this._targetValue));
	}

	public end():void {
		this._targetSet(this._targetValue);
	}

	public getDuration():number {
		return this._duration;
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

	// Ticker class to control updates

	// Properties
	private sequences:Array<FweenSequence> = [];
	private time:number = 0.0;
	private updateBound:() => void;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
		this.updateBound = this.update.bind(this);
		this.updateBound();
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	private update():void {
		window.requestAnimationFrame(this.updateBound);

		this.time = Date.now() / 1000;

		for (var i = 0; i < this.sequences.length; i++) {
			if (this.sequences[i] != null) {
				this.sequences[i].update();
			} else {
				this.sequences.splice(i, 1);
				i--;
			}
		}
	}

	public getTime():number {
		return this.time;
	}

	public add(sequence:FweenSequence):void {
		this.sequences.push(sequence);
	}

	public remove(sequence:FweenSequence):void {
		// Nullify first, remove later - otherwise it gets remove while doing Update(), which can cause the list to trip on itself
		var idx = this.sequences.indexOf(sequence);
		if (idx > -1) this.sequences[idx] = null;
	}
}
