import { createContext, useCallback, useContext, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api/config";
import {
  clearAuthSession,
  getStoredApiKey,
  getStoredToken,
  getStoredUser,
  saveAuthSession,
} from "../utils/authStorage";

const AuthContext = createContext(null);

function extractErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (!data) {
    if (error?.message === "Network Error" || !error?.response) {
      return "Bağlantı hatası. Sunucuya ulaşılamıyor.";
    }
    return fallback;
  }

  if (typeof data.message === "string" && data.message) {
    const fieldErrors = data.errors;
    if (fieldErrors && typeof fieldErrors === "object") {
      const first = Object.values(fieldErrors).flat()[0];
      if (first) return first;
    }
    return data.message;
  }

  if (data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }

  return fallback;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());

  const applySession = useCallback((payload) => {
    const nextToken = payload?.token ?? null;
    const nextUser = payload?.user ?? null;
    // Prefer top-level api_key; fallback to user.api_key (login may only nest it)
    const fromPayload =
      payload?.api_key ??
      nextUser?.api_key ??
      null;
    const nextApiKey = fromPayload || getStoredApiKey() || null;

    saveAuthSession({
      token: nextToken,
      user: nextUser,
      apiKey: nextApiKey || undefined,
    });

    setToken(nextToken);
    setUser(nextUser);
    if (nextApiKey) setApiKey(nextApiKey);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });
      applySession(data);
      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        message: extractErrorMessage(error, "Giriş başarısız."),
      };
    }
  }, [applySession]);

  const register = useCallback(async ({ name, email, password }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/register`, {
        name,
        email,
        password,
      });
      // Do not auto-login after register; still persist api_key for Settings after login.
      if (data?.api_key || data?.user?.api_key) {
        const key = data.api_key || data.user?.api_key;
        saveAuthSession({ apiKey: key });
        setApiKey(key);
      }
      return { ok: true, data, message: data?.message || "Kayıt başarılı." };
    } catch (error) {
      return {
        ok: false,
        message: extractErrorMessage(error, "Kayıt başarısız."),
        errors: error?.response?.data?.errors || null,
      };
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setToken(null);
    setUser(null);
    setApiKey(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      apiKey,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, apiKey, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
