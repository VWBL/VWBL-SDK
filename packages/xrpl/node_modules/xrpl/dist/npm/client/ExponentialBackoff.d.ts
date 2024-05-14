interface ExponentialBackoffOptions {
    min?: number;
    max?: number;
}
export default class ExponentialBackoff {
    private readonly ms;
    private readonly max;
    private readonly factor;
    private numAttempts;
    constructor(opts?: ExponentialBackoffOptions);
    get attempts(): number;
    duration(): number;
    reset(): void;
}
export {};
//# sourceMappingURL=ExponentialBackoff.d.ts.map