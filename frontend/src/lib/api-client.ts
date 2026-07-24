// #759: Auth token is now stored in an httpOnly cookie set by the backend
// on POST /auth/verify. The browser attaches it automatically on every
// request (credentials: "include") so we never touch localStorage for auth.
// This eliminates the XSS token-exfiltration attack surface.
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  // Allow callers to supply extra headers (e.g. Content-Type) without
  // accidentally overwriting anything we set here.
  const headers = new Headers(init?.headers);

  const res = await fetch(input, {
    ...init,
    headers,
    // Tell the browser to include the httpOnly auth_token cookie on
    // cross-origin requests to the API.
    credentials: "include",
  });

  if (res.status === 401 && typeof window !== "undefined") {
    // Clean up any legacy authToken that might still be in localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    // Store current path before redirect so user can return after re-login
    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname + window.location.search,
    );

    // Use history.replaceState to preserve history stack instead of window.location.href
    window.history.replaceState(null, "", "/");
    window.location.reload();
  }

  return res;
}
