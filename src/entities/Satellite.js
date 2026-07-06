import { API_BASE } from "@/config/api";

class Satellite {
    constructor(data) {
        Object.assign(this, data);
    }

    static async list(order = "", limit = 200) {
        const url = `${API_BASE}/api/satellites/all?limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load satellite data");
        return await res.json();
    }
}

export default Satellite;
