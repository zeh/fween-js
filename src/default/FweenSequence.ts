import { map } from "moremath";

import Easing from "../easings/Easing";
import Fween from "../Fween";
import FweenStepCall from "./steps/FweenStepCall";
import FweenStepMetadata from "../FweenStepMetadata";
import FweenStepWait from "./steps/FweenStepWait";
import IFweenStep from "../IFweenStep";

export default class FweenSequence {

	// One sequence of steps

	// Properties
	private _steps: IFweenStep[] = [];
	private _stepsMetadatas: FweenStepMetadata[] = [];

	private _isPlaying: boolean = false;
	private _currentStep: number = 0;
	private _startTime: number = 0.0;
	private _pauseTime: number = 0.0;
	private _executedTime: number = 0.0;
	private _duration: number = 0.0;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
		// Create a new Fween
		this._startTime = Fween.getTicker().getTime();
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	// Play control methods

	/**
	 * Play (or resume) the sequence
	 */
	public play(): FweenSequence {
		if (!this._isPlaying) {
			this._isPlaying = true;
			let timePaused = Fween.getTicker().getTime() - this._pauseTime;
			this._startTime += timePaused;
			Fween.getTicker().add(this);
		}
		return this;
	}

	/**
	 * Pause the sequence at the current position
	 */
	public pause(): FweenSequence {
		if (this._isPlaying) {
			this._isPlaying = false;
			this._pauseTime = Fween.getTicker().getTime();
			Fween.getTicker().remove(this);
		}
		return this;
	}

	/**
	 * Stop the sequence completely
	 */
	public stop(): FweenSequence {
		if (this._isPlaying) {
			this.pause();
			// TODO: do pause() and seek() instead
			this._startTime = Fween.getTicker().getTime();
			this._executedTime = 0;
		}
		return this;
	}

	public isPlaying(): boolean {
		return this._isPlaying;
	}

	// Utility methods

	/**
	 * Call a function
	 */
	public call(func: Function): FweenSequence {
		this.addStep(new FweenStepCall(func));
		return this;
	}

	/**
	 * Wait a number of seconds
	 */
	public wait(duration: number): FweenSequence {
		this.addStep(new FweenStepWait(duration));
		return this;
	}


	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

	// Core tween step control methods; reused by subclasses

	protected addStep(step: IFweenStep): void {
		this._steps.push(step);

		let tweenMetadata = new FweenStepMetadata();
		tweenMetadata.timeStart = this._startTime + this._duration;
		this._duration += step.getDuration();
		tweenMetadata.timeEnd = this._startTime + this._duration;

		this._stepsMetadatas.push(tweenMetadata);
	}

	public update(): void {
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
					this._steps[this._currentStep].update(map(Fween.getTicker().getTime(), this._stepsMetadatas[this._currentStep].timeStart, this._stepsMetadatas[this._currentStep].timeEnd, 0, 1, true));

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

	protected getTransition(transition?: (t: number) => number): (t: number) => number {
		return transition ? transition : Easing.none;
	}

	private destroy(): void {
		Fween.getTicker().remove(this);
	}
}
