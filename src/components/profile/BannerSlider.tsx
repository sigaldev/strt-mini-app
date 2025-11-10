import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import 'swiper/css'
import 'swiper/css/pagination'

interface BannersSliderProps {
    banners: any[]
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
                pagination={{ clickable: true }}
            >
                {banners.map(banner => (
                    <SwiperSlide key={banner.key} className="!w-11/12">
                        <div
                            className="h-32 rounded-xl overflow-hidden flex cursor-pointer hover:scale-[1.03] transition-transform"
                        >
                            {banner}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default BannersSlider
