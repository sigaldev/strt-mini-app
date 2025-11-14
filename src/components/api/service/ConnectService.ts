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
}

export default ConnectService;