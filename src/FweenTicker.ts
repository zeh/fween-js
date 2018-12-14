import FweenSequence from "./default/FweenSequence";

export default class FweenTicker {

	// Ticker class to control updates

	// Properties
	private sequences: Array<FweenSequence | null> = [];
	private time: number = 0.0;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
		this.update = this.update.bind(this);
		this.update();
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	private update(): void {
		window.requestAnimationFrame(this.update);

		this.time = Date.now() / 1000;

		for (let i = 0; i < this.sequences.length; i++) {
			const sequence = this.sequences[i];
			if (sequence) {
				sequence.update();
			} else {
				this.sequences.splice(i, 1);
				i--;
			}
		}
	}

	public getTime(): number {
		return this.time;
	}

	public add(sequence: FweenSequence): void {
		this.sequences.push(sequence);
	}

	public remove(sequence: FweenSequence): void {
		// Nullify first, remove later - otherwise it gets remove while doing Update(), which can cause the list to trip over itself
		const idx = this.sequences.indexOf(sequence);
		if (idx > -1) this.sequences[idx] = null;
	}
}
