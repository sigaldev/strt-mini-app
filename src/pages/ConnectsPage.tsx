import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ConnectService from "../components/api/service/ConnectService.ts";

interface ConnectUser {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    university: string;
    group: string;
    avatar: string | null;
}

const ConnectsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const finalUserId = Number(id);
    console.log("[ConnectsPage] finalUserId:", finalUserId);

    const [connects, setConnects] = useState<ConnectUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConnects = async () => {
            if (!finalUserId) {
                console.warn("[ConnectsPage] No user ID provided in params");
                setLoading(false);
                return;
            }

            console.log("[ConnectsPage] Fetching connects...");
            setLoading(true);
            try {
                const response = await ConnectService.getUserConnects(finalUserId);
                console.log("[ConnectsPage] Raw response:", response);

                const mapped = response.map((c: any) => {
                    const u = c.user;
                    return {
                        id: u.id,
                        full_name: `${u.first_name} ${u.last_name}`,
                        first_name: u.first_name || "",
                        last_name: u.last_name || "",
                        university: u.university?.abbreviation || "-", // <- вот тут берём abbreviation
                        group: u.group_number || "-",
                        avatar:
                            u.avatar?.medium?.url ||
                            u.avatar?.large?.url ||
                            u.avatar?.thumb?.url ||
                            null,
                    };
                });

                console.log("[ConnectsPage] Mapped connects:", mapped);
                setConnects(mapped);
            } catch (e) {
                console.error("[ConnectsPage] Failed to load connects:", e);
            } finally {
                setLoading(false);
                console.log("[ConnectsPage] Loading finished");
            }
        };

        fetchConnects();
    }, [finalUserId]);

    const getInitials = (connect: ConnectUser) => {
        const first = connect.first_name?.trim()?.[0] || connect.full_name?.trim()?.[0] || "";
        const last =
            connect.last_name?.trim()?.[0] ||
            connect.full_name?.trim().split(/\s+/)[1]?.[0] ||
            "";
        return `${first}${last}`.toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm">
                <div className="px-4 py-6 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition absolute top-4 left-4"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>

                    <h1 className="text-xl mx-auto font-semibold text-gray-900">
                        Коннекты
                    </h1>
                </div>
            </div>

            {/* Connect list */}
            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Загрузка...</div>
                ) : connects.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">Пока нет коннектов</div>
                ) : (
                    connects.map((u) => (
                        <div
                            key={u.id}
                            onClick={() => {
                                console.log(`[ConnectsPage] Navigating to user ID: ${u.id}`);
                                navigate(`/user/${u.id}`);
                            }}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4"
                        >
                            <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-white text-lg font-semibold">
                                {u.avatar ? (
                                    <img
                                        src={u.avatar}
                                        alt={u.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-[#007AFF] w-full h-full flex items-center justify-center">
                                        {getInitials(u)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                    {u.full_name}
                                </h3>
                                <p className="text-sm text-gray-600 truncate">
                                    {u.university} | {u.group}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConnectsPage;
