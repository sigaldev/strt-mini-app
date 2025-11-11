import type {CashbackOffer, PartnerOffer} from "./types"

export const weeklyHighlight: CashbackOffer = {
    id: "weekly",
    name: "Кофе Хауз",
    type: "Кофейня",
    logo: "☕",
    cashback: "20%",
}

export const cashbackOffers: CashbackOffer[] = [
    { id: 1, name: "Додо Пицца", type: "Ресторан", logo: "🍕", cashback: "15%" },
    { id: 2, name: "Бургер Кинг", type: "Ресторан", logo: "🍔", cashback: "10%" },
    { id: 3, name: "Старбакс", type: "Кофейня", logo: "☕", cashback: "12%" },
]

export const partnerOffers: PartnerOffer[] = [
    { id: 4, name: "Спортмастер", type: "Магазин", logo: "⚽", discount: "25%" },
    { id: 5, name: "Читай-город", type: "Книжный", logo: "📚", discount: "15%" },
    { id: 6, name: "Синема Парк", type: "Кинотеатр", logo: "🎬", discount: "30%" },
]
