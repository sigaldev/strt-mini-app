import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ArrowLeft, MapPin, Clock, Percent } from "lucide-react"
import { Button } from "@maxhub/max-ui"
import DiscountService from "../components/api/service/DiscountService"
import Loader from "../components/Loader.tsx";

const DiscountDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [discount, setDiscount] = useState<any>(null)

    useEffect(() => {
        const fetchDiscount = async () => {
            if (!id) {
                console.warn("DiscountDetailPage: No ID in params")
                return
            }

            console.log("DiscountDetailPage: fetching discount with ID:", id)
            setLoading(true)

            try {
                const data = await DiscountService.getPartnerById(Number(id))
                console.log("DiscountDetailPage: discount data fetched:", data)
                setDiscount(data.partner)
            } catch (err) {
                console.error("DiscountDetailPage: error loading discount:", err)
            } finally {
                setLoading(false)
                console.log("DiscountDetailPage: loading finished")
            }
        }

        fetchDiscount()
    }, [id])

    if (loading || !discount) return <Loader />

    return (
        <div className="min-h-screen bg-white text-gray-900 whitespace-pre-line">
            {/* Header */}
            <div className="bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate("/discounts")}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">
                        Детали предложения
                    </h1>
                </div>
            </div>

            <div className="p-4 md:p-6 max-w-3xl mx-auto">
                {/* Logo */}
                <div className="bg-gray-100 rounded-2xl p-12 mb-6 flex items-center justify-center shadow-sm">
                    {discount.logo_url?.large?.url ? (
                        <img
                            src={discount.logo_url.large.url}
                            alt={discount.name}
                            className="max-h-32 object-contain"
                        />
                    ) : (
                        <div className="text-9xl">🎁</div>
                    )}
                </div>


                {/* Info Card */}
                <div className="bg-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{discount.name}</h2>
                    <p className="text-gray-700 mb-4">{discount.short_partner_description}</p>

                    {/* Cashback / Discount Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-xl mb-6">
                        <Percent className="w-5 h-5 text-amber-500" />
                        <span className="text-amber-500 font-bold text-xl">
                            {discount.discount} % скидка
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6">{discount.partner_description}</p>

                    {/* Locations */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-700" />
                            Адреса
                        </h3>

                        <div className="space-y-2">
                            {(discount.addresses || []).map((location: string, index: number) => (
                                <div key={index} className="p-3 bg-gray-200 rounded-lg text-gray-900">
                                    {location}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Terms / Bonuses */}
                    {discount.popup && discount.popup.description  && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Условия</h3>
                            <p className="text-gray-700">{discount.popup.description}</p>
                        </div>
                    )}
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
