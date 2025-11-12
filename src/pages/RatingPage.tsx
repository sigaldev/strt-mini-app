import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, Trophy, TrendingUp } from "lucide-react";
import {Button, Input} from "@maxhub/max-ui";

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

    const overallRating: Student[] = [
        { id: 1, name: "Иванов Алексей", university: "МГУ им. Ломоносова", group: "ПМ-301", points: 2450, avatar: "АИ" },
        { id: 2, name: "Петрова Мария", university: "КФУ", group: "ИВТ-201", points: 2380, avatar: "ПМ" },
        { id: 3, name: "Сидоров Дмитрий", university: "КНИТУ", group: "ПО-402", points: 2310, avatar: "СД" },
        { id: 4, name: "Козлова Анна", university: "КГЭУ", group: "ИБ-301", points: 2245, avatar: "КА" },
        { id: 5, name: "Морозов Игорь", university: "КГАСУ", group: "СТ-203", points: 2180, avatar: "МИ" },
    ];

    const seasonRating: Student[] = [
        { id: 2, name: "Петрова Мария", university: "КФУ", group: "ИВТ-201", points: 1250, avatar: "ПМ" },
        { id: 1, name: "Иванов Алексей", university: "МГУ им. Ломоносова", group: "ПМ-301", points: 1180, avatar: "АИ" },
    ];

    const currentRating = activeTab === "overall" ? overallRating : seasonRating;

    const filteredStudents = currentRating.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.group.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPositionColor = (pos: number) => {
        if (pos === 1) return "from-amber-400 to-amber-500";
        if (pos === 2) return "from-gray-300 to-gray-400";
        if (pos === 3) return "from-orange-400 to-orange-500";
        return "from-blue-500 to-blue-600";
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm">
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate("/profile")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>

                    <h1 className="text-xl font-semibold text-gray-900">Рейтинг</h1>
                </div>

                {/* Search */}
                <div className="px-4 pb-4">
                    <div className="relative">

                        <Input
                            mode="secondary"
                            type="text"
                            iconBefore={
                                <Search className=" w-5 h-5 text-gray-400" />
                            }
                            placeholder="Поиск по имени, вузу или группе…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

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
                {filteredStudents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Ничего не найдено
                    </div>
                ) : (
                    filteredStudents.map((student, index) => {
                        const position = index + 1;

                        return (
                            <div
                                key={student.id}
                                onClick={() => navigate(`/user/${student.id}`)}
                                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Position */}
                                    <div
                                        className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center
                                            text-white text-lg font-bold bg-gradient-to-br
                                            ${getPositionColor(position)}
                                        `}
                                    >
                                        {position <= 3 ? (
                                            <Trophy className="w-5 h-5 text-white" />
                                        ) : (
                                            position
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {student.avatar}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 truncate">
                                            {student.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate">
                                            {student.university}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Группа: {student.group}
                                        </p>
                                    </div>

                                    {/* Points */}
                                    <div className="text-right">
                                        <div className="text-lg text-[#0177ff]">
                                            {student.points}
                                        </div>
                                        <div className="text-xs text-gray-500">баллов</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RatingPage;
