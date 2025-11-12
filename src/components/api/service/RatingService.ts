import api from "../api.ts"; // твой pre-configured axios instance

export interface StudentAvatar {
    large: string;
    medium: string;
    thumb: string;
}

export interface University {
    id: number;
    name: string;
    abbreviation: string;
    city: {
        id: number;
        name: string;
    };
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    group_number: string;
    avatar: StudentAvatar;
    score: number;
    university: University;
}

export interface UsersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}

class RatingService {
    /**
     * Получение списка пользователей
     * @param page страница (default 1)
     * @param per_page количество элементов на страницу (default 10)
     * @param query поисковый запрос
     * @param universityIds массив id университетов
     * @param cityIds массив id городов
     */
    static async getUsers(
        page = 1,
        per_page = 20,
        query = "",
        universityIds?: number[],
        cityIds?: number[]
    ): Promise<UsersResponse> {
        const params: Record<string, any> = { page, per_page };

        if (query) params.query = query;
        if (universityIds) params.university_id = universityIds.join(",");
        if (cityIds) params.city_id = cityIds.join(",");

        console.log("[RatingService] GET /api/v2/users/ params:", params);

        try {
            const resp = await api.get<UsersResponse>("/api/v2/users/", { params });
            console.log("[RatingService] Response data:", resp.data);
            return resp.data;
        } catch (err) {
            console.error("[RatingService] Error fetching users:", err);
            throw err;
        }
    }

    static async getUserById(id: number) {
        console.log(`[RatingService] Fetching user with ID: ${id}`);
        try {
            const resp = await api.get(`/api/v1/user/${id}/`);
            console.log(`[RatingService] User data received:`, resp.data);
            return resp.data;
        } catch (err) {
            console.error(`[RatingService] Error fetching user ${id}:`, err);
            throw err;
        }
    }

}

export default RatingService;
