import axios from 'axios';
import Constants from 'expo-constants';

const API_PORT = 8000;

function resolveBaseUrl() {
  const configured = Constants.expoConfig?.extra?.apiUrl;
  if (configured) return configured;

  const hostUri =
    Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0];

  if (host) return `http://${host}:${API_PORT}`;

  // Last resort
  return `http://localhost:${API_PORT}`;
}

export const BASE_URL = resolveBaseUrl();

export const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // fail fast instead of hanging for ever on a bad address
  headers: { 'Content-Type': 'application/json' },
});

export function toErrorMessage(error) {
  if (error.response) {
    const { status, data } = error.response;

    // FastAPI validation errors arrive as a list of {loc, msg} objects.
    if (status === 422 && Array.isArray(data?.detail)) {
      return data.detail.map((d) => d.msg).join('\n');
    }
    if (typeof data?.detail === 'string') return data.detail;
    return `Request failed (HTTP ${status}).`;
  }

  if (error.request) {
    return (
      `Cannot reach the server at ${BASE_URL}.\n\n` +
      'Check that the backend is running and that your phone is on the same ' +
      'WiFi network as your computer.'
    );
  }

  return error.message ?? 'Something went wrong.';
}
