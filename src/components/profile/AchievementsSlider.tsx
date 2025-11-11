import { Swiper, SwiperSlide } from "swiper/react";
import { Counter } from "@maxhub/max-ui";
import notAchiveImg from "../../assets/achivments/notAchiveImg.svg";

interface Achievement {
    id: string | number;
    icon: string;
    name: string;
}

interface AchievementsSliderProps {
    achievements: Achievement[];
}

const AchievementsSlider = ({ achievements }: AchievementsSliderProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 relative shadow-md">
            {achievements.length > 0 ? (
                <>
                    <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Достижения</h3>
                        <Counter appearance="themed" mode="filled" value={achievements.length} />
                    </div>
                    <Swiper spaceBetween={12} slidesPerView="auto" className="py-2" grabCursor={true}>
                        {achievements.map((a) => (
                            <SwiperSlide
                                key={a.id}
                                className="w-24 h-24 flex items-center justify-center rounded-[50px] border-[2px] border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                            >
                                <img src={a.icon} alt={a.name} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            ) : (
                <div className="flex items-center px-2 relative">
                    <div className="flex flex-col z-10">
                        <h3 className="text-gray-900 text-[18px] font-medium mb-1">
                            У тебя пока нет достижений
                        </h3>
                        <p className="text-gray-500 text-sm leading-tight max-w-[200px]">
                            Участвуй в мероприятиях! Переходи в раздел{" "}
                            <span className="text-[#007AFF] font-medium">«Мероприятия»</span>{" "}
                            и подтверждай участие.
                        </p>
                    </div>

                    <img
                        src={notAchiveImg}
                        alt="Нет достижений"
                        className="
                            absolute
                            right-[-20px]
                            bottom-[-10px]
                            w-36
                            h-36
                            pointer-events-none
                        "
                    />
                </div>
            )}
        </div>
    );
};

export default AchievementsSlider;
