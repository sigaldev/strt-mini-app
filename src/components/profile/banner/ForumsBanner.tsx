import decor from "../../../assets/profileBanner/decor-4.svg";
import star from "../../../assets/star.svg";
import {ChevronRight} from "lucide-react";
import rightImg from "../../../assets/profileBanner/forum.png";
import {useNavigate} from "react-router-dom";

const ForumsBanner = () => {
    const navigate = useNavigate();


    return (
        <div
            onClick={() => navigate('/forum')}
            className="text-[#fff] relative flex w-full px-[15px] xs:px-[30px] pt-[20px] h-40 rounded-xl overflow-hidden bg-[#000]">

            {/* Текст + стрелка */}
            <div className="z-10 space-y-2">
                <div className="flex items-center">
                    <span className="font-semibold text-[16px] xs:text-[20px]">
                        Сезон форумов
                    </span>
                    <ChevronRight />
                </div>
                <p className="text-[12px] xs:text-[14px]">Форумы на любой вкус,  <br/> выбирай активное студенчество! </p>
            </div>

            <div className="z-10 absolute right-[-20px] top-1/2 -translate-y-[80px] w-40">
                <img src={rightImg} alt="" />
            </div>

            {/* Декор справа */}
            <img
                src={decor}
                alt=""
                className="absolute top-0 right-0 h-full object-cover z-0"
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
                className="absolute h-12 left-3 -translate-x-1 bottom-[20px] z-0 rotate-12"
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

export default ForumsBanner;
