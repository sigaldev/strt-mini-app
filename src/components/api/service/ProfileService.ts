import api from "../api";

interface University {
    id: number;
    name: string;
    abbreviation: string;
    city: { id: number; name: string };
}

interface Group {
    id: number;
    name: string;
}

interface Avatar {
    large: string;
    medium: string;
    thumb: string;
}

interface LevelBonusPartner {
    id: number;
    name: string;
    city: { id: number; name: string };
    instagram_link?: string;
    telegram_link?: string;
    site_link?: string;
}

interface LevelBonus {
    id: number;
    title: string;
    description: string;
    expiration_date: string;
    partner?: LevelBonusPartner;
}

interface Level {
    id: number;
    sequence: number;
    name: string;
    scores_count: number;
    description: string;
    image: Avatar;
    bonus_description: string;
    bonuses: LevelBonus[];
}

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    group_number: string;
    group: Group;
    avatar: Avatar;
    score: number;
    rank: string;
    university: University;
    level: Level;
    phone_number: string;
    badges: string;
    achievements: string;
    tg_link: string;
    vk_link: string;
    show_contact_tg_link: boolean;
    show_contact_vk_link: boolean;
    connects: number;
}

class ProfileServiceClass {
    async getProfile(): Promise<Profile> {
        try {
            const response = await api.get("/api/v1/my/profile/");
            console.log("[PROFILE SERVICE] Profile fetched successfully:", response.data);
            return response.data.user;
        } catch (error) {
            console.error("[PROFILE SERVICE] Failed to load profile:", error);
            throw error;
        }
    }
}

export const ProfileService = new ProfileServiceClass();
export type { Profile, Level, LevelBonus, LevelBonusPartner, Avatar, Group, University };
