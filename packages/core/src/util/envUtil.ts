export function isRunningOnNode(): boolean {
  return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}

export function isRunningOnBrowser(): boolean {
  return typeof window !== "undefined";
}
