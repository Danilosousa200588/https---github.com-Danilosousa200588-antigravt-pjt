// Polyfill for node-fetch in the browser
export default typeof window !== 'undefined' ? window.fetch.bind(window) : undefined;
export const Headers = typeof window !== 'undefined' ? window.Headers : undefined;
export const Request = typeof window !== 'undefined' ? window.Request : undefined;
export const Response = typeof window !== 'undefined' ? window.Response : undefined;
