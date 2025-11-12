import api from "../api.ts";

export interface EventHead {
    logo: {
        original: string;
        thumb: string;
        medium: string;
        large: string;
    };
    short_title: string;
    rarity: Record<string, any>;
    score: number;
}

export interface Event {
    id: number;
    head: EventHead;
    already_participating: boolean;
}

export type EventType = "event" | "challenge";

export interface EventsResponse {
    events: Event[];
    highlighted_events: Event[];
}

class EventService {
    static async getEvents(
        page = 1,
        per_page = 10,
        event_type: EventType = "event"
    ): Promise<EventsResponse> {
        const resp = await api.get<EventsResponse>(
            "/api/v1/events/",
            {
                params: { page, per_page, event_type },
            }
        );
        console.log("EventService.getEvents response:", resp);
        return resp.data;
    }
}


export default EventService;
