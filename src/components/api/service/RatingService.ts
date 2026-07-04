import api from "../api.ts"; // твой pre-configured axios instance

export interface StudentAvatar {
    large?: { url: string | null };
    medium?: { url: string | null };
    thumb?: { url: string | null };
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
    group?: {
        id: number;
        name: string;
    };
    rank?: string;
    connects?: number;
    bio?: string;
    in_connect?: boolean;
    is_connect_sent?: boolean;
    achievements?: {
        id: string | number;
        title?: string;
        name?: string;
        logo?: {
            medium?: string;
            original?: string;
        };
    }[];
}

export interface UsersResponse {
    users: User[];
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
        const params: Record<string, string | number> = { page, per_page };

        if (query) params.query = query;
        if (universityIds) params.university_id = universityIds.join(",");
        if (cityIds) params.city_id = cityIds.join(",");

        const resp = await api.get<UsersResponse>("/api/v2/users/", { params });
        return resp.data;
    }

    static async getUserById(id: number): Promise<{ user: User }> {
        const resp = await api.get(`/api/v1/user/${id}/`);
        return resp.data;
    }

}

export default RatingService;
