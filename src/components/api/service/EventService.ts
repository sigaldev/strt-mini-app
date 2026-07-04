import api from "../api.ts";

export interface ImageSet {
    original?: string;
    thumb?: string;
    medium?: string;
    large?: string;
}

export interface EventTag {
    id: number;
    type: string;
    title: string;
    color?: string;
}

export interface EventHead {
    background: ImageSet;
    logo: ImageSet;
    short_title: string;
    full_title?: string;
    score: number;
    tags?: EventTag[];
    rarity: {
        name?: string;
        [key: string]: unknown;
    };
    scope?: unknown;
}

export interface EventButton {
    button_type?: string;
    type?: string;
    expiration_date: number | null;
    title: string;
    link: string;
}

export interface EventPhoto {
    original?: string;
    thumb?: string;
    medium?: string;
    large?: string;
}

export interface EventBlockData {
    body?: string;
    photos?: EventPhoto[];
    buttons?: EventButton[];
    format?: string;
    location_description?: string;
    [key: string]: unknown;
}

export interface EventBlock {
    type: string;
    title?: string;
    data: EventBlockData;
}

export interface Event {
    id: number;
    head: EventHead;
    blocks: EventBlock[];
    already_participating: boolean;
    event_participation_displayed?: number;
}

export type EventType = "event" | "challenge";


export interface EventsResponse {
    events: Event[];
    highlighted_events: Event[];
}

interface EventDetailResponse {
    event: Event;
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
        const resp = await api.get<EventDetailResponse>(`/api/v1/events/${id}`);
        console.log("EventService.getEventById response:", resp.data.event);
        return resp.data.event;
    }
}

export default EventService;
