import api from "../api.ts";

class ConnectService {
    static async sendConnectRequest(to_user_id: string | number): Promise<void> {
        try {
            const resp = await api.post(`/api/v1/connects/add/${to_user_id}`);
            console.log("Connect request sent:", resp.data);
        } catch (err) {
            console.error("Error sending connect request:", err);
            throw err;
        }
    }

    static async getConnectRequests(page = 1, per_page = 10): Promise<any[]> {
        try {
            const resp = await api.get("/api/v1/connects/requests", {
                params: { page, per_page },
            });
            return resp.data.requests;
        } catch (err) {
            console.error("Error fetching connect requests:", err);
            return [];
        }
    }

    static async acceptConnectRequest(connect_request_id: number): Promise<void> {
        try {
            await api.post(`/api/v1/connects/accept/${connect_request_id}`);
        } catch (err) {
            console.error("Error accepting connect request:", err);
            throw err;
        }
    }

    static async rejectConnectRequest(connect_request_id: number): Promise<void> {
        try {
            await api.post(`/api/v1/connects/reject/${connect_request_id}`);
        } catch (err) {
            console.error("Error rejecting connect request:", err);
            throw err;
        }
    }
}

export default ConnectService;
