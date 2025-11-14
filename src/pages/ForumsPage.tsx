import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icoMero from "../assets/mero/ico-1.svg";
import meroBg from "../assets/mero/meroBg.png";
import { Button } from "@maxhub/max-ui";
import EventService from "../components/api/service/EventService.ts";
import type { Event } from "../components/api/service/EventService.ts";
import Loader from "../components/Loader.tsx";

const ForumsPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRarityInfo, setShowRarityInfo] = useState(false);

    useEffect(() => {
        const fetchForums = async () => {
            try {
                setLoading(true);
                const data = await EventService.getEvents(1, 20);
                setEvents(data?.events || []);
            } catch (err) {
                console.error("Ошибка при загрузке форумов", err);
            } finally {
                setLoading(false);
            }
        };

        fetchForums();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            <div className="flex justify-between items-center mb-6 mt-4">
                <div className="absolute top-0 left-4 mt-6">
                    <Button mode="link" onClick={() => setShowRarityInfo(true)}>
                        Подробнее
                    </Button>
                </div>
                <h1 className="text-gray-900 font-bold text-xl mx-auto">
                    Форумы
                </h1>
            </div>

            {/* Recommended */}
            <h3 className="text-lg font-semibold text-white mb-4">Студент РТ рекомендует</h3>
            <div
                className="flex items-center gap-4 px-4 py-6 rounded-2xl cursor-pointer hover:shadow-md transition-shadow mb-6"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${meroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <img src={icoMero} alt="" className="w-35 h-[120px]" />
                <div>
                    <h4 className="text-white text-xl font-semibold">Форум приключений</h4>
                    <h5 className="text-white text-xl mt-2">Городской</h5>
                </div>
            </div>

            {/* Forums Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {events.length ? (
                    events.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="bg-white rounded-[28px] shadow-[2px_3px_14px_rgba(116,116,116,0.43)] w-[170px] h-[170px]
                            px-3 pt-5 pb-4 flex flex-col items-center text-center cursor-pointer overflow-hidden gap-2
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                        >
                            <div
                                className="w-[52px] h-[52px] p-[2px] rounded-full"
                                style={{
                                    backgroundImage: "linear-gradient(180deg, #7848FF 0%, #000000 100%)"
                                }}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                    <img
                                        src={event.head.logo.thumb}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center w-full">
                                <h3 className="text-sm font-semibold text-gray-900 leading-tight w-full px-1 break-words">
                                    {event.head.short_title}
                                </h3>
                                <span className="text-gray-500 text-sm mt-2">
                                    {event.head.score} баллов
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        Пока нет форумов
                    </div>
                )}
            </div>

            {/* Rarity Info Modal */}
            {showRarityInfo && (
                <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">О редкости значков</h3>
                            <button
                                onClick={() => setShowRarityInfo(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Редкость — это параметр, по которому определяется качество значка. Чем выше редкость, тем круче значок.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumsPage;
