
export const inFlightRequests = new Map<string, Promise<any>>();


export const inFlightMutations = new Map<string, Promise<any>>();

// Generate unique key for mutation types
export function mutationKey(method: string, url: string, body?: any) {
    const bodyKey = body ? JSON.stringify(body) : "";
    return `${method}:${url}:${bodyKey}`;
}
