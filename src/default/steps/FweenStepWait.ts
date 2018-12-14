export default class FweenStepWait {

	private _duration: number;

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(duration: number) {
		this._duration = duration;
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public start(): void { }

	public update(t: number): void { }

	public end(): void { }

	public getDuration(): number {
		return this._duration;
	}
}
