import { useEffect, useState, useRef, useCallback } from "react";
import { Briefcase } from "lucide-react";
import { ScholarshipService, type Scholarship } from "../components/api/service/ScholarshipService.ts";
import ScholarshipCard from "../components/scholarship/ScholarshipCard.tsx";

const PER_PAGE = 20;



const ScholarshipPage = () => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const toggleExpand = (index: number) => setExpandedIndex(prev => prev === index ? null : index);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastScholarshipRef = useCallback(
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

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                const res = await ScholarshipService.getScholarships(page, PER_PAGE);
                const list = res.scholarship ?? [];
                setScholarships(prev => page === 1 ? list : [...prev, ...list]);
                setHasMore(list.length === PER_PAGE);
            } catch (err) {
                console.error("Ошибка загрузки стипендий:", err);
                setScholarships([]);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [page]);

    return (
        <div className="min-h-screen bg-[#F7F7FB]">
            <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6">
                <header className="space-y-1">
                    <h1 className="text-3xl font-bold leading-tight text-[#1B1B29]">
                        Стипендии
                    </h1>
                </header>

                {scholarships.length === 0 && !loading ? (
                    <div className="rounded-[20px] border border-dashed border-[#D8DAE8] bg-white
                        px-6 py-12 text-center text-sm text-[#6F6F7B]">
                        <Briefcase className="mx-auto mb-4 h-12 w-12 text-[#C4C6D6]" />
                        Стипендии не найдены
                    </div>
                ) : (
                    <div className="space-y-4 pb-8">
                        {scholarships.map((scholarship, index) => (
                            <ScholarshipCard
                                key={scholarship.id}
                                scholarship={scholarship}
                                expanded={expandedIndex === index}
                                onToggle={() => toggleExpand(index)}
                                ref={index === scholarships.length - 1 ? lastScholarshipRef : null}
                            />
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="pb-8 text-center text-sm text-[#6F6F7B]">
                        Загружаем стипендии...
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScholarshipPage;
