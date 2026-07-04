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

const JobsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filtersFromServer, setFiltersFromServer] = useState<VacancyFilter[]>([]);
    const [activeFilters, setActiveFilters] = useState<Record<string, number | null>>({});
    const [showFilters, setShowFilters] = useState(false);

    const [jobs, setJobs] = useState<Vacancy[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastJobRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [loading, hasMore]
    );

    // ✅ Загружаем фильтры
    useEffect(() => {
        (async () => {
            try {
                const res = await VacanciesService.fetchFilters();
                if (res?.filters) setFiltersFromServer(res.filters);
            } catch {
                setFiltersFromServer([]);
            }
        })();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
            setPage(1);
            setExpandedIndex(null);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        const fetchVacancies = async () => {
            setLoading(true);
            setError("");

            try {
                const params: VacanciesFilters = { page, per_page: PER_PAGE, search: debouncedSearch };

                Object.entries(activeFilters).forEach(([key, value]) => {
                    if (value != null) params[key] = value;
                });

                const res = await VacanciesService.getVacancies(params);
                const list = res.results || [];

                setJobs((prev) => (page === 1 ? list : [...prev, ...list]));
                setHasMore(list.length === PER_PAGE);
            } catch {
                setError("Не удалось загрузить вакансии");
                if (page === 1) setJobs([]);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
    }, [page, activeFilters, debouncedSearch]);

    const toggleExpand = (index: number) => {
        setExpandedIndex((prev) => (prev === index ? null : index));
    };

    const handleFilterSelect = (filterType: string, valueId: number | null) => {
        setActiveFilters((prev) => {
            const newFilters = { ...prev };

            if (valueId === null) {
                newFilters[filterType] = null;
            } else {
                newFilters[filterType] = valueId;
            }

            return newFilters;
        });
        setPage(1); // сбрасываем пагинацию при изменении фильтров
    };

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
                        className="flex w-full items-center justify-center gap-2 rounded-2xl
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
                                    setPage(1);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Jobs */}
                {error && !loading ? (
                    <div className="rounded-[20px] border border-dashed border-red-200 bg-white
                        px-6 py-12 text-center text-sm text-red-600">
                        <Briefcase className="mx-auto mb-4 h-12 w-12 text-red-300" />
                        {error}
                    </div>
                ) : jobs.length === 0 && !loading ? (
                    <div className="rounded-[20px] border border-dashed border-[#D8DAE8] bg-white
                        px-6 py-12 text-center text-sm text-[#6F6F7B]">
                        <Briefcase className="mx-auto mb-4 h-12 w-12 text-[#C4C6D6]" />
                        Вакансии по текущим фильтрам не найдены
                    </div>
                ) : (
                    <div className="space-y-4 pb-8">
                        {jobs.map((job, index) => (
                            <JobsCard
                                key={job.id ?? index}
                                job={job}
                                expanded={expandedIndex === index}
                                onToggle={() => toggleExpand(index)}
                                ref={index === jobs.length - 1 ? lastJobRef : null}
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
