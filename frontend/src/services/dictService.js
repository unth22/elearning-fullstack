import { authHeaders } from "./authService";

const BASE_URL = "/api";

export async function searchDict(query) {
  const res = await fetch(`${BASE_URL}/dict/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Không thể tra cứu từ vựng.");
  return res.json();
}

export async function explainWord(word) {
  const res = await fetch(`${BASE_URL}/dict/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ word }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể giải thích từ này.");
  return data;
}
