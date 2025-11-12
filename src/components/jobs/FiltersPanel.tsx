import { Button } from "@maxhub/max-ui";
import type {VacancyFilter} from "../api/service/VacanciesService.ts";

interface FiltersPanelProps {
    filters: VacancyFilter[];
    activeFilters: Record<string, string>;
    onSelect: (filterTitle: string, value: string) => void;
}

export const FiltersPanel = ({ filters, activeFilters, onSelect }: FiltersPanelProps) => {
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {filters.map((filter) => (
                <div key={filter.title} className="flex flex-wrap gap-2">
                    {[{ id: -1, value: "all" }, ...filter.values].map((val) => (
                        <Button
                            key={val.id}
                            appearance={
                                activeFilters[filter.title] === val.value ||
                                (val.value === "all" && !activeFilters[filter.title])
                                    ? "themed"
                                    : "neutral"
                            }
                            onClick={() => onSelect(filter.title, val.value)}
                        >
                            {val.value === "all" ? "Все" : val.value}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    );
};
