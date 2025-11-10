
import banner from "../../../assets/profileBanner/banner-1.png";

const CareerBanner = () => {
    return (
        <div
            className="w-full h-40 bg-contain  bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(${banner})` }}
        />

    );
};

export default CareerBanner;