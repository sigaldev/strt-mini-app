import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from "@maxhub/max-ui";
import ico1 from "../assets/achivments/ico-1.svg";

const EventDetailPage = () => {
    const navigate = useNavigate();

    const event = {
        id: 1,
        title: "Хакатон по искусственному интеллекту",
        image: ico1,
        points: 200,
        level: "Республиканский",
        tags: ["AI", "Machine Learning", "Python", "Командная работа"],
        description:
            "Примите участие в увлекательном хакатоне, посвященном искусственному интеллекту! Вы получите возможность работать в команде, решать реальные задачи и создавать инновационные проекты с использованием современных технологий машинного обучения.",
        date: "15 апреля 2024",
        location: "МГУ, Главное здание",
        participants: 120,
    };

    return (
        <div className="min-h-screen bg-[#181818]">
            {/* Header */}
            <div className="bg-[#1d1d1d] border-b border-gray-700 sticky top-0 z-10">
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate("/events")}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-300" />
                    </button>
                    <h1 className="text-lg font-semibold text-white">Детали мероприятия</h1>
                </div>
            </div>

            <div className="p-4 md:p-6 max-w-4xl mx-auto">
                {/* Event Image */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl h-64 flex items-center justify-center text-9xl mb-6 text-white">
                    <img className="w-[120px] h-[120px] mt-auto" src={event.image} alt=""/>
                </div>

                {/* Event Info */}
                <div className="bg-[#1d1d1d] rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-3">{event.title}</h2>

                    {/* Level Badge */}
                    <div className="inline-block px-3 py-1 bg-blue-800 text-blue-300 rounded-full text-sm font-medium mb-4">
                        {event.level}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {event.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm"
                            >
                {tag}
              </span>
                        ))}
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-400">
                            <Calendar className="w-5 h-5" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                            <MapPin className="w-5 h-5" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                            <Users className="w-5 h-5" />
                            <span>{event.participants} участников</span>
                        </div>
                    </div>

                    {/* Points */}
                    <div className="p-4 bg-[#252525] rounded-xl mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Баллы за участие:</span>
                            <span className="text-3xl  text-[#007aff]">{event.points}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Описание</h3>
                        <p className="text-gray-300 leading-relaxed">{event.description}</p>
                    </div>

                    {/* Register Button */}
                    <Button
                        appearance="themed"
                        mode="primary"
                        onClick={() => {}}
                        size="large"
                        className="w-full py-4 text-white font-semibold"
                    >
                        Записаться на мероприятие
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
