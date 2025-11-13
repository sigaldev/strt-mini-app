import api from "../api";

export interface Vacancy {
    id: number;
    name: string;
    requirements: string;
    responsibilities: string;
    work_conditions: string;
    work_experience: string;
    salary_type: number;
    salary_from: number;
    salary_to: number;
    salary_gross: boolean;
    additional_info: string;
    vk?: string;
    instagram?: string;
    site?: string;
    telegram?: string;
    whatsapp?: string;
    phone?: string;
    email?: string;

    schedule: string;
    employment: string;
    company_name: string;
}

export interface VacanciesFilters {
    employment?: string;
    schedule?: string;
    work_experience?: string;
    search?: string;
    page?: number;
    per_page?: number;
}

export interface VacanciesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Vacancy[];
}

export interface VacancyFilter {
    title: string;
    values: { id: number; value: string }[];
}

export interface FiltersResponse {
    filters: VacancyFilter[];
}

class VacanciesServiceClass {
    async getVacancies(filters: VacanciesFilters = {}): Promise<VacanciesResponse> {
        try {
            // Убираем пустые параметры
            const cleanFilters: Record<string, any> = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    cleanFilters[key] = value;
                }
            });

            const response = await api.get("/api/v1/vacancies/", {
                params: cleanFilters,
            });

            const data = response.data;

            let results: Vacancy[] = [];
            if (Array.isArray(data.vacancies)) {
                results = data.vacancies;
            } else if (Array.isArray(data.results)) {
                results = data.results;
            }

            return {
                count: results.length,
                next: null,
                previous: null,
                results
            };
        } catch (error) {
            console.error("[VACANCIES SERVICE] Failed to load vacancies:", error);
            throw error;
        }
    }


    async fetchFilters(): Promise<FiltersResponse> {
        try {
            const response = await api.get("/api/v1/vacancies/filters");
            return response.data;
        } catch (err) {
            console.error("[VACANCIES SERVICE] Ошибка при загрузке фильтров:", err);
            throw err;
        }
    }
}

export const VacanciesService = new VacanciesServiceClass();