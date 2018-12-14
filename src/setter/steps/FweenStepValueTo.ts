import { map } from "moremath";

export default class FweenStepValueTo {

	// A step to tween to a value

	// Properties
	private _targetGet: () => number;
	private _targetSet: (value: number) => void;
	private _duration: number;
	private _startValue: number;
	private _targetValue: number;
	private _transition: (t: number) => number;

	constructor(targetGet: () => number, targetSet: (value: number) => void, targetValue: number, duration: number, transition: (t: number) => number) {
		this._targetGet = targetGet;
		this._targetSet = targetSet;
		this._duration = duration;
		this._targetValue = targetValue;
		this._transition = transition;
	}

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start(): void {
		this._startValue = this._targetGet();
	}

	public update(t: number): void {
		this._targetSet(map(this._transition(t), 0, 1, this._startValue, this._targetValue));
	}

	public end(): void {
		this._targetSet(this._targetValue);
	}

	public getDuration(): number {
		return this._duration;
	}
}
