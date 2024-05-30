/**
 * Fetch with timeout
 *
 * Works like fetch, but adds a timeout.
 */
export async function fetchWithTimeout(
    url: string,
    timeout: number,
    options: RequestInit = {},
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
        ...options,
        signal: controller.signal,
    });

    clearTimeout(id);
    return response;
}
