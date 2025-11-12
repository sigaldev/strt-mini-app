export interface City {
    id?: number | string;
    name: string;
}

export interface Address {
    id?: number | string;
    address: string;
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
    discount?: string;
    site_link?: string;
    addresses?: Address[];
    tag?: string;
    type?: string;
}

export type Offer = CashbackOffer | PartnerOffer;

export type TabType = "cashback" | "partners";
