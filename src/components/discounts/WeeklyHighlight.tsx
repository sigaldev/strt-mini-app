import rightImg from "../../assets/discounts/banner/mainImg.png";
import decor from "../../assets/discounts/banner/decor.svg";
import decor2 from "../../assets/discounts/banner/decor2.svg";


const WeeklyHighlight = () => {
    return (
        <div
            className="text-white relative flex w-full px-[30px] pt-[20px] h-40 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            style={{ background: "#000" }}
        >
            {/* Текст + стрелка */}
            <div className="z-10 flex flex-col justify-center h-full space-y-2 px-2">
                <div className="flex items-center font-semibold text-[24px]">
                    Получить <br/>
                    Карту Студента
                </div>
            </div>

            {/* Основные картинки */}
            <div className="z-10 absolute rotate-12 right-[20px] top-1/2 -translate-y-1/2 w-[180px] h-32">
                <img className="rounded-2xl" src={rightImg} alt="" />
            </div>


            {/* Декор справа */}
            <img
                src={decor2}
                alt=""
                className="absolute top-0 left-0 h-full object-cover z-0 opacity-80"
            />

            {/* Декор справа */}
            <img
                src={decor}
                alt=""
                className="absolute top-0 right-0 h-full object-cover z-0 opacity-80"
            />

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
