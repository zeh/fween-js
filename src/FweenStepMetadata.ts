export default class FweenStepMetadata {

	// Class to maintain metadata related to each step of a Fween sequence

	// Properties
	public hasStarted: boolean = false;
	public hasCompleted: boolean = false;
	public timeStart: number = 0.0;
	public timeEnd: number = 0;

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
	}

	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	public get timeDuration(): number {
		return this.timeEnd - this.timeStart;
	}
}
