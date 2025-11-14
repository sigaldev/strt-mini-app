import api from "../api";

export interface Scholarship {
    id: number;
    title: string;
    recipient: string;
    amount: string;
    amount_depends_university: boolean;
    description: string;
    link: string;
}

export interface ScholarshipsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    scholarship: Scholarship[];
}

class ScholarshipServiceClass {
    async getScholarships(page: number = 1, per_page: number = 20): Promise<ScholarshipsResponse> {
        try {
            const response = await api.get("/api/scholarship/list/", {
                params: { page, per_page }
            });

            const data = response.data;

            return {
                count: data.scholarship?.length ?? 0,
                next: null,
                previous: null,
                scholarship: Array.isArray(data.scholarship) ? data.scholarship : [],
            };
        } catch (error) {
            console.error("[SCHOLARSHIP SERVICE] Failed to load scholarships:", error);
            return {
                count: 0,
                next: null,
                previous: null,
                scholarship: [],
            };
        }
    }
}

export const ScholarshipService = new ScholarshipServiceClass();
