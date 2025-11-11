import type { Offer } from "./types";
import { Percent } from "lucide-react";

interface Props {
    offer: Offer;
    onClick: () => void;
}

const OfferCard: React.FC<Props> = ({ offer, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-[#f5f5f5] rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
            <div className="text-6xl mb-4 text-center">{offer.logo}</div>
            <h3 className="font-semibold text-gray-900 text-center mb-1">{offer.name}</h3>
            <p className="text-sm text-gray-500 text-center mb-3">{offer.type}</p>

            <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                <Percent className="w-5 h-5 text-amber-500" />
                <span className="text-amber-500 font-bold">
                    {"cashback" in offer ? offer.cashback : offer.discount}
                </span>
            </div>
        </div>
    );
};

export default OfferCard;
