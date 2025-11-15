import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import icoMero from "../assets/mero/ico-1.svg";
import meroBg from "../assets/mero/meroBg.png";
import { Button, Spinner } from "@maxhub/max-ui";
import EventService from "../components/api/service/EventService.ts";
import type { Event, EventType } from "../components/api/service/EventService.ts";
import Loader from "../components/Loader.tsx";

const EventsPage = () => {
    const navigate = useNavigate();
    const [showRarityInfo, setShowRarityInfo] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState<EventType>("event");
    const [recommendedEvent, setRecommendedEvent] = useState<Event | null>(null);

    const loaderRef = useRef<HTMLDivElement>(null);

    const rarityLevels = [
        { name: "Возвышающий", points: 100, color: "text-gray-500" },
        { name: "Редкий", points: 150, color: "text-blue-500" },
        { name: "Уникальный", points: 200, color: "text-purple-500" },
        { name: "Легендарный", points: 250, color: "text-amber-500" },
    ];

    const fetchEvents = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            const data = await EventService.getEvents(pageNum, 20, activeTab);
            const newEvents = data?.events || [];

            setEvents((prev) => [...prev, ...newEvents]);
            setHasMore(newEvents.length > 0);
        } catch (err) {
            console.error("Ошибка при загрузке мероприятий", err);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        // При смене вкладки сбрасываем события
        setEvents([]);
        setPage(1);
        setHasMore(true);
        fetchEvents(1);
    }, [activeTab, fetchEvents]);

    useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore]);

    useEffect(() => {
        if (page === 1) return;
        fetchEvents(page);
    }, [page, fetchEvents]);

    useEffect(() => {
        const fetchEvent = async () => {
            const recommended = await EventService.getEventById(915);
            setRecommendedEvent(recommended.event);
        }
        fetchEvent();
    }, []);

    const tabs: { id: EventType; label: string }[] = [
        { id: "event", label: "Мероприятия" },
        { id: "challenge", label: "Задания" },
    ];

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-0 xs:mb-8 mt-4 relative">
                <Button mode="link" onClick={() => setShowRarityInfo(true)}>Подробнее</Button>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-gray-900 font-bold text-xl">Мероприятия</h1>
            </div>

            {/* Recommended Banner */}
            {recommendedEvent && (
                <>
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Студент РТ рекомендует
                    </h3>
                    <div
                        className=" flex items-center gap-4 px-4 py-6 rounded-2xl cursor-pointer hover:shadow-md transition-shadow mb-6"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${recommendedEvent.head.background.medium})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                        onClick={() => navigate(`/events/${recommendedEvent.id}`)}
                    >
                        <img
                            src={recommendedEvent.head.logo.thumb}
                            alt=""
                            className="rounded-3xl w-32 h-[120px]"
                        />
                        <div>
                            <h4 className="text-white text-xl">
                                {recommendedEvent.head.short_title}
                            </h4>
                            <h5 className="text-white text-md mt-2">
                                {recommendedEvent.head.rarity.name}
                            </h5>
                        </div>
                    </div>
                </>
            )}

            <div className="flex gap-2 mb-5">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        appearance={activeTab === tab.id ? "themed" : "neutral"}
                        mode="primary"
                        stretched
                        size="medium"
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-white rounded-[28px] shadow-[2px_3px_14px_rgba(116,116,116,0.43)] w-[170px] h-[170px]
                            px-3 pt-5 pb-4 flex flex-col items-center text-center cursor-pointer overflow-hidden gap-2
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                    >
                        <div
                            className="w-[52px] h-[52px] p-[2px] rounded-full"
                            style={{ backgroundImage: "linear-gradient(180deg, #7848FF 0%, #000000 100%)" }}
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
                ))}

                {/* Loader for infinite scroll */}
                {hasMore && (
                    <div ref={loaderRef} className="col-span-full flex justify-center py-10">
                        Загрузка...
                    </div>
                )}

                {!hasMore && events.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        Пока нет данных для этой категории
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
                        <div className="space-y-3">
                            {rarityLevels.map((level) => (
                                <div
                                    key={level.name}
                                    className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg"
                                >
                                    <span className={`font-semibold ${level.color}`}>{level.name}</span>
                                    <span className="text-gray-700">{level.points} баллов</span>
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
