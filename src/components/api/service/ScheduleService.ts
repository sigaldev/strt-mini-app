import api from "../api";
import { ProfileService } from "./ProfileService";

export interface ScheduleLesson {
    start_time: string;
    end_time: string;
    room: string;
    teacher: { id: number; name: string };
    subject: { id: number; name: string; type: string };
}

export interface DaySchedule {
    date: string;
    last_update: string;
    is_even_week: boolean;
    schedule: ScheduleLesson[];
}

export interface ScheduleResponse {
    schedule: DaySchedule[];
}

class ScheduleServiceClass {
    async getSchedule(date_from: string, date_to: string): Promise<ScheduleResponse> {
        try {
            const profile = await ProfileService.getProfile();

            // 👉 Проверяем наличие group_id
            if (!profile.group?.id) {
                console.warn("[SCHEDULE SERVICE] group_id is missing");
                throw new Error("NO_GROUP_ID");
            }

            const group_id = profile.group.id;

            const response = await api.get<ScheduleResponse>("/api/v1/schedule/public/", {
                params: { date_from, date_to, group: group_id },
            });

            return response.data;
        } catch (error) {
            console.error("[SCHEDULE SERVICE] Failed to fetch schedule:", error);
            throw error;
        }
    }
}


export const ScheduleService = new ScheduleServiceClass();
