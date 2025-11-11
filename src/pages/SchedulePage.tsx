import { useState, useMemo } from "react"
import { Clock, MapPin, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react'

type LessonType = "lecture" | "practice" | "lab"

interface Lesson {
    id: number
    subject: string
    time: string
    room: string
    teacher: string
    type: LessonType
}

type Schedule = {
    ПН: Lesson[]
    ВТ: Lesson[]
    СР: Lesson[]
    ЧТ: Lesson[]
    ПТ: Lesson[]
    СБ: Lesson[]
    ВС: Lesson[]
}

const typeColors: Record<LessonType, string> = {
    lecture: "bg-blue-100 text-blue-800 border border-blue-200",
    practice: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    lab: "bg-yellow-100 text-yellow-800 border border-yellow-200",
}

const typeLabels: Record<LessonType, string> = {
    lecture: "Лекция",
    practice: "Практика",
    lab: "Лаб. работа",
}

const SchedulePage = () => {
    const [currentWeek, setCurrentWeek] = useState(0)
    const [selectedDayIndex, setSelectedDayIndex] = useState(0)

    const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const

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

    const schedule: Schedule = {
        ПН: [
            { id: 1, subject: "Высшая математика", time: "08:30 - 10:00", room: "Ауд. 201", teacher: "Гаязов А.Р.", type: "lecture" },
            { id: 2, subject: "Высшая математика", time: "10:10 - 11:40", room: "Ауд. 201", teacher: "Гаязов А.Р.", type: "practice" },
            { id: 3, subject: "Физическая культура", time: "12:10 - 13:40", room: "Спорт. зал", teacher: "Валеев Р.М.", type: "practice" },
            { id: 4, subject: "Программирование", time: "13:50 - 15:20", room: "Ауд. 305", teacher: "Шайхутдинова Л.Н.", type: "lecture" },
        ],
        ВТ: [
            { id: 5, subject: "Иностранный язык", time: "08:30 - 10:00", room: "Ауд. 112", teacher: "Хасанова Э.И.", type: "practice" },
            { id: 6, subject: "Дискретная математика", time: "10:10 - 11:40", room: "Ауд. 203", teacher: "Нуриев Н.К.", type: "lecture" },
            { id: 7, subject: "Программирование", time: "12:10 - 13:40", room: "Комп. класс 1", teacher: "Шайхутдинова Л.Н.", type: "lab" },
            { id: 8, subject: "История России", time: "13:50 - 15:20", room: "Ауд. 401", teacher: "Гилязов И.А.", type: "lecture" },
        ],
        СР: [
            { id: 9, subject: "Физика", time: "08:30 - 10:00", room: "Ауд. 308", teacher: "Сафин Р.Г.", type: "lecture" },
            { id: 10, subject: "Физика", time: "10:10 - 11:40", room: "Лаб. 2-14", teacher: "Сафин Р.Г.", type: "lab" },
            { id: 11, subject: "Алгоритмы и структуры данных", time: "12:10 - 13:40", room: "Ауд. 205", teacher: "Исмагилов Т.Р.", type: "lecture" },
            { id: 12, subject: "Основы проектной деятельности", time: "13:50 - 15:20", room: "Ауд. 301", teacher: "Камалов Р.Р.", type: "practice" },
        ],
        ЧТ: [
            { id: 13, subject: "Иностранный язык", time: "08:30 - 10:00", room: "Ауд. 112", teacher: "Хасанова Э.И.", type: "practice" },
            { id: 14, subject: "Дискретная математика", time: "10:10 - 11:40", room: "Ауд. 203", teacher: "Нуриев Н.К.", type: "practice" },
            { id: 15, subject: "Алгоритмы и структуры данных", time: "12:10 - 13:40", room: "Комп. класс 2", teacher: "Исмагилов Т.Р.", type: "lab" },
        ],
        ПТ: [
            { id: 16, subject: "Высшая математика", time: "08:30 - 10:00", room: "Ауд. 201", teacher: "Гаязов А.Р.", type: "practice" },
            { id: 17, subject: "Программирование", time: "10:10 - 11:40", room: "Комп. класс 1", teacher: "Шайхутдинова Л.Н.", type: "lab" },
            { id: 18, subject: "Философия", time: "12:10 - 13:40", room: "Ауд. 402", teacher: "Хабибуллин К.Н.", type: "lecture" },
        ],
        СБ: [
            { id: 19, subject: "Основы российской государственности", time: "08:30 - 10:00", room: "Ауд. 301", teacher: "Миннуллин К.М.", type: "lecture" },
            { id: 20, subject: "Физика", time: "10:10 - 11:40", room: "Ауд. 308", teacher: "Сафин Р.Г.", type: "practice" },
        ],
        ВС: [],
    }

    const selectedDay = weekDays[selectedDayIndex]
    const lessons = schedule[selectedDay]

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Расписание</h1>
                <p className="text-gray-600">Группа: ПМ-301</p>
            </div>

            {/* Navigation */}
            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setCurrentWeek(prev => prev - 1)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <div className="text-center">
                        <p className="font-semibold text-gray-900">{monthName} {weekDates[0].getFullYear()}</p>
                        <p className="text-gray-600 text-sm">
                            {weekDates[0].getDate()} — {weekDates[6].getDate()} {monthName}
                        </p>
                    </div>

                    <button
                        onClick={() => setCurrentWeek(prev => prev + 1)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
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
                                className={`p-3 rounded-xl cursor-pointer transition text-center
                                    ${selected ? "bg-blue-500 text-white" :
                                    today ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                        "bg-gray-50 text-gray-700 hover:bg-gray-200"}`}
                            >
                                <div className="text-xs mb-1">{day}</div>
                                <div className="text-lg font-bold">{date.getDate()}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Lessons */}
            {lessons.length === 0 ? (
                <div className="bg-gray-100 rounded-2xl p-8 text-center text-gray-600">
                    На этот день занятий нет
                </div>
            ) : (
                <div className="space-y-4">
                    {lessons.map((lesson: Lesson) => (
                        <div
                            key={lesson.id}
                            className="bg-gray-100 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition"
                        >
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
    )
}

export default SchedulePage
