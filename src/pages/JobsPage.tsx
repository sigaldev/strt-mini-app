import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Filter, Briefcase } from "lucide-react";
import { Input } from "@maxhub/max-ui";
import {
    VacanciesService,
    type VacanciesFilters,
    type Vacancy
} from "../components/api/service/VacanciesService.ts";
import { FiltersPanel } from "../components/jobs/FiltersPanel.tsx";
import JobsCard from "../components/jobs/JobsCard.tsx";

const PER_PAGE = 100;

const JobsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filtersFromServer, setFiltersFromServer] = useState([]);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [showFilters, setShowFilters] = useState(false);

    const [jobs, setJobs] = useState<Vacancy[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastJobRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    // ✅ Загружаем фильтры
    useEffect(() => {
        (async () => {
            try {
                const res = await VacanciesService.fetchFilters();
                if (res?.filters) setFiltersFromServer(res.filters);
            } catch (err) {
                console.error("Ошибка фильтров:", err);
            }
        })();
    }, []);

    // ✅ Загружаем вакансии при изменении фильтров или страницы
    useEffect(() => {
        const fetchVacancies = async () => {
            setLoading(true);

            try {
                const params: VacanciesFilters = {
                    page,
                    per_page: PER_PAGE
                };

                // добавляем только НЕПУСТЫЕ фильтры
                Object.entries(activeFilters).forEach(([key, value]) => {
                    if (value) (params as any)[key] = value;
                });

                const res = await VacanciesService.getVacancies(params);
                const list = res.vacancies || [];

                setJobs((prev) => (page === 1 ? list : [...prev, ...list]));
                setHasMore(list.length === PER_PAGE);
            } catch (err) {
                console.error("Ошибка вакансий:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
    }, [page, activeFilters]);

    // ✅ Раскрытие
    const toggleExpand = (index: number) => {
        setExpandedIndex((prev) => (prev === index ? null : index));
    };

    // ✅ Обработчик выбора фильтра
    const handleFilterSelect = (filterTitle: string, value: string) => {
        setActiveFilters((prev) => ({
            ...prev,
            [filterTitle]: value === "all" ? "" : value
        }));

        setJobs([]);
        setPage(1);
        setHasMore(true);
    };

    // ✅ Фронтовый поиск по (name + company_name)
    const filteredJobs = jobs.filter((job) => {
        const q = searchQuery.toLowerCase();

        const matchesSearch =
            job.name.toLowerCase().includes(q) ||
            (job.company_name?.toLowerCase().includes(q) ?? false);

        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Вакансии</h1>

            {/* Search + Filters */}
            <div className="space-y-3 mb-6">
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    iconBefore={<Search className="w-5 h-5 text-gray-400" />}
                    mode="secondary"
                    placeholder="Поиск вакансий..."
                />

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3
                        bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200"
                >
                    <Filter className="w-5 h-5 text-gray-600" />
                    Фильтры
                </button>

                {showFilters && (
                    <FiltersPanel
                        filters={filtersFromServer}
                        activeFilters={activeFilters}
                        onSelect={handleFilterSelect}
                    />
                )}
            </div>

            {/* Jobs */}
            {filteredJobs.length === 0 && !loading ? (
                <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Вакансии не найдены</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job, index) => (
                        <JobsCard
                            key={index}
                            job={job}
                            expanded={expandedIndex === index}
                            onToggle={() => toggleExpand(index)}
                            ref={index === filteredJobs.length - 1 ? lastJobRef : null}
                        />
                    ))}
                </div>
            )}

            {loading && (
                <div className="text-center py-6 text-gray-500">Загрузка...</div>
            )}
        </div>
    );
};

export default JobsPage;
