import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Filter, Briefcase } from "lucide-react";
import { Input } from "@maxhub/max-ui";
import {
    VacanciesService,
    type VacanciesFilters,
    type Vacancy,
    type VacancyFilter
} from "../components/api/service/VacanciesService.ts";
import { FiltersPanel } from "../components/jobs/FiltersPanel.tsx";
import JobsCard from "../components/jobs/JobsCard.tsx";

const PER_PAGE = 100;

export const FILTER_KEY_MAP: Record<string, keyof VacanciesFilters> = {
    "Тип занятости": "employment",
    "График работы": "schedule",
    "Опыт работы": "work_experience",
};


const JobsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filtersFromServer, setFiltersFromServer] = useState<VacancyFilter[]>([]);
    const [activeFilters, setActiveFilters] = useState<Record<string, number | null>>({});
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

    useEffect(() => {
        const fetchVacancies = async () => {
            setLoading(true);

            try {
                const params: VacanciesFilters = {
                    page,
                    per_page: PER_PAGE
                };

                Object.entries(activeFilters).forEach(([key, value]) => {
                    if (value != null) (params as any)[key] = value; // != проверяет null и undefined
                });

                const res = await VacanciesService.getVacancies(params);
                const list = res.results || [];

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


    const toggleExpand = (index: number) => {
        setExpandedIndex((prev) => (prev === index ? null : index));
    };

    const handleFilterSelect = (filterType: string, valueId: number | null) => {
        setActiveFilters((prev) => {
            const newFilters = { ...prev };

            // Если выбрали "Все" (id === null) — сбрасываем фильтр
            if (valueId === null) {
                newFilters[filterType] = null;
            } else {
                // Иначе выставляем конкретный ID и снимаем "Все"
                newFilters[filterType] = valueId;
            }

            console.log("🔎 Активные фильтры (по id):", newFilters);
            return newFilters;
        });
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
        <div className="min-h-screen bg-[#F7F7FB]">
            <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6">
                <header className="space-y-1">
                    <h1 className="text-3xl font-bold leading-tight text-[#1B1B29]">
                        Вакансии
                    </h1>
                </header>

                {/* Search + Filters */}
                <div className="space-y-3">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        iconBefore={<Search className="w-5 h-5 text-[#9D9DB4]" />}
                        mode="secondary"
                        className="rounded-[20px] border border-[#E3E6F0] bg-white/80 text-sm
                            placeholder:text-[#9D9DB4]"
                        placeholder="Поиск вакансий..."
                    />

                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex w-full items-center justify-center gap-2 rounded-[20px]
                            border border-[#D9DCEB] bg-white px-4 py-3 text-sm font-semibold
                            text-[#1B1B29] shadow-sm"
                    >
                        <Filter className="w-5 h-5 text-[#6F6F7B]" />
                        Фильтры
                    </button>

                    {showFilters && (
                        <div className="rounded-2xl border border-[#ECECF5] bg-white p-3 shadow-sm">
                            <FiltersPanel
                                filters={filtersFromServer}
                                activeFilters={activeFilters}
                                onSelect={handleFilterSelect}
                                onReset={() => {
                                    setActiveFilters({});
                                    setPage(1); // сбрасываем пагинацию
                                }}
                            />

                        </div>
                    )}
                </div>

                {/* Jobs */}
                {filteredJobs.length === 0 && !loading ? (
                    <div className="rounded-[20px] border border-dashed border-[#D8DAE8] bg-white
                        px-6 py-12 text-center text-sm text-[#6F6F7B]">
                        <Briefcase className="mx-auto mb-4 h-12 w-12 text-[#C4C6D6]" />
                        Вакансии по текущим фильтрам не найдены
                    </div>
                ) : (
                    <div className="space-y-4 pb-8">
                        {filteredJobs.map((job, index) => (
                            <JobsCard
                                key={job.id ?? index}
                                job={job}
                                expanded={expandedIndex === index}
                                onToggle={() => toggleExpand(index)}
                                ref={index === filteredJobs.length - 1 ? lastJobRef : null}
                            />
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="pb-8 text-center text-sm text-[#6F6F7B]">
                        Загружаем вакансии...
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobsPage;
