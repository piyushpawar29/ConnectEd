import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Gets the authorization header from a request, falling back to cookies if needed
 * @param request The Next.js request object
 * @returns The authorization header or null if not found
 */
export async function getAuthHeader(request: NextRequest | Request): Promise<string | null> {
  // Try to get the authorization header from the request
  let authHeader = request.headers.get('authorization');
  
  // If no auth header, try to get token from cookies
  if (!authHeader) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie ? tokenCookie.value : null;
    
    if (token) {
      authHeader = `Bearer ${token}`;
    }
  }
  
  return authHeader;
}

/**
 * Checks if the request is authenticated and returns an error response if not
 * @param request The Next.js request object
 * @returns An error response if not authenticated, or null if authenticated
 */
export async function requireAuth(request: NextRequest | Request): Promise<NextResponse | null> {
  const authHeader = await getAuthHeader(request);
  
  if (!authHeader) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  
  return null;
}

/**
 * Synchronous function to get token from localStorage (client-side only)
 * @returns The token or null if not found
 */
export function getClientToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Sets the token in both localStorage and cookie (client-side only)
 * @param token The token to set
 */
export function setClientToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  }
}

/**
 * Clears the token from both localStorage and cookie (client-side only)
 */
export function clearClientToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
