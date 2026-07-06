import { API_BASE } from "@/config/api";

class CollisionAlert {
    constructor(data) {
        Object.assign(this, data);
    }

    static async list(order = "", limit = 100) {
        const url = `${API_BASE}/api/collision/alerts?order=${order}&limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load alert data");
        return await res.json();
    }
}

export default CollisionAlert;
