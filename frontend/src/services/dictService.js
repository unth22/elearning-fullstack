const BASE_URL = "/api";

export async function searchDict(query) {
  const res = await fetch(`${BASE_URL}/dict/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Không thể tra cứu từ vựng.");
  return res.json();
}
