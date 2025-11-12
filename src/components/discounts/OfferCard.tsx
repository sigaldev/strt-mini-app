import type { PartnerOffer, CashbackOffer } from "./types";

interface Props {
    offer: PartnerOffer | CashbackOffer;
    onClick: () => void;
}

const OfferCard: React.FC<Props> = ({ offer, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{offer.name}</h3>
                {"logo" in offer && offer.logo && <span className="text-2xl">{
                    <img src={offer.logo} alt=""/>
                }</span>}
            </div>
            {"type" in offer && <p className="text-gray-600 text-sm mb-2">{offer.type}</p>}
            {"short_partner_description" in offer && (
                <p className="text-gray-600 text-sm mb-2">{offer.short_partner_description}</p>
            )}
            {"partner_description" in offer && (
                <p className="text-gray-500 text-xs line-clamp-3">{offer.partner_description}</p>
            )}
            {"city" in offer && <p className="mt-2 text-gray-400 text-xs">Город: {offer.city.name}</p>}
            {"cashback" in offer && <p className="mt-2 text-green-600 font-bold">{offer.cashback} кешбек</p>}
        </div>
    );
};

export default OfferCard;
