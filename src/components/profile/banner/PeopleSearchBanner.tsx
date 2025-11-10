import airplane from "../../../assets/profileBanner/banner-2.svg"
import decor from "../../../assets/profileBanner/decor.svg"
import {ChevronRight} from "lucide-react";

const PeopleSearchBanner = () => {
    return (
        <div className="relative flex w-full px-[30px] pt-[20px] h-40 rounded-xl overflow-hidden bg-[#000]">

            {/* Текст + стрелка */}
            <div className="z-10 space-y-2">
                <div className="flex items-center">
                    <span className="font-semibold text-[20px]">
                        Поиск людей
                    </span>
                    <ChevronRight />
                </div>
                <p className="text-[14px]">Найти друзей <br/> или увеличить круг общения </p>
            </div>

            {/* Самолет по центру высоты */}
            <div className="z-10 absolute right-[30px] top-1/2 -translate-y-2/3 scale-125">
                <img src={airplane} alt="" />
            </div>

            {/* Декор справа */}
            <img
                src={decor}
                alt=""
                className="absolute top-0 right-0 h-full object-cover z-0 opacity-80"
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

export default PeopleSearchBanner;
