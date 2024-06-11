const validate = (token: any) => {
    const validToken = true;

    if (!validToken || !token) return false;

    return true;
};

export function authMiddleware(request: Request) {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    return { isValid: validate(token) };
}
