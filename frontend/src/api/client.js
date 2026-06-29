// Thin client for the backend REST API.
// With an empty VITE_API_BASE the Vite dev proxy forwards /api to the backend.
const BASE = import.meta.env.VITE_API_BASE || "";

async function postJSON(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(detail);
  }
  return res.json();
}

export function analyzeRepo(path) {
  return postJSON("/api/analyze", { path });
}

export function getFile(root, path) {
  return postJSON("/api/file", { root, path });
}

export function explainFile(root, path, force = false) {
  return postJSON("/api/explain", { root, path, force });
}

export async function getHealth() {
  const res = await fetch(`${BASE}/api/health`);
  return res.json();
}
