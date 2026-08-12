const TOKEN_KEY = "eduente_auth_token";
const USER_KEY = "eduente_auth_user";
const API_KEY_KEY = "eduente_api_key";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredApiKey() {
  return localStorage.getItem(API_KEY_KEY);
}

export function saveAuthSession({ token, user, apiKey }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (apiKey) localStorage.setItem(API_KEY_KEY, apiKey);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(API_KEY_KEY);
}
