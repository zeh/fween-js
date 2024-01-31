import FweenSequence from "../default/FweenSequence";
import FweenTicker from "../FweenTicker";
import FweenStepValueFrom from "./steps/FweenStepValueFrom";
import FweenStepValueTo from "./steps/FweenStepValueTo";

export default class FweenSetterSequence extends FweenSequence {
	// A sequence that uses a setter function

	// Properties
	private _targetValue: number;
	private _targetSet: (value: number) => void;

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(targetSet: (value: number) => void, ticker: FweenTicker) {
		super(ticker);

		this._targetValue = 0;
		this._targetSet = targetSet;
	}

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public from(value: number | (() => number)): FweenSetterSequence {
		this.addStep(new FweenStepValueFrom(this.setValue.bind(this), value));
		return this;
	}

	public to(value: number, duration: number = 0, transition?: (t: number) => number): FweenSetterSequence {
		this.addStep(
			new FweenStepValueTo(
				this.getValue.bind(this),
				this.setValue.bind(this),
				value,
				duration,
				this.getTransition(transition),
			),
		);
		return this;
	}

	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

	private setValue(t: number): void {
		this._targetValue = t;
		this._targetSet(t);
	}

	private getValue(): number {
		return this._targetValue;
	}
}
