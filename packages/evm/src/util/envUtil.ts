export function isRunningOnNode(): boolean {
  return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}
<<<<<<< HEAD

export function isRunningOnBrowser(): boolean {
  return typeof window !== "undefined";
}
=======
  
export function isRunningOnBrowser(): boolean {
  return typeof window !== "undefined";
}
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
