import rightImg from "../../assets/discounts/banner/mainImg.png";
import leftImg from "../../assets/discounts/banner/secondImg.png";
import decor from "../../assets/discounts/banner/decor.svg";
import star from "../../assets/star.svg";

interface Props {
    onClick: () => void;
}

const WeeklyHighlight: React.FC<Props> = ({ onClick }) => {
    return (
        <div
            className="relative flex w-full px-[30px] pt-[20px] h-40 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            onClick={onClick}
            style={{ background: "#000" }}
        >
            {/* Текст + стрелка */}
            <div className="z-10 flex flex-col justify-center h-full space-y-2 px-2">
                <div className="flex items-center font-semibold text-[24px]">
                    Кэшбек недели
                </div>
            </div>

            {/* Основные картинки */}
            <div className="z-10 absolute right-[-60px] top-1/2 -translate-y-[130px] w-[280px] h-32">
                <img src={rightImg} alt="" />
            </div>

            <div className="absolute rotate-[30deg] left-[-20px] bottom-[-20px] w-[200px] h-32 opacity-30">
                <img src={leftImg} alt="" />
            </div>

            {/* Декор справа */}
            <img
                src={decor}
                alt=""
                className="absolute top-0 right-0 h-full -translate-x-[100px] object-cover z-0 opacity-80"
            />

            {/* Звезды */}
            <img src={star} alt="" className="absolute h-16 left-1/2 bottom-[20px] z-0" />
            <img src={star} alt="" className="absolute h-8 left-1/2 -translate-x-1 bottom-[40px] z-0" />
            <img src={star} alt="" className="absolute h-12 left-1/2 -translate-x-6 top-[0px] z-0" />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
      radial-gradient(circle at 20% 20%, rgba(120,72,255,0.25) 0%, rgba(120,72,255,0) 70%),
      radial-gradient(circle at 80% 30%, rgba(120,72,255,0.2) 0%, rgba(120,72,255,0) 70%),
      radial-gradient(circle at 50% 70%, rgba(120,72,255,0.3) 0%, rgba(120,72,255,0) 70%)
    `
                }}
            />

        </div>
    );
};

export default WeeklyHighlight;
