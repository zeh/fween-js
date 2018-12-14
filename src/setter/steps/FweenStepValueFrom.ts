export default class FweenStepValueFrom {

	// A step to set the starting value

	// Properties
	private _targetSet: (value: number) => void;
	private _targetValue: number | (() => number);


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(targetSet: (value: number) => void, targetValue: number | (() => number)) {
		this._targetSet = targetSet;
		this._targetValue = targetValue;
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start(): void { }

	public update(t: number): void { }

	public end(): void {
		console.log("[FROM] UPDATE @ ", typeof(this._targetValue) === "function" ? this._targetValue() : this._targetValue);
		this._targetSet(typeof(this._targetValue) === "function" ? this._targetValue() : this._targetValue);
	}

	public getDuration(): number {
		return 0;
	}
}
