/** True when running on the user's own machine (ng serve), false on the deployed Vercel site — used to hide local-only tools that depend on a companion server.js running on localhost. */
export function isLocalHost(): boolean {
  return typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
}
