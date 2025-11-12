import OfferCard from "./OfferCard";
import type { NavigateFunction } from "react-router-dom";
import type { Offer } from "./types.ts";

interface Props {
    offers: Offer[];
    navigate: NavigateFunction;
}

const OffersGrid: React.FC<Props> = ({ offers, navigate }) => {
    return (
        <div className="flex flex-col items-center gap-[10px]">
            {offers.map((offer) => (
                <OfferCard
                    key={offer.id}
                    offer={offer}
                    onClick={() => navigate(`/discounts/${offer.id}`)}
                />
            ))}
        </div>
    );
};

export default OffersGrid;
