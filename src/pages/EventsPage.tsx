import { useState } from "react";
import { useNavigate } from "react-router-dom";
import icoMero from "../assets/mero/ico-1.svg";
import ico1 from "../assets/achivments/ico-1.svg";
import ico2 from "../assets/achivments/ico-2.svg";
import ico3 from "../assets/achivments/ico-3.svg";
import meroBg from "../assets/mero/meroBg.png";
import { Button } from "@maxhub/max-ui";

const EventsPage = () => {
    const navigate = useNavigate();
    const [showRarityInfo, setShowRarityInfo] = useState(false);

    const events = [
        { id: 1, title: "Хакатон по ИИ", image: ico1, points: 200, rarity: "Уникальный" },
        { id: 2, title: "Конференция по кибербезопасности", image: ico2, points: 150, rarity: "Редкий" },
        { id: 3, title: "Мастер-класс по веб-разработке", image: ico3, points: 100, rarity: "Возвышающий" },
        { id: 4, title: "Олимпиада по программированию", image: ico1, points: 250, rarity: "Легендарный" },
    ];

    const rarityLevels = [
        { name: "Возвышающий", points: 100, color: "text-gray-400" },
        { name: "Редкий", points: 150, color: "text-blue-400" },
        { name: "Уникальный", points: 200, color: "text-purple-400" },
        { name: "Легендарный", points: 250, color: "text-amber-400" },
    ];

    return (
        <div className="min-h-screen bg-[#181818] p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 mt-4 relative">
                <Button
                    mode="link"
                    onClick={() => setShowRarityInfo(true)}
                >
                    Подробнее
                </Button>
                <h1 className="absolute left-[50%] -translate-x-[50%] text-white font-bold">
                    Мероприятия
                </h1>
            </div>

            {/* Recommended */}
            <h3 className="text-lg font-semibold text-white mb-4">Студент РТ рекомендует</h3>
            <div
                className="flex items-center gap-4 px-4 py-12 rounded-2xl cursor-pointer hover:shadow-md transition-shadow mb-6"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${meroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <img src={icoMero} alt="" className="w-35 h-[120px]" />
                <div>
                    <h4 className="text-white text-xl font-semibold">Лига приключений</h4>
                    <h5 className="text-white text-xl mt-2">Городской</h5>
                </div>
            </div>

            {/* Events Grid */}
            <h3 className="text-lg font-semibold text-white mb-4">Все мероприятия</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-[#1d1d1d] rounded-xl shadow-sm p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform"
                    >
                        <img src={event.image} alt="" className="w-20 h-20 mb-2" />
                        <h3 className="text-center text-sm font-medium text-white mb-1">
                            {event.title}
                        </h3>
                        <span className="text-[#007aff] text-sm">
                            {event.points} баллов
                        </span>
                    </div>
                ))}
            </div>

            {/* Rarity Info Modal */}
            {showRarityInfo && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1d1d1d] rounded-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">О редкости значков</h3>
                            <button
                                onClick={() => setShowRarityInfo(false)}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Редкость — это параметр, по которому определяется качество значка. Чем выше редкость, тем круче значок.
                        </p>
                        <div className="space-y-3">
                            {rarityLevels.map((level) => (
                                <div
                                    key={level.name}
                                    className="flex items-center justify-between p-3 bg-[#181818] rounded-lg"
                                >
                                    <span className={`font-semibold ${level.color}`}>{level.name}</span>
                                    <span className="text-gray-400">{level.points} баллов</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
