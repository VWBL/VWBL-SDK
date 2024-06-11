export default class ConnectionManager {
    private promisesAwaitingConnection;
    resolveAllAwaiting(): void;
    rejectAllAwaiting(error: Error): void;
    awaitConnection(): Promise<void>;
}
//# sourceMappingURL=ConnectionManager.d.ts.map