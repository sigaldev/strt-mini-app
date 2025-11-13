import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import type {JSX} from "react";

interface BannersSliderProps {
    banners: JSX.Element[];
}

const BannersSlider = ({ banners }: BannersSliderProps) => {
    return (
        <div className="mb-6">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                loop={true}
                spaceBetween={10}
                slidesPerView={"auto"}
                centeredSlides={true}
                className="w-full pb-10"
                pagination={{ clickable: false }}
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index} className="!w-11/12">
                        <div
                            className="shadow-md h-32 rounded-xl overflow-hidden flex transition-transform"
                        >
                            {banner}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default BannersSlider;
