import type {Offer} from "./types"
import OfferCard from "./OfferCard"
import type {NavigateFunction} from "react-router-dom"

interface Props {
    offers: Offer[]
    navigate: NavigateFunction
}

const OffersGrid: React.FC<Props> = ({ offers, navigate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
                <OfferCard
                    key={offer.id}
                    offer={offer}
                    onClick={() => navigate(`/discounts/${offer.id}`)}
                />
            ))}
        </div>
    )
}

export default OffersGrid
