import FweenSequence from "../default/FweenSequence";
import FweenStepValuesTo from "./steps/FweenStepValuesTo";

export default class FweenObjectSequence extends FweenSequence {

	// A sequence for common objects' properties

	// Properties
	private _targetObject: any;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(object: any) {
		super();

		this._targetObject = object;
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public to(values: {[key: string]: number }, duration: number = 0, transition?: (t: number) => number): FweenObjectSequence {
		this.addStep(new FweenStepValuesTo(this.getValue.bind(this), this.setValue.bind(this), values, duration, this.getTransition(transition)));
		return this;
	}


	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

	private setValue(name: string, t: number) {
		this._targetObject[name] = t;
	}

	private getValue(name: string): number {
		return this._targetObject[name];
	}
}
