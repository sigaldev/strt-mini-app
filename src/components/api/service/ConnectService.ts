import api from "../api.ts";

export interface ConnectAvatar {
    large?: { url: string | null };
    medium?: { url: string | null };
    thumb?: { url: string | null };
}

export interface ConnectUser {
    id: number;
    first_name: string;
    last_name: string;
    group_number: string;
    university?: {
        id: number;
        name: string;
        abbreviation: string;
    };
    avatar?: ConnectAvatar | null;
    level?: number | null;
}

export interface Connect {
    user: ConnectUser;
}

export interface ConnectRequest {
    connect_request_id: number;
    from_user: ConnectUser;
}

class ConnectService {
    static async sendConnectRequest(to_user_id: string | number): Promise<void> {
        await api.post(`/api/v1/connects/add/${to_user_id}`);
    }

    static async getConnectRequests(page = 1, per_page = 10): Promise<ConnectRequest[]> {
        const resp = await api.get("/api/v1/connects/requests", {
            params: { page, per_page },
        });
        return resp.data.requests || [];
    }

    static async acceptConnectRequest(connect_request_id: number): Promise<void> {
        await api.post(`/api/v1/connects/accept/${connect_request_id}`);
    }

    static async rejectConnectRequest(connect_request_id: number): Promise<void> {
        await api.post(`/api/v1/connects/reject/${connect_request_id}`);
    }

    static async getUserConnects(user_id: string | number): Promise<Connect[]> {
        const resp = await api.get(`/api/v1/connects/${user_id}`);
        return resp.data.connects || [];
    }
}

export default ConnectService;
