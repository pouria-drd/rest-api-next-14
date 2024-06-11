export function logMiddleware(request: Request) {
    const log = { response: request.method + " " + request.url };
    return log;
}
