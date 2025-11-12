import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@maxhub/max-ui";
import EventService, { type Event } from "../components/api/service/EventService.ts";
import Loader from "../components/Loader.tsx";

const EventDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const data = await EventService.getEventById(Number(id));
                setEvent(data.event);
            } catch (err) {
                console.error("EventDetailPage: error loading event:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading || !event) return <Loader />;

    const head = event.head;
    const blocksByType: Record<string, any> = {};
    event.blocks.forEach((block: any) => {
        const type = block.type; // тип блока
        blocksByType[type] = block.data;
    });

// Теперь достаём данные по типу
    const plainDescription = blocksByType["plain_description"]?.body;
    const infoBlock = blocksByType["info"];
    const photosBlock = blocksByType["photos"]?.photos || [];
    const buttonBlock = blocksByType["buttons"]?.buttons?.[0];

    console.log(plainDescription);
    console.log(infoBlock);
    console.log(photosBlock);
    console.log(buttonBlock);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate("/events")}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Детали мероприятия</h1>
                </div>
            </div>

            <div className="p-4 md:p-6 max-w-4xl mx-auto">
                {/* Background / Logo */}
                <div className="rounded-2xl overflow-hidden mb-6 relative h-64 bg-gray-200">
                    {head.background?.large ? (
                        <img
                            src={head.background.large}
                            alt={head.full_title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-4xl text-gray-500">
                            🎉
                        </div>
                    )}
                    {head.logo?.medium && (
                        <img
                            src={head.logo.medium}
                            alt={head.short_title}
                            className="absolute bottom-4 left-4 w-20 h-20 rounded-xl bg-white p-2 shadow-md"
                        />
                    )}
                </div>

                {/* Info */}
                <div className="bg-gray-100 rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{head.full_title}</h2>

                    {/* Tags */}
                    {head.tags && head.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {head.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
                                >
                                    {tag.title}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Info block */}
                    {infoBlock && (
                        <div className="space-y-3 mb-6 text-gray-700">
                            {infoBlock.format && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5" />
                                    <span>{infoBlock.format}</span>
                                </div>
                            )}
                            {infoBlock.location_description && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5" />
                                    <span>{infoBlock.location_description}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Points */}
                    <div className="p-4 bg-gray-200 rounded-xl mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Баллы за участие:</span>
                            <span className="text-3xl text-blue-600">{head.score}</span>
                        </div>
                    </div>

                    {/* Description */}
                    {plainDescription && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {plainDescription}
                            </p>
                        </div>
                    )}

                    {/* Photos */}
                    {photosBlock.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                            {photosBlock.map((photo, i) => (
                                <img
                                    key={i}
                                    src={photo.medium || photo.original}
                                    alt={`Фото ${i + 1}`}
                                    className="rounded-xl object-cover"
                                />
                            ))}
                        </div>
                    )}

                    {/* Button */}
                    {buttonBlock && (
                        <Button
                            appearance="themed"
                            mode="primary"
                            size="large"
                            onClick={() => window.open(buttonBlock.link, "_blank")}
                            className="w-full py-4 font-semibold"
                        >
                            {buttonBlock.title || "Перейти на мероприятие"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
