import {ChevronRight} from "lucide-react";
import rightImg from "../../../assets/profileBanner/banner-3.svg";
import decor from "../../../assets/profileBanner/decor2.svg";
import star from "../../../assets/star.svg";

const ScholarshipBanner = () => {
    return (
        <div className="relative flex w-full px-[30px] pt-[20px] h-40 rounded-xl overflow-hidden bg-[#000]">

            {/* Текст + стрелка */}
            <div className="z-10 space-y-2">
                <div className="flex items-center">
                    <span className="font-semibold text-[20px]">
                        Стипендии
                    </span>
                    <ChevronRight />
                </div>
                <p className="text-[14px]">Твоя финансовая поддержка <br/> во время учёбы </p>
            </div>

            <div className="z-10 absolute right-[0] top-1/2 -translate-y-2/3 scale-125">
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
                className="absolute h-16 left-1/2 bottom-[20px] z-0"
            />

            <img
                src={star}
                alt=""
                className="absolute h-8 left-1/2 -translate-x-1 bottom-[40px] z-0"
            />

            <img
                src={star}
                alt=""
                className="absolute h-12 left-1/2 -translate-x-6 top-[0px] z-0"
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

export default ScholarshipBanner;