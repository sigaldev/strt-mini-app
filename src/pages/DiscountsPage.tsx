import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WeeklyHighlight from "../components/discounts/WeeklyHighlight";
import SearchBar from "../components/discounts/SearchBar";
import Tabs from "../components/discounts/Tabs";
import OffersGrid from "../components/discounts/OffersGrid";
import EmptyState from "../components/discounts/EmptyState";
import type { CashbackOffer, PartnerOffer, TabType } from "../components/discounts/types";
import DiscountService from "../components/api/service/DiscountService.ts";

const DiscountsPage = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("cashback");
    const [cashbackOffers, setCashbackOffers] = useState<CashbackOffer[]>([]);
    const [partnerOffers, setPartnerOffers] = useState<PartnerOffer[]>([]);
    const [loading, setLoading] = useState(false);

    const weeklyHighlight: CashbackOffer = {
        id: "weekly",
        name: "Кофе Хауз",
        type: "Кофейня",
        logo: "☕",
        cashback: "20%",
    };

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const partners = await DiscountService.getPartners(1);
                console.log("DiscountService.getPartners response:", partners);

                if (!partners) {
                    console.warn("Партнеры не пришли или undefined");
                    setCashbackOffers([weeklyHighlight]);
                    setPartnerOffers([]);
                    return;
                }

                console.log(partners[0])

                // кешбеки: offline
                const cashbackData: CashbackOffer[] = partners
                    .filter(p => p.activation_type?.type === "offline")
                    .map(p => ({
                        id: String(p.id),
                        name: p.name,
                        type: p.short_partner_description || "Партнер",
                        short_partner_description: p.short_partner_description,
                        logo: p.logo_url?.medium?.url || undefined,
                        cashback: p.discount ? `${p.discount}%` : "0%",
                    }));

                // скидки от партнеров: online
                const partnerData: PartnerOffer[] = partners
                    .filter(p => p.activation_type?.type === "online")
                    .map(p => ({
                        id: p.id,
                        name: p.name,
                        city: p.city,
                        partner_description: p.partner_description,
                        short_partner_description: p.short_partner_description,
                        discount: typeof p.discount === "number" ? `${p.discount}%` : p.discount,
                        logo: p.logo_url?.medium?.url || undefined,
                        site_link: p.site_link,
                        addresses: p.addresses,
                    }));

                console.log("Cashback offers:", cashbackData);
                console.log("Partner offers:", partnerData);

                setCashbackOffers([...cashbackData]);
                setPartnerOffers(partnerData);
            } catch (error) {
                console.error("Ошибка при загрузке партнеров:", error);
                setCashbackOffers([weeklyHighlight]);
                setPartnerOffers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const normalizedQuery = searchQuery.toLowerCase();

    const filteredCashback = cashbackOffers.filter(o =>
        o.name.toLowerCase().includes(normalizedQuery) ||
        o.type.toLowerCase().includes(normalizedQuery)
    );

    const filteredPartners = partnerOffers.filter(o => {
        const matchesName = o.name.toLowerCase().includes(normalizedQuery);
        const matchesShort = o.short_partner_description?.toLowerCase().includes(normalizedQuery) ?? false;
        const matchesCity = o.city?.name?.toLowerCase().includes(normalizedQuery) ?? false;
        return matchesName || matchesShort || matchesCity;
    });

    const offers = activeTab === "cashback" ? filteredCashback : filteredPartners;

    return (
        <div className="min-h-screen bg-white py-6 px-4 md:p-6 text-gray-900">
            <h1 className="text-2xl font-bold mb-6">Скидки</h1>

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <WeeklyHighlight/>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {loading ? (
                <div className="text-center py-12 text-gray-500">Загрузка...</div>
            ) : (
                <>
                    {offers.length > 0 ? (
                        <OffersGrid offers={offers} navigate={navigate} />
                    ) : (
                        <EmptyState />
                    )}
                </>
            )}
        </div>
    );
};

export default DiscountsPage;
