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

/**
 * 30 seconds, not 10. The deployed API runs on a free tier that sleeps when
 * idle, and the first request after a sleep has to wait for it to wake — which
 * can take the better part of a minute. A short timeout would report "server
 * unreachable" for a server that is merely waking up.
 */
export const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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

  // Timed out waiting for a reply — most often a sleeping free-tier server.
  if (error.code === 'ECONNABORTED') {
    return (
      'The server took too long to respond.\n\n' +
      'It may be waking up after being idle. Please try again in a moment.'
    );
  }

  if (error.request) {
    return (
      `Cannot reach the server at ${BASE_URL}.\n\n` +
      'Check that the backend is running, and if you are running it locally, ' +
      'that your phone is on the same WiFi network as your computer.'
    );
  }

  return error.message ?? 'Something went wrong.';
}
