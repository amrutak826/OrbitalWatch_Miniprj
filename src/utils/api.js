const BASE = "http://127.0.0.1:8000";

export async function apiGet(url) {
    const res = await fetch(BASE + url);
    if (!res.ok) throw new Error("API error: " + res.status);
    return res.json();
}
