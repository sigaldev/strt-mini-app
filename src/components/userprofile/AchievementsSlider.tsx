import {Counter} from "@maxhub/max-ui";
import {Swiper, SwiperSlide} from "swiper/react";
import notAchiveImg from "../../assets/achivments/notAchiveImg.svg";
import rocket from "../../assets/achivments/rocket.svg";

interface AchievementLogo {
    medium?: string;
    original?: string;
}

interface Achievement {
    id: string | number;
    title?: string;
    name?: string;
    logo?: AchievementLogo;
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
                    <Swiper spaceBetween={20} slidesPerView="auto" className="py-2" grabCursor={true}>
                        {achievements.map((a) => {
                            const logoSrc =
                                a.logo?.medium ||
                                a.logo?.original ||
                                notAchiveImg;

                            return (
                                <SwiperSlide
                                    key={a.id}
                                    className="w-[90px] h-[90px] flex items-center justify-center shadow-sm transition-transform"
                                >
                                    <div className="w-full h-full rounded-full border-[6px] border-[#B7C6FF] bg-white flex items-center justify-center overflow-hidden">
                                        <img
                                            src={logoSrc}
                                            alt={a.title ?? a.name ?? "Значок достижения"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </>
            ) : (
                <div className="flex items-center px-2 relative">
                    <div className="flex flex-col z-10">
                        <h3 className="text-gray-900 text-[18px] font-medium mb-1">
                            У пользователя пока нет достижений
                        </h3>
                        <p className="text-gray-500 text-sm leading-tight max-w-[200px]">
                            Зови его с собой на мероприятия! Переходи в раздел{" "}
                            <span className="text-[#007AFF] font-medium">«Мероприятия»</span>{" "}
                            и подтверждай участие.
                        </p>
                    </div>

                    <img
                        src={rocket}
                        alt="Нет достижений"
                        className="
                            absolute
                            right-[-60px]
                            sm:right-[-20px]
                            bottom-[-10px]
                            w-36
                            h-36
                            pointer-events-none
                            hidden
                            xs:block
                          "
                    />
                </div>
            )}
        </div>
    );
}

export default AchievementsSlider
