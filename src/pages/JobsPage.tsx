import { useState } from "react"
import { Search, Filter, Briefcase, MapPin, DollarSign } from "lucide-react"
import {Button, Input} from "@maxhub/max-ui"

const JobsPage = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilter, setSelectedFilter] = useState<string>("all")
    const [showFilters, setShowFilters] = useState(false)

    const filters = [
        { id: "all", label: "Все вакансии" },
        { id: "it", label: "IT" },
        { id: "marketing", label: "Маркетинг" },
        { id: "design", label: "Дизайн" },
        { id: "sales", label: "Продажи" },
    ]

    const jobs = [
        {
            id: 1,
            title: "Junior Frontend Developer",
            company: "Tech Solutions",
            location: "Москва",
            salary: "80 000 - 120 000 ₽",
            type: "Полная занятость",
            category: "it",
            description: "Ищем начинающего frontend разработчика для работы над интересными проектами.",
        },
        {
            id: 2,
            title: "SMM-менеджер",
            company: "Digital Agency",
            location: "Санкт-Петербург",
            salary: "60 000 - 90 000 ₽",
            type: "Частичная занятость",
            category: "marketing",
            description: "Требуется SMM-менеджер для ведения социальных сетей клиентов.",
        },
        {
            id: 3,
            title: "UI/UX Дизайнер",
            company: "Creative Studio",
            location: "Удаленно",
            salary: "70 000 - 100 000 ₽",
            type: "Удаленная работа",
            category: "design",
            description: "Ищем креативного дизайнера для создания современных интерфейсов.",
        },
        {
            id: 4,
            title: "Менеджер по продажам",
            company: "Sales Pro",
            location: "Казань",
            salary: "50 000 - 150 000 ₽",
            type: "Полная занятость",
            category: "sales",
            description: "Требуется активный менеджер по продажам с опытом работы.",
        },
    ]

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = selectedFilter === "all" || job.category === selectedFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="min-h-screen bg-[#111] text-gray-200 p-4 md:p-6">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-100 mb-6">Вакансии</h1>

            {/* Search + Filters */}
            <div className="mb-6 space-y-3">
                {/* Search */}
                <div className="relative">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        defaultValue=""
                        className=""
                        iconBefore={
                            <Search className="w-5 h-5 text-gray-500" />
                        }
                        mode="primary"
                        placeholder="Поиск вакансий..."
                    />
                </div>

                {/* Filters toggle button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3
                    bg-[#1a1a1a] border border-[#222] rounded-xl hover:bg-[#222] transition-colors"
                >
                    <Filter className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-200">Фильтры</span>
                </button>

                {/* Filters */}
                {showFilters && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filters.map((filter) => (
                            <Button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                appearance={selectedFilter === filter.id ? "themed" : "neutral"}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {filteredJobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-[#1a1a1a] rounded-2xl border border-[#222] p-6
                        hover:shadow-lg hover:border-[#333] transition-all"
                    >
                        <h3 className="text-lg font-semibold text-gray-100 mb-1">{job.title}</h3>
                        <p className="text-gray-400 mb-3">{job.company}</p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                <span>{job.type}</span>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4">{job.description}</p>

                        <Button
                            appearance="themed"
                            mode="primary"
                            size="medium"
                            className="w-full"
                        >
                            Откликнуться
                        </Button>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500">Вакансии не найдены</p>
                </div>
            )}
        </div>
    )
}

export default JobsPage
