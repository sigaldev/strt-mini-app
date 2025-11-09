import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {Bell, Settings, LogOut, ChevronRight, X, Camera} from 'lucide-react'
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import scheduleImg from "../assets/scheduler/scheduler.png";
import scheduleDecorImg from "../assets/scheduler/decor.svg";
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import "swiper/css/pagination";
import {Button, Counter, Input} from "@maxhub/max-ui";
import ico1 from "../assets/achivments/ico-1.svg"
import ico2 from "../assets/achivments/ico-2.svg"
import ico3 from "../assets/achivments/ico-3.svg"

const ProfilePage = () => {
    const navigate = useNavigate()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [profileData, setProfileData] = useState({
        firstName: "Айгиз",
        lastName: "Тулыбаев",
        university: "КФУ",
        group: "11-403",
        contacts: "24",
        rating: "4.8",
        points: "1250"
    })

    // Эффект для блокировки скролла при открытии уведомлений или редактирования
    useEffect(() => {
        if (showNotifications || showEditProfile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Очистка при размонтировании компонента
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showNotifications, showEditProfile]);

    const banners = [
        { id: 1, title: "Карьерный фестиваль от Совкомбанка", color: "from-[#0177ff] to-blue-600" },
        { id: 2, title: "Поиск людей", color: "from-emerald-500 to-emerald-600" },
        { id: 3, title: "Стипендии", color: "from-amber-500 to-amber-600" },
        { id: 4, title: "Новые возможности", color: "from-purple-500 to-purple-600" },
        { id: 5, title: "Конкурсы и гранты", color: "from-pink-500 to-pink-600" },
    ]

    const achievements = [
        { id: 1, icon: ico1, name: "Победитель хакатона" },
        { id: 2, icon: ico2, name: "Лучший студент" },
        { id: 3, icon: ico3, name: "Отличник" },
        { id: 4, icon: ico1, name: "Инноватор" },
        { id: 5, icon: ico2, name: "Инноватор" },
        { id: 6, icon: ico3, name: "Инноватор" },
    ]

    const universities = [
        { value: "КФУ", label: "Казанский федеральный университет" },
        { value: "КГАСУ", label: "КГАСУ" },
        { value: "КГМУ", label: "КГМУ" },
        { value: "КНИТУ", label: "КНИТУ" },
    ]

    const handleInputChange = (field:string, value:string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSaveProfile = () => {
        console.log("Сохраненные данные:", profileData)
        setShowEditProfile(false)
    }

    const getInitials = () => {
        return `${profileData.firstName[0]}${profileData.lastName[0]}`
    }

    return (
        <div className="min-h-screen bg-[#181818] p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center mb-6 relative mt-2">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="absolute top-0 left-0 p-2 hover:bg-[#1d1d1d] rounded-lg transition-colors"
                >
                    <Bell className="w-6 h-6 text-gray-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <h1 className="text-white mx-auto">Мой профиль</h1>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl shadow-sm p-6 mb-6 bg-[#1d1d1d]">
                <div className="flex flex-col items-center gap-4 mb-6 text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-[#007aff] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {getInitials()}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl text-white">{profileData.firstName} {profileData.lastName}</h2>
                        <div className="flex gap-[5px] justify-center">
                            <p className="text-gray-500 text-sm">{profileData.university}</p>
                            <p className="text-gray-500 text-sm">|</p>
                            <p className="text-gray-500 text-sm">Группа: {profileData.group}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3">
                    <div className="text-center p-3 rounded-lg">
                        <div className="text-[18px] text-white">{profileData.contacts}</div>
                        <div className="text-xs text-gray-400">Коннекты</div>
                    </div>

                    <div className="text-center p-3 border-l border-gray-600">
                        <div className="text-[18px] text-[#007AFF]">{profileData.rating}</div>
                        <div className="text-xs text-gray-400">Рейтинг</div>
                    </div>

                    <div className="text-center p-3 border-l border-gray-600">
                        <div className="text-[18px] text-white">{profileData.points}</div>
                        <div className="text-xs text-gray-400">Баллы</div>
                    </div>
                </div>
            </div>

            {/* Banners Slider */}
            <div className="mb-6">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    spaceBetween={8}
                    slidesPerView={"auto"}
                    centeredSlides={true}
                    className="w-full pb-10"
                    pagination={{
                        clickable: true,
                    }}
                >
                    {banners.map(banner => (
                        <SwiperSlide
                            key={banner.id}
                            className="!w-[280px] md:!w-[300px]"
                        >
                            <div
                                className={`h-32 bg-gradient-to-r ${banner.color} rounded-xl p-4 flex items-end text-white cursor-pointer hover:scale-[1.03] transition-transform`}
                            >
                                <h4 className="font-semibold">{banner.title}</h4>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Schedule Banner */}
            <div
                onClick={() => navigate("/schedule")}
                className="overflow-hidden relative bg-gradient-to-r from-[#7848FF] to-[#000000] rounded-2xl shadow-sm p-6 mb-6 cursor-pointer hover:scale-[1.02] transition-transform"
            >
                <img className="absolute bottom-[-35%] -right-[40%] scale-75 -rotate-[20deg] rounded-[15px] border-[2px]" src={scheduleImg} alt=""/>
                <img className="absolute bottom-0 left-0" src={scheduleDecorImg} alt=""/>
                <div className="h-28">
                    <h3 className="text-white mb-1">Расписание занятий</h3>
                    <p className="text-white/80 text-sm">Твое расписание всегда под рукой</p>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-[#1d1d1d] rounded-2xl shadow-sm p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-white">
                        Архив достижений
                    </h3>
                    <Counter
                        appearance="themed"
                        mode="filled"
                        value={achievements.length}
                    />
                </div>

                <Swiper
                    spaceBetween={12}
                    slidesPerView="auto"
                    className="py-2"
                    grabCursor={true}
                >
                    {achievements.map((achievement) => (
                        <SwiperSlide
                            key={achievement.id}
                            className="w-24 h-24 flex items-center
                            justify-center rounded-[50px] border-[2px] border-[#ffffff14]
                             cursor-pointer hover:scale-105 transition-transform"
                        >
                            <img src={achievement.icon} alt=""/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Actions */}
            <div className="bg-[#1d1d1d] rounded-2xl shadow-sm divide-y divide-gray-700">
                <button
                    onClick={() => setShowEditProfile(true)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span className="text-white">Редактировать профиль</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors text-red-400">
                    <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span>Выйти из профиля</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Notifications Modal */}
            {showNotifications && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#181818] rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">Уведомления</h3>
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
                            <div className="p-4">
                                <h4 className="font-medium text-white mb-3">Запросы на коннект</h4>
                                <div className="space-y-2 mb-6">
                                    <div className="p-3  bg-[#1d1d1d] rounded-lg">
                                        <p className="text-sm text-white">Петров Иван хочет добавить вас в коннекты</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                className="flex-1"
                                            >
                                                <span>Принять</span>
                                            </Button>
                                            <Button
                                                className="flex-1"
                                                appearance="negative"
                                            >
                                                <span>Отклонить</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="font-medium text-white mb-3">Системные уведомления</h4>
                                <div className="space-y-2">
                                    <div className="p-3 bg-[#1d1d1d] rounded-lg">
                                        <p className="text-sm text-white">Новое мероприятие доступно для регистрации</p>
                                        <p className="text-xs text-gray-400 mt-1">2 часа назад</p>
                                    </div>
                                    <div className="p-3 bg-[#1d1d1d]  rounded-lg">
                                        <p className="text-sm text-white">Вы получили 50 баллов за участие</p>
                                        <p className="text-xs text-gray-400 mt-1">5 часов назад</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#181818] rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">Редактировать профиль</h3>
                            <button
                                onClick={() => setShowEditProfile(false)}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4">
                            <div className="space-y-4">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-[#007aff] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2">
                                            {getInitials()}
                                        </div>
                                        <button className="absolute bottom-0 right-0 bg-[#007aff] p-2 rounded-full">
                                            <Camera className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Нажмите для изменения фото</p>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        value={profileData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="bg-[#1d1d1d] border-gray-600"
                                    />
                                    <Input
                                        value={profileData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="bg-[#1d1d1d] border-gray-600"
                                    />
                                </div>

                                <select
                                    value={profileData.university}
                                    onChange={(value) => handleInputChange('university', value)}
                                    options={universities}
                                    className="bg-[#1d1d1d] border-gray-600"
                                />

                                <Input
                                    value={profileData.group}
                                    onChange={(e) => handleInputChange('group', e.target.value)}
                                    className="bg-[#1d1d1d] border-gray-600"
                                />

                                <Input
                                    value={profileData.contacts}
                                    onChange={(e) => handleInputChange('contacts', e.target.value)}
                                    className="bg-[#1d1d1d] border-gray-600"
                                    type="number"
                                />

                                <Input
                                    value={profileData.rating}
                                    onChange={(e) => handleInputChange('rating', e.target.value)}
                                    className="bg-[#1d1d1d] border-gray-600"
                                    type="number"
                                    step="0.1"
                                />

                                <Input
                                    value={profileData.points}
                                    onChange={(e) => handleInputChange('points', e.target.value)}
                                    className="bg-[#1d1d1d] border-gray-600"
                                    type="number"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-700 flex gap-3">
                            <Button
                                appearance="negative"
                                className="flex-1"
                                onClick={() => setShowEditProfile(false)}
                            >
                                Отмена
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleSaveProfile}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage