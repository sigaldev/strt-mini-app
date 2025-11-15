import {useNavigate} from "react-router-dom";
import {ChevronRight} from "lucide-react";
import rightImg from "../../../assets/profileBanner/banner-5.png";
import decor from "../../../assets/profileBanner/decor5.svg";
import star from "../../../assets/star.svg";

const DiscountsBanner = () => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate('/discounts')}
            className="text-[#fff] relative flex w-full px-[15px] xs:px-[30px] pt-[20px] h-40 rounded-xl overflow-hidden bg-[#000]">

            {/* Текст + стрелка */}
            <div className="z-10 space-y-2">
                <div className="flex items-center">
                    <span className="font-semibold text-[16px] xs:text-[20px]">
                        Скидки
                    </span>
                    <ChevronRight />
                </div>
                <p className="text-[12px] xs:text-[14px]">Экономь на нужном <br/> и получай больше </p>
            </div>

            <div className="z-10 absolute right-[0] top-1/2 -translate-y-1/2 w-64 translate-x-12">
                <img src={rightImg} alt="" />
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
                className="absolute h-20 left-1/2 -translate-x-12 rotate-12 bottom-[20px] z-0"
            />

            <img
                src={star}
                alt=""
                className="absolute h-8 left-0 scale-110 -translate-x-1 bottom-[40px] z-0"
            />

            <img
                src={star}
                alt=""
                className="absolute h-12 left-10 -rotate-12 translate-x-12 scale-125 top-[0px] z-0"
            />

            {/* Фиолетовое свечение снизу */}
            <div
                className="
                    absolute bottom-0 left-1
                    w-full h-full
                    bg-[radial-gradient(circle,_rgba(120,72,255,0.55)_0%,_rgba(120,72,255,0)_100%)]
                    pointer-events-none
                "
            />
        </div>
    );
};

export default DiscountsBanner;
