import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Percent, CreditCard } from "lucide-react"
import { Button } from "@maxhub/max-ui"

const DiscountsPage = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"cashback" | "partners">("cashback")

    const weeklyHighlight = {
        id: "weekly",
        name: "Кофе Хауз",
        type: "Кофейня",
        logo: "☕",
        cashback: "20%"
    }

    const cashbackOffers = [
        { id: 1, name: "Додо Пицца", type: "Ресторан", logo: "🍕", cashback: "15%" },
        { id: 2, name: "Бургер Кинг", type: "Ресторан", logo: "🍔", cashback: "10%" },
        { id: 3, name: "Старбакс", type: "Кофейня", logo: "☕", cashback: "12%" }
    ]

    const partnerOffers = [
        { id: 4, name: "Спортмастер", type: "Магазин", logo: "⚽", discount: "25%" },
        { id: 5, name: "Читай-город", type: "Книжный", logo: "📚", discount: "15%" },
        { id: 6, name: "Синема Парк", type: "Кинотеатр", logo: "🎬", discount: "30%" }
    ]

    const filteredCashback = cashbackOffers.filter((offer) =>
        offer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const filteredPartners = partnerOffers.filter((offer) =>
        offer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#111] p-4 md:p-6 text-gray-100">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-6">Скидки</h1>

            {/* Weekly Highlight */}
            <div
                onClick={() => navigate(`/discounts/${weeklyHighlight.id}`)}
                className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-6 mb-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white text-sm font-medium mb-1">🔥 Кешбек недели</p>
                        <h2 className="text-white text-2xl font-bold mb-1">
                            {weeklyHighlight.name}
                        </h2>
                        <p className="text-white text-sm opacity-90">
                            {weeklyHighlight.type}
                        </p>
                    </div>
                    <div className="text-6xl">{weeklyHighlight.logo}</div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-white" />
                    <span className="text-white text-xl font-bold">
                        {weeklyHighlight.cashback} кешбек
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Поиск скидок..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-200"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <Button
                    appearance={activeTab === "cashback" ? "themed" : "neutral"}
                    onClick={() => setActiveTab("cashback")}
                    className="flex-1 py-3 px-4 rounded-xl font-medium"
                    innerClassNames={{ label: "flex items-center justify-center gap-2" }}
                >
                    <CreditCard className="w-5 h-5" />
                    <span>Кешбек по карте</span>
                </Button>

                <Button
                    appearance={activeTab === "partners" ? "themed" : "neutral"}
                    onClick={() => setActiveTab("partners")}
                    className="flex-1 py-3 px-4 rounded-xl font-medium"
                    innerClassNames={{ label: "flex items-center justify-center gap-2" }}
                >
                    <Percent className="w-5 h-5" />
                    <span>Скидки от партнеров</span>
                </Button>
            </div>

            {/* Offers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === "cashback" ? filteredCashback : filteredPartners).map((offer) => (
                    <div
                        key={offer.id}
                        onClick={() => navigate(`/discounts/${offer.id}`)}
                        className="bg-[#1a1a1a] rounded-2xl p-6 cursor-pointer hover:shadow-md
                                   hover:bg-[#222] transition-all"
                    >
                        <div className="text-6xl mb-4 text-center">{offer.logo}</div>
                        <h3 className="font-semibold text-gray-100 text-center mb-1">{offer.name}</h3>
                        <p className="text-sm text-gray-400 text-center mb-3">{offer.type}</p>

                        <div className="flex items-center justify-center gap-2 p-3 bg-[#2a2a2a] rounded-lg">
                            <Percent className="w-5 h-5 text-amber-500" />
                            <span className="text-amber-500 font-bold">
                                {offer.cashback || offer.discount}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {((activeTab === "cashback" && filteredCashback.length === 0) ||
                (activeTab === "partners" && filteredPartners.length === 0)) && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Ничего не найдено</p>
                </div>
            )}
        </div>
    )
}

export default DiscountsPage
