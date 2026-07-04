export interface City {
    id?: number | string;
    name: string;
}

export interface Address {
    id?: number | string;
    address: string;
}

export interface ImageVariant {
    url?: string | null;
}

export interface PhotoSet {
    large?: ImageVariant;
    medium?: ImageVariant;
    thumb?: ImageVariant;
}

export interface ActivationType {
    type: "offline" | "online" | "promo_code" | string;
    promo_code?: string | null;
    link?: string | null;
}

export interface CashbackOffer {
    id: number | string;
    name: string;
    type: string;
    logo?: string;
    cashback: string;
    short_partner_description?: string;
}

export interface PartnerOffer {
    id: number | string;
    name: string;
    short_partner_description?: string;
    partner_description?: string;
    logo?: string;
    city?: City | null;
    discount?: string | number;
    site_link?: string;
    addresses?: string[];
    tag?: string;
    type?: string;
    activation_type?: ActivationType | null;
    logo_url?: PhotoSet | null;
    popup?: {
        description?: string;
    } | null;
}

export type Offer = CashbackOffer | PartnerOffer;

export type TabType = "cashback" | "partners";
