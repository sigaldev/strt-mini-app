import { Button } from "@maxhub/max-ui";
import type { VacancyFilter } from "../api/service/VacanciesService.ts";

interface FiltersPanelProps {
    filters: VacancyFilter[];
    activeFilters: Record<string, number | null>;
    onSelect: (filterType: string, valueId: number | null) => void;
    onReset: () => void; // 👈 добавим обработчик сброса
}

export const FiltersPanel = ({ filters, activeFilters, onSelect, onReset }: FiltersPanelProps) => {
    return (
        <div className="flex flex-col gap-4 mt-2">
            {filters.map((filter) => (
                <div key={filter.type} className="flex flex-col gap-2">
                    <span className="text-md font-semibold text-[#1B1B29]">
                        {filter.title}
                    </span>

                    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth">
                        <div className="flex gap-2 min-w-max">
                            {filter.values.map((val) => {
                                const isActive = activeFilters[filter.type] === val.id;

                                return (
                                    <Button
                                        key={`${filter.type}-${val.id}`}
                                        appearance={isActive ? "themed" : "neutral"}
                                        onClick={() => onSelect(filter.type, val.id)}
                                        className="whitespace-nowrap rounded-full px-4 py-1 text-sm"
                                    >
                                        {val.value}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}

            {/* 👇 Добавляем кнопку сброса внизу */}
            <div className="flex justify-start mt-2">
                <Button
                    mode="link"
                    onClick={onReset}
                >
                    Сбросить фильтры
                </Button>
            </div>
        </div>
    );
};
