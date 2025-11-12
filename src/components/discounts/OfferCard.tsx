import type { CSSProperties, KeyboardEvent } from "react";
import { ChevronRight } from "lucide-react";
import type { PartnerOffer, CashbackOffer } from "./types";

interface Props {
    offer: PartnerOffer | CashbackOffer;
    onClick: () => void;
}

const clampTwoLines: CSSProperties = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "2",
    overflow: "hidden",
};

const clampThreeLines: CSSProperties = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "3",
    overflow: "hidden",
};

const isCashbackOffer = (offer: PartnerOffer | CashbackOffer): offer is CashbackOffer =>
    (offer as CashbackOffer).cashback !== undefined;

const isImageSource = (value: string) =>
    value.startsWith("http") || value.startsWith("/") || value.startsWith("data:");

const OfferCard: React.FC<Props> = ({ offer, onClick }) => {
    const subtitle =
        ("short_partner_description" in offer && offer.short_partner_description) ||
        ("type" in offer && offer.type) ||
        ("city" in offer && offer.city?.name) ||
        "";

    const description =
        !isCashbackOffer(offer) && offer.partner_description ? offer.partner_description : undefined;

    const highlightText = isCashbackOffer(offer)
        ? `${offer.cashback} кешбек`
        : offer.tag;

    const highlightClasses = isCashbackOffer(offer)
        ? "bg-[#E4F6E4] text-[#0A7C0A]"
        : "bg-[#FCE7F3] text-[#BE185D]";

    const renderLogo = () => {
        if (!offer.logo) {
            return (
                <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[15px] bg-gradient-to-br from-gray-100 to-gray-200 text-2xl font-semibold text-gray-600">
                    {offer.name?.charAt(0).toUpperCase()}
                </div>
            );
        }

        if (isImageSource(offer.logo)) {
            return (
                <div className="h-[90px] w-[90px] shrink-0 overflow-hidden rounded-[15px] bg-gray-100">
                    <img
                        src={offer.logo}
                        alt={offer.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
            );
        }

        return (
            <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[15px] bg-gradient-to-br from-gray-100 to-gray-200 text-3xl">
                {offer.logo}
            </div>
        );
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <div
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className="w-full cursor-pointer rounded-[24px] border border-[#EAECF5] bg-white px-4 py-2 shadow-[0px_10px_28px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0px_18px_36px_rgba(15,23,42,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F56D9]"
        >
            <div className="flex items-center gap-[14px]">
                {renderLogo()}

                <div className="flex min-h-[90px] flex-1 flex-col justify-between py-1">
                    <div>
                        <h3
                            className="text-base font-semibold leading-tight text-gray-900"
                            style={clampTwoLines}
                        >
                            {offer.name}
                        </h3>
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500" style={clampTwoLines}>
                                {subtitle}
                            </p>
                        )}
                        {description && (
                            <p className="mt-1 text-xs text-gray-400" style={clampThreeLines}>
                                {description}
                            </p>
                        )}
                    </div>

                    {highlightText && (
                        <span
                            className={`mt-2 inline-flex h-[20px] w-fit items-center rounded-[15px] px-2 py-[2px] text-[12px] font-semibold ${highlightClasses}`}
                        >
                            {highlightText}
                        </span>
                    )}
                </div>

                <ChevronRight className="ml-2 h-5 w-5 shrink-0 text-[#BABFC7]" strokeWidth={2.5} />
            </div>
        </div>
    );
};

export default OfferCard;
