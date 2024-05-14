type ValueOf<T> = T[keyof T];
export declare function groupBy<T>(array: T[], iteratee: (value: T, index: number, array: T[]) => string | number): Record<string | number, T[]>;
export declare function omitBy<T extends object>(obj: T, predicate: (objElement: ValueOf<T>, k: string | number | symbol) => boolean): Partial<T>;
export {};
//# sourceMappingURL=collections.d.ts.map