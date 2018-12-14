import { map } from "moremath";

type ValuesObject = { [key: string]: number };

export default class FweenStepValuesTo {

	// A step to tween to an object with values

	// Properties
	private _targetGet: (name: string) => number;
	private _targetSet: (name: string, value: number) => void;
	private _duration: number;
	private _startValues: ValuesObject;
	private _targetValues: ValuesObject;
	private _transition: (t: number) => number;
	private _names: string[];

	constructor(targetGet: (name: string) => number, targetSet: (name: string, value: number) => void, targetValues: ValuesObject, duration: number, transition: (t: number) => number) {
		this._targetGet = targetGet;
		this._targetSet = targetSet;
		this._duration = duration;
		this._targetValues = targetValues;
		this._transition = transition;
		this._names = Object.keys(targetValues);
	}

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start(): void {
		this._startValues = {};
		this._names.forEach((name) => {
			this._startValues[name] = this._targetGet(name);
		});
	}

	public update(t: number): void {
		this._names.forEach((name) => {
			this._targetSet(name, map(this._transition(t), 0, 1, this._startValues[name], this._targetValues[name]));
		});
	}

	public end(): void {
		this._names.forEach((name) => {
			this._targetSet(name, this._targetValues[name]);
		});
	}

	public getDuration(): number {
		return this._duration;
	}
}
