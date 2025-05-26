import { jwtDecode } from 'jwt-decode';
import { getUser } from '../api/user/user';


interface JwtPayload {
    sub: string; // user ID
    exp: number; // in seconds
}

export function saveAccessToken(token: string) {
    localStorage.setItem('access_token', token);
}

export function getAccessToken() {
    return localStorage.getItem('access_token');
}

export function clearAccessToken() {
    localStorage.removeItem('access_token');
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000); // current time in seconds
        return decoded.exp < now;
    } catch {
        return true; // invalid token = treat as expired
    }
};

export async function getCurrentUser() {
    const token = getAccessToken();
    if (!token) return null;

    const { getUserApiUserUserIdGet } = getUser()

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.sub) {
            console.error('Token does not contain a valid user ID (sub).');
            return null;
        }
        const user = await getUserApiUserUserIdGet(decoded.sub);
        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

