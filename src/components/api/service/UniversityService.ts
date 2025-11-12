import api from "../api";

export interface University {
    id: number;
    name: string;
    abbreviation: string;
    city: {
        id: number;
        name: string;
    };
}

export interface StudentGroup {
    id: number;
    name: string;
}

export interface GroupsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: StudentGroup[];
}

const uniLogger = {
    info: (msg: string, data?: unknown) =>
        console.log(`[UNIVERSITY-SERVICE] [INFO] ${new Date().toISOString()}: ${msg}`, data || ''),
    error: (msg: string, data?: unknown) =>
        console.error(`[UNIVERSITY-SERVICE] [ERROR] ${new Date().toISOString()}: ${msg}`, data || ''),
    debug: (msg: string, data?: unknown) =>
        console.debug(`[UNIVERSITY-SERVICE] [DEBUG] ${new Date().toISOString()}: ${msg}`, data || ''),
};

class UniversityService {
    static async getUniversities(): Promise<University[]> {
        uniLogger.info("Fetching universities…");

        try {
            const resp = await api.get("/api/v1/universities/");

            uniLogger.debug("Raw universities response:", resp.data);

            const data = resp.data.universities;

            if (!Array.isArray(data)) {
                uniLogger.error("Universities response is NOT an array!", resp.data);
            } else {
                uniLogger.info(`Universities loaded: ${data.length}`);
            }

            return data;
        } catch (err) {
            uniLogger.error("Failed to fetch universities", err);
            throw err;
        }
    }

    static async getGroups(university_id: number, query = "", page = 1, per_page = 150): Promise<GroupsResponse> {
        uniLogger.info("Fetching groups…", { university_id, query, page, per_page });

        try {
            const resp = await api.get("/api/v1/universities/groups/", {
                params: { university_id, query, page, per_page },
            });

            uniLogger.debug("Raw groups response:", resp.data);

            if (!resp.data || !Array.isArray(resp.data.results)) {
                uniLogger.error("Groups response is invalid!", resp.data);
            } else {
                uniLogger.info(`Groups loaded: ${resp.data.results.length}`);
            }

            return resp.data;
        } catch (err) {
            uniLogger.error("Failed to fetch groups", err);
            throw err;
        }
    }
}

export default UniversityService;
