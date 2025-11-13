import { useState, useMemo, useEffect } from "react";
import { Clock, MapPin, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { type DaySchedule, type ScheduleLesson, ScheduleService } from "../components/api/service/ScheduleService.ts";

type LessonType = "lecture" | "practice" | "lab";

interface Lesson {
    id: number;
    subject: string;
    time: string;
    room: string;
    teacher: string;
    type: LessonType;
}

type Schedule = Record<"ПН" | "ВТ" | "СР" | "ЧТ" | "ПТ" | "СБ" | "ВС", Lesson[]>;

const typeColors: Record<LessonType, string> = {
    lecture: "bg-blue-100 text-blue-800 border border-blue-200",
    practice: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    lab: "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

const typeLabels: Record<LessonType, string> = {
    lecture: "Лекция",
    practice: "Практика",
    lab: "Лаб. работа",
};

const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const;

const SchedulePage = () => {
    const [schedule, setSchedule] = useState<Schedule>({
        ПН: [], ВТ: [], СР: [], ЧТ: [], ПТ: [], СБ: [], ВС: []
    });
    const [currentWeek, setCurrentWeek] = useState(0);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean | null>(null);

    const mapScheduleLesson = (lesson: ScheduleLesson): Lesson => ({
        id: lesson.subject.id + Math.random(),
        subject: lesson.subject.name,
        time: `${lesson.start_time} - ${lesson.end_time}`,
        room: lesson.room,
        teacher: lesson.teacher.name,
        type: lesson.subject.type as LessonType,
    });

    const getWeekdayIndex = (dateString: string) => {
        return new Date(dateString).getDay();
    };

    const mapDaySchedule = (day: DaySchedule): Lesson[] => day.schedule.map(mapScheduleLesson);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const today = new Date();
                const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay();
                const monday = new Date(today);
                monday.setDate(today.getDate() + mondayOffset + currentWeek * 7);

                const date_from = monday.toLocaleDateString("ru-RU");
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                const date_to = sunday.toLocaleDateString("ru-RU");

                const data = await ScheduleService.getSchedule(date_from, date_to);

                const newSchedule: Schedule = { ПН: [], ВТ: [], СР: [], ЧТ: [], ПТ: [], СБ: [], ВС: [] };
                if (data.schedule.length) setIsEvenWeek(data.schedule[0].is_even_week);

                data.schedule.forEach(day => {
                    const dayKey = weekDays[getWeekdayIndex(day.date)];
                    newSchedule[dayKey] = mapDaySchedule(day);
                });

                setSchedule(newSchedule);
            } catch (error) {
                console.error("Failed to load schedule:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [currentWeek]);

    const weekDates = useMemo(() => {
        const today = new Date();
        const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset + currentWeek * 7);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
    }, [currentWeek]);

    const monthName = useMemo(() => {
        const months = ["Январь","Февраль","Март","Апрель","Май","Июнь",
            "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
        return months[weekDates[0].getMonth()];
    }, [weekDates]);

    const selectedDay = weekDays[selectedDayIndex];
    const lessons = schedule[selectedDay];

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Расписание</h1>
                <p className="text-gray-600">Группа: ПМ-301</p>
                {isEvenWeek !== null && (
                    <p className="text-gray-600 text-sm mt-1">
                        {isEvenWeek ? "Чётная неделя" : "Нечётная неделя"}
                    </p>
                )}
            </div>

            {/* Navigation */}
            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setCurrentWeek(prev => prev - 1)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <div className="text-center">
                        <p className="font-semibold text-gray-900">{monthName} {weekDates[0].getFullYear()}</p>
                        <p className="text-gray-600 text-sm">
                            {weekDates[0].getDate()} — {weekDates[6].getDate()} {monthName}
                        </p>
                    </div>

                    <button onClick={() => setCurrentWeek(prev => prev + 1)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, i) => {
                        const date = weekDates[i];
                        const selected = selectedDayIndex === i;
                        const today = date.toDateString() === new Date().toDateString();
                        return (
                            <div
                                key={day}
                                onClick={() => setSelectedDayIndex(i)}
                                className={`p-3 rounded-xl cursor-pointer transition text-center
                                    ${selected ? "bg-blue-500 text-white" :
                                    today ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                        "bg-gray-50 text-gray-700 hover:bg-gray-200"}`}
                            >
                                <div className="text-xs mb-1">{day}</div>
                                <div className="text-lg font-bold">{date.getDate()}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lessons */}
            {loading ? (
                <div className="text-center text-gray-500">Загрузка расписания...</div>
            ) : lessons.length === 0 ? (
                <div className="bg-gray-100 rounded-2xl p-8 text-center text-gray-600">
                    На этот день занятий нет
                </div>
            ) : (
                <div className="space-y-4">
                    {lessons.map(lesson => (
                        <div key={lesson.id} className="bg-gray-100 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-gray-900 font-semibold mb-1">{lesson.subject}</h3>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${typeColors[lesson.type]}`}>
                                        {typeLabels[lesson.type]}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {lesson.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {lesson.room}
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> {lesson.teacher}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Legend */}
            <div className="bg-gray-100 rounded-2xl p-4 mt-6">
                <h3 className="text-gray-900 font-semibold mb-3">Обозначения</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-4 h-4 rounded bg-blue-200"></span> Лекция
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-4 h-4 rounded bg-emerald-200"></span> Практика
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-4 h-4 rounded bg-yellow-200"></span> Лаб. работа
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
