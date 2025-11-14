import banner from "../../../assets/profileBanner/banner-1.png";

const CareerBanner = () => {
    return (
        <div
            onClick={() => window.open("https://sovcombank-league.ru/kazan#!/tab/1391761101-1", "_blank")}
            className="w-full h-50 relative rounded-xl overflow-hidden">
            {/* Черный фон */}
            <div className="absolute inset-0 bg-[#343434]" />

            {/* Картинка сверху */}
            <div
                className="absolute inset-0 bg-contain bg-no-repeat bg-bottom"
                style={{ backgroundImage: `url(${banner})` }}
            />
        </div>
    );
};

export default CareerBanner;
