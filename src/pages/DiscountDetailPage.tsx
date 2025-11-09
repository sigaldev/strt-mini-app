import { useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Clock, Percent } from "lucide-react"
import { Button } from "@maxhub/max-ui"

const DiscountDetailPage = () => {
    const navigate = useNavigate()

    const discount = {
        id: 1,
        name: "Додо Пицца",
        type: "Ресторан",
        logo: "🍕",
        cashback: "15%",
        description:
            "Получайте кешбек при оплате картой в сети пиццерий Додо Пицца. Кешбек начисляется автоматически в течение 3 дней после совершения покупки.",
        locations: ["ТЦ Европейский, 2 этаж", "ул. Ленина, 45", "пр. Победы, 123"],
        workingHours: "10:00 - 22:00",
        terms: [
            "Кешбек начисляется только при оплате студенческой картой",
            "Максимальная сумма кешбека - 500 рублей",
            "Акция действует до 31 декабря 2024 года",
        ],
    }

    return (
        <div className="min-h-screen bg-[#111] text-gray-200">
            {/* Header */}
            <div className="bg-[#1a1a1a] border-b border-[#222] sticky top-0 z-10">
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate("/discounts")}
                        className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-300" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-100">
                        Детали предложения
                    </h1>
                </div>
            </div>

            <div className="p-4 md:p-6 max-w-3xl mx-auto">
                {/* Logo */}
                <div className="bg-[#1a1a1a] rounded-2xl p-12 mb-6 flex items-center justify-center shadow-sm">
                    <div className="text-9xl">{discount.logo}</div>
                </div>

                {/* Info Card */}
                <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-100 mb-2">{discount.name}</h2>
                    <p className="text-gray-400 mb-4">{discount.type}</p>

                    {/* Cashback Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#222] rounded-xl mb-6">
                        <Percent className="w-5 h-5 text-amber-500" />
                        <span className="text-amber-500 font-bold text-xl">
                            {discount.cashback} кешбек
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed mb-6">
                        {discount.description}
                    </p>

                    {/* Working Hours */}
                    <div className="flex items-center gap-3 text-gray-400 mb-6">
                        <Clock className="w-5 h-5" />
                        <span>{discount.workingHours}</span>
                    </div>

                    {/* Locations */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-300" />
                            Адреса
                        </h3>

                        <div className="space-y-2">
                            {discount.locations.map((location, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-[#222] rounded-lg text-gray-300"
                                >
                                    {location}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Terms */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-3">Условия</h3>

                        <ul className="space-y-2">
                            {discount.terms.map((term, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-gray-300"
                                >
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>{term}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    appearance="themed"
                    mode="primary"
                    size="large"
                    className="w-full mt-4"
                >
                    Активировать предложение
                </Button>
            </div>
        </div>
    )
}

export default DiscountDetailPage
