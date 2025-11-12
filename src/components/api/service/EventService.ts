import api from "../api.ts";

export interface EventTag {
    id: number;
    type: string;
    title: string;
}

export interface EventHead {
    background: {
        original: string;
        thumb: string;
        medium: string;
        large: string;
    };
    logo: {
        original: string;
        thumb: string;
        medium: string;
        large: string;
    };
    short_title: string;
    full_title: string;
    score: number;
    tags: EventTag[];
    rarity: Record<string, any>;
    scope: string;
}

export interface Event {
    id: number;
    head: EventHead;
    blocks: any[];
    already_participating: boolean;
    event_participation_displayed: number;
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
        const resp = await api.get<EventsResponse>("/api/v1/events/", {
            params: { page, per_page, event_type },
        });
        console.log("EventService.getEvents response:", resp);
        return resp.data;
    }

    static async getEventById(id: number): Promise<Event> {
        const resp = await api.get<Event>(`/api/v1/events/${id}`);
        console.log("EventService.getEventById response:", resp.data.event);
        return resp.data;
    }
}

export default EventService;
