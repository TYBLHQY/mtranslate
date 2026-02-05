import { net } from "electron";

export async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  return Promise.race([
    net.fetch(url, options),
    new Promise<Response>((_, rej) => setTimeout(() => rej(new Error("timedout")), 5000)),
  ]);
}
