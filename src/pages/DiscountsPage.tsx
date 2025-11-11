import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WeeklyHighlight from "../components/discounts/WeeklyHighlight";
import SearchBar from "../components/discounts/SearchBar";
import Tabs from "../components/discounts/Tabs";
import OffersGrid from "../components/discounts/OffersGrid";
import EmptyState from "../components/discounts/EmptyState";
import type { CashbackOffer, PartnerOffer } from "../components/discounts/types";
import DiscountService from "../components/api/service/DiscountService.ts";

const DiscountsPage = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"cashback" | "partners">("cashback");
    const [partnerOffers, setPartnerOffers] = useState<PartnerOffer[]>([]);
    const [loading, setLoading] = useState(false);

    // Пример статического кешбека недели
    const weeklyHighlight: CashbackOffer = {
        id: "weekly",
        name: "Кофе Хауз",
        type: "Кофейня",
        logo: "☕",
        cashback: "20%",
    };

    useEffect(() => {
        const fetchPartners = async () => {
            setLoading(true);
            const partners = await DiscountService.getPartners(1); // city_id = 1 (Казань)
            setPartnerOffers(partners);
            setLoading(false);
        };

        if (activeTab === "partners") {
            fetchPartners();
        }
    }, [activeTab]);

    const filteredCashback: CashbackOffer[] = [weeklyHighlight].filter(o =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPartners: PartnerOffer[] = partnerOffers.filter(o =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const offers = activeTab === "cashback" ? filteredCashback : filteredPartners;

    return (
        <div className="min-h-screen bg-[#111] py-6 px-4 md:p-6 text-gray-100">
            <h1 className="text-2xl font-bold mb-6">Скидки</h1>

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <WeeklyHighlight
                onClick={() => navigate(`/discounts/${weeklyHighlight.id}`)}
            />

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {loading ? (
                <div className="text-center py-12 text-gray-400">Загрузка...</div>
            ) : (
                <>
                    <OffersGrid offers={offers} navigate={navigate} />
                    {offers.length === 0 && <EmptyState />}
                </>
            )}
        </div>
    );
};

export default DiscountsPage;
