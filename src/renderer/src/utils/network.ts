export async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, rej) => setTimeout(() => rej(new Error("timedout")), 5000)),
  ]);
}
