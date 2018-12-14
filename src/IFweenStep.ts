export default interface IFweenStep {
	start(): void;
	update(t: number): void;
	end(): void;
	getDuration(): number;
}
