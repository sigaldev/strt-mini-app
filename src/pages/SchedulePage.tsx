import { useState, useMemo } from "react"
import {Clock, MapPin, User as UserIcon, ChevronLeft, ChevronRight} from 'lucide-react'

const SchedulePage = () => {
    const [currentWeek, setCurrentWeek] = useState(0)
    const [selectedDayIndex, setSelectedDayIndex] = useState(0)

    const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]

    // Week dates calculation
    const weekDates = useMemo(() => {
        const today = new Date()
        const currentDay = today.getDay()
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
        const monday = new Date(today)
        monday.setDate(today.getDate() + mondayOffset + currentWeek * 7)

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday)
            date.setDate(monday.getDate() + i)
            return date
        })
    }, [currentWeek])

    const monthName = useMemo(() => {
        const months = [
            "Январь","Февраль","Март","Апрель","Май","Июнь",
            "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
        ]
        return months[weekDates[0].getMonth()]
    }, [weekDates])

    const schedule = {
        "ПН": [
            { id: 1, subject: "Высшая математика", time: "08:30 - 10:00", room: "Ауд. 201", teacher: "Гаязов А.Р.", type: "lecture" },
            { id: 2, subject: "Высшая математика", time: "10:10 - 11:40", room: "Ауд. 201", teacher: "Гаязов А.Р.", type: "practice" },
            { id: 3, subject: "Физическая культура", time: "12:10 - 13:40", room: "Спорт. зал", teacher: "Валеев Р.М.", type: "practice" },
            { id: 4, subject: "Программирование", time: "13:50 - 15:20", room: "Ауд. 305", teacher: "Шайхутдинова Л.Н.", type: "lecture" },
        ],
        "ВТ": [
            { id: 5, subject: "Иностранный язык", time: "08:30 - 10:00", room: "Ауд. 112", teacher: "Хасанова Э.И.", type: "practice" },
            { id: 6, subject: "Дискретная математика", time: "10:10 - 11:40", room: "Ауд. 203", teacher: "Нуриев Н.К.", type: "lecture" },
            { id: 7, subject: "Программирование", time: "12:10 - 13:40", room: "Комп. класс 1", teacher: "Шайхутдинова Л.Н.", type: "lab" },
            { id: 8, subject: "История России", time: "13:50 - 15:20", room: "Ауд. 401", teacher: "Гилязов И.А.", type: "lecture" },
        ],
        "СР": [
            { id: 9, subject: "Физика", time: "08:30 - 10:00", room: "Ауд. 308", teacher: "Сафин Р.Г.", type: "lecture" },
            { id: 10, subject: "Физика", time: "10:10 - 11:40", room: "Лаб. 2-14", teacher: "Сафин Р.Г.", type: "lab" },
            { id: 11, subject: "Алгоритмы и структуры данных", time: "12:10 - 13:40", room: "Ауд. 205", teacher: "Исмагилов Т.Р.", type: "lecture" },
            { id: 12, subject: "Основы проектной деятельности", time: "13:50 - 15:20", room: "Ауд. 301", teacher: "Камалов Р.Р.", type: "practice" },
        ],
        "ЧТ": [
            { id: 13, subject: "Иностранный язык", time: "08:30 - 10:00", room: "Ауд. 112", teacher: "Хасанова Э.И.", type: "practice" },
            { id: 14, subject: "Дискретная математика", time: "10:10 - 11:40", room: "Ауд. 203", teacher: "Нуриев Н.К.", type: "practice" },
            { id: 15, subject: "Алгоритмы и структуры данных", time: "12:10 - 13:40", room: "Комп. класс 2", teacher: "Исмагилов Т.Р.", type: "lab" },
        ],
        "ПТ": [
            { id: 16, subject: "Высшая математика", time: "08:30 - 10:00", room: "Ауд. 201", teacher: "Гаязов А.Р.", type: "practice" },
            { id: 17, subject: "Программирование", time: "10:10 - 11:40", room: "Комп. класс 1", teacher: "Шайхутдинова Л.Н.", type: "lab" },
            { id: 18, subject: "Философия", time: "12:10 - 13:40", room: "Ауд. 402", teacher: "Хабибуллин К.Н.", type: "lecture" },
        ],
        "СБ": [
            { id: 19, subject: "Основы российской государственности", time: "08:30 - 10:00", room: "Ауд. 301", teacher: "Миннуллин К.М.", type: "lecture" },
            { id: 20, subject: "Физика", time: "10:10 - 11:40", room: "Ауд. 308", teacher: "Сафин Р.Г.", type: "practice" },
        ],
        "ВС": [],
    }

    const typeColors = {
        lecture: "bg-blue-500/20 text-blue-300 border border-blue-500/20",
        practice: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20",
        lab: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20",
    }

    const typeLabels = {
        lecture: "Лекция",
        practice: "Практика",
        lab: "Лаб. работа",
    }

    return (
        <div className="min-h-screen bg-[#0d0d0f] p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Расписание</h1>
                <p className="text-gray-400">Группа: ПМ-301</p>
            </div>

            {/* Navigation */}
            <div className="bg-[#1a1a1d] rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setCurrentWeek(prev => prev - 1)}
                        className="p-2 rounded-lg hover:bg-white/5 transition"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-300" />
                    </button>

                    <div className="text-center">
                        <p className="font-semibold text-white">{monthName} {weekDates[0].getFullYear()}</p>
                        <p className="text-gray-400 text-sm">
                            {weekDates[0].getDate()} — {weekDates[6].getDate()} {monthName}
                        </p>
                    </div>

                    <button
                        onClick={() => setCurrentWeek(prev => prev + 1)}
                        className="p-2 rounded-lg hover:bg-white/5 transition"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, i) => {
                        const date = weekDates[i]
                        const selected = selectedDayIndex === i
                        const today = date.toDateString() === new Date().toDateString()

                        return (
                            <div
                                key={day}
                                onClick={() => setSelectedDayIndex(i)}
                                className={`p-3 rounded-xl cursor-pointer transition 
                                    ${selected ? "bg-[#0177ff] text-white" :
                                    today ? "bg-blue-500/20 text-blue-300 border border-blue-500/20" :
                                        "bg-[#232326] text-gray-300 hover:bg-[#2d2d31]"}`}
                            >
                                <div className="text-xs mb-1 text-center">{day}</div>
                                <div className="text-lg font-bold text-center">{date.getDate()}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Lessons */}
            {(() => {
                const day = weekDays[selectedDayIndex]
                const list = schedule[day]

                if (list.length === 0)
                    return (
                        <div className="bg-[#1a1a1d] rounded-2xl p-8 text-center text-gray-400">
                            На этот день занятий нет
                        </div>
                    )

                return (
                    <div className="space-y-4">
                        {list.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="bg-[#1a1a1d] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">{lesson.subject}</h3>
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${typeColors[lesson.type]}`}>
                                            {typeLabels[lesson.type]}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-gray-400 text-sm">
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
                )
            })()}

            {/* Legend */}
            <div className="bg-[#1a1a1d] rounded-2xl p-4 mt-6">
                <h3 className="text-white font-semibold mb-3">Обозначения</h3>

                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="w-4 h-4 rounded bg-blue-500/40"></span> Лекция
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="w-4 h-4 rounded bg-emerald-500/40"></span> Практика
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="w-4 h-4 rounded bg-yellow-500/40"></span> Лаб. работа
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchedulePage
