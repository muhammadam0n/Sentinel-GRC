export const API_BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API error: ${status}`);
    this.status = status;
    this.body = body;
  }
}

const withTimeout = async <T>(promise: Promise<T>, ms: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await promise;
  } finally {
    clearTimeout(timeout);
  }
};

export const apiGet = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await withTimeout(
    fetch(`${API_BASE}${path}`, { ...init, method: "GET" }),
    15000
  );
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
};

export const apiSend = async <T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
  init?: RequestInit
): Promise<T> => {
  const res = await withTimeout(
    fetch(`${API_BASE}${path}`, {
      ...init,
      method,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      body: body === undefined ? undefined : JSON.stringify(body)
    }),
    15000
  );
  if (res.status === 204) return null as T;
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
};

