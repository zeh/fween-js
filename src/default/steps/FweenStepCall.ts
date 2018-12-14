export default class FweenStepCall {

	// A step to call a function
	private _action: Function;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(func: Function) {
		this._action = func;
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start(): void { }

	public update(t: number): void { }

	public end(): void {
		this._action();
	}

	public getDuration(): number {
		return 0;
	}
}
