import decor from "../../../assets/profileBanner/decor3.svg";
import logo from "../../../assets/profileBanner/logo.svg";
import bg from "../../../assets/profileBanner/banner-4.svg";
import star from "../../../assets/profileBanner/star.svg";

const OpportunitiesBanner = () => {
    return (
        <div
            className="relative flex w-full px-[30px] pt-[20px] h-40 rounded-xl overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Фиолетовое покрытие поверх фона */}
            <div className="absolute inset-0 bg-gradient-to-tl from-[#7848FF]/85 to-[#000000]/85 z-0"></div>

            {/* Текст + стрелка */}
            <div className="relative z-10 space-y-2">
                <div className="flex items-center">
                    <span className="font-semibold text-[20px]">
                        Хочу в команду
                    </span>
                </div>
                <p className="text-[14px]">Студент РТ</p>
            </div>

            {/* Декор справа */}
            <img
                src={decor}
                alt=""
                className="absolute top-0 right-0 h-full object-cover z-0 opacity-80"
            />

            {/* Звезды */}
            <img
                src={star}
                alt=""
                className="absolute h-16 right-0 bottom-[20px] z-0"
            />

            <img
                src={star}
                alt=""
                className="absolute h-8 right-0 bottom-[50px] z-0"
            />

            <img
                src={star}
                alt=""
                className="absolute h-16 left-1/3 -translate-x-6 bottom-[30px] z-0"
            />

            <img
                src={star}
                alt=""
                className="absolute h-12 left-1/2 -translate-x-6 top-[0px] z-0"
            />

            {/* Логотип */}
            <img
                src={logo}
                alt=""
                className="absolute top-3 right-3 z-10 h-[30px]"
            />
        </div>
    );
};

export default OpportunitiesBanner;
