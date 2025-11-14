import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, Trophy, TrendingUp } from "lucide-react";
import { Button, Input } from "@maxhub/max-ui";
import RatingService, { type User } from "../components/api/service/RatingService.ts";

interface Student {
    id: number;
    name: string;
    university: string;
    group: string;
    points: number;
    avatar: string;
}

const RatingPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"overall" | "season">("overall");
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchUsers = useCallback(async (newPage = 1) => {
        if (!hasMore && newPage !== 1) return;
        try {
            setLoading(true);
            console.log(`RatingPage: fetching users page ${newPage}...`);
            const response = await RatingService.getUsers(newPage, 50, searchQuery);
            console.log("RatingPage: users fetched:", response);

            const studentsData: Student[] = response.users.map((u: User) => ({
                id: u.id,
                name: u.full_name || `${u.first_name} ${u.last_name}`,
                university: u.university?.name || "-",
                group: u.group_number || "-",
                points: u.score || 0,
                avatar: u.avatar?.medium?.url || u.avatar?.large?.url || u.avatar?.thumb?.url || "",
            }));

            setStudents(prev => (newPage === 1 ? studentsData : [...prev, ...studentsData]));
            setHasMore(response.users.length === 50); // если меньше 50 — значит больше нет
            setPage(newPage);
        } catch (err) {
            console.error("RatingPage: error fetching users", err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, hasMore]);

    // Перезагрузка при изменении searchQuery или активной вкладки
    useEffect(() => {
        setStudents([]);
        setPage(1);
        setHasMore(true);
        fetchUsers(1);
    }, [searchQuery, activeTab, fetchUsers]);

    // Обработчик скролла для бесконечной ленты
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !loading && hasMore) {
                fetchUsers(page + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, page, fetchUsers]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.group.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm">
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900">Рейтинг</h1>
                </div>

                {/* Search */}
                <div className="px-4 pb-4">
                    <Input
                        mode="secondary"
                        type="text"
                        iconBefore={<Search className="w-5 h-5 text-gray-400" />}
                        placeholder="Поиск по имени, вузу или группе…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        <Button
                            appearance={activeTab === "overall" ? "themed" : "neutral"}
                            mode="primary"
                            size="medium"
                            stretched
                            iconBefore={<Trophy className="w-5 h-5" />}
                            onClick={() => setActiveTab("overall")}
                        >
                            Общий рейтинг
                        </Button>
                        <Button
                            appearance={activeTab === "season" ? "themed" : "neutral"}
                            mode="primary"
                            size="medium"
                            stretched
                            iconBefore={<TrendingUp className="w-5 h-5" />}
                            onClick={() => setActiveTab("season")}
                        >
                            Рейтинг сезона
                        </Button>
                    </div>
                </div>
            </div>

            {/* Rating List */}
            <div className="p-4 space-y-3">
                {students.length === 0 && loading ? (
                    <div className="text-center py-12 text-gray-500">Загрузка...</div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">Ничего не найдено</div>
                ) : (
                    filteredStudents.map((student, index) => {
                        const position = index + 1;
                        return (
                            <div
                                key={student.id}
                                onClick={() => navigate(`/user/${student.id}`)}
                                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4"
                            >
                                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center">
                                    <img
                                        src={student.avatar}
                                        alt={student.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-[#0177ff] font-bold text-lg w-6 text-center">
                                    {position}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 truncate">{student.name}</h3>
                                    <p className="text-sm text-gray-600 truncate">
                                        {student.university} | {student.group}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-semibold text-[#0177ff]">{student.points}</div>
                                </div>
                            </div>
                        );
                    })
                )}
                {loading && students.length > 0 && (
                    <div className="text-center py-4 text-gray-500">Загрузка ещё...</div>
                )}
            </div>
        </div>
    );
};

export default RatingPage;
