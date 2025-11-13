import OfferCard from "./OfferCard";
import type { NavigateFunction } from "react-router-dom";
import type { Offer } from "./types.ts";

interface Props {
    offers: Offer[];
    navigate: NavigateFunction;
}

const OffersGrid: React.FC<Props> = ({ offers, navigate }) => {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
