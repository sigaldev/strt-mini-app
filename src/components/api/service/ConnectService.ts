import api from "../api.ts";

class ConnectService {
    static async sendConnectRequest(to_user_id: string | number): Promise<void> {
        console.log(`[ConnectService] Sending connect request to user ID: ${to_user_id}`);
        try {
            const resp = await api.post(`/api/v1/connects/add/${to_user_id}`);
            console.log("[ConnectService] Connect request sent successfully:", resp.data);
        } catch (err) {
            console.error("[ConnectService] Error sending connect request:", err);
            throw err;
        }
    }

    static async getConnectRequests(page = 1, per_page = 10): Promise<any[]> {
        console.log(`[ConnectService] Fetching connect requests, page: ${page}, per_page: ${per_page}`);
        try {
            const resp = await api.get("/api/v1/connects/requests", {
                params: { page, per_page },
            });
            console.log("[ConnectService] Connect requests fetched:", resp.data.requests);
            return resp.data.requests;
        } catch (err) {
            console.error("[ConnectService] Error fetching connect requests:", err);
            return [];
        }
    }

    static async acceptConnectRequest(connect_request_id: number): Promise<void> {
        console.log(`[ConnectService] Accepting connect request ID: ${connect_request_id}`);
        try {
            const resp = await api.post(`/api/v1/connects/accept/${connect_request_id}`);
            console.log("[ConnectService] Connect request accepted:", resp.data);
        } catch (err) {
            console.error("[ConnectService] Error accepting connect request:", err);
            throw err;
        }
    }

    static async rejectConnectRequest(connect_request_id: number): Promise<void> {
        console.log(`[ConnectService] Rejecting connect request ID: ${connect_request_id}`);
        try {
            const resp = await api.post(`/api/v1/connects/reject/${connect_request_id}`);
            console.log("[ConnectService] Connect request rejected:", resp.data);
        } catch (err) {
            console.error("[ConnectService] Error rejecting connect request:", err);
            throw err;
        }
    }
}

export default ConnectService;
