export interface CashbackOffer {
    id: number | string
    name: string
    type: string
    logo: string
    cashback: string
}

export interface PartnerOffer {
    id: number | string
    name: string
    type: string
    logo: string
    discount: string
}

export type Offer = CashbackOffer | PartnerOffer

export type TabType = "cashback" | "partners"
