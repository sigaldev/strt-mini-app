import { forwardRef } from "react";
import { Briefcase, ChevronDown, ChevronRight, DollarSign } from "lucide-react";
import { Button } from "@maxhub/max-ui";

const formatText = (text?: string) =>
    text
        ?.split(";")
        .map((p) => p.trim())
        .filter(Boolean)
        .join(";\n") ?? "";

const JobsCard = forwardRef<HTMLDivElement, any>(
    ({ job, expanded, onToggle }, ref) => {
        return (
            <div
                ref={ref}
                className="bg-[#f5f5f5] rounded-2xl border border-gray-200 p-6
                    hover:shadow-lg transition-all"
            >
                <h3 className="text-lg font-semibold mb-1">{job.name}</h3>
                <p className="text-gray-600 mb-3">{job.company_name || ""}</p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    {job.work_conditions && (
                        <span className="whitespace-pre-line">
                            {formatText(job.work_conditions)}
                        </span>
                    )}

                    {job.salary_from && (
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary_from} – {job.salary_to} ₽
                        </div>
                    )}

                    {job.employment && (
                        <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.employment}
                        </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">
                    {expanded
                        ? [
                            formatText(job.requirements),
                            formatText(job.responsibilities),
                            formatText(job.additional_info)
                        ]
                            .filter(Boolean)
                            .join("\n\n")
                        : formatText(job.requirements)
                            .split("\n")
                            .slice(0, 3)
                            .join("\n")}
                </p>

                <div className="flex gap-2">
                    {!expanded ? (
                        <Button
                            appearance="themed"
                            mode="primary"
                            size="large"
                            className="w-full"
                            iconBefore={<ChevronDown className="w-4 h-4" />}
                            onClick={onToggle}
                        >
                            Подробнее
                        </Button>
                    ) : (
                        <a
                            href={job.site || "#"}
                            target="_blank"
                            className="w-full"
                            rel="noreferrer"
                        >
                            <Button
                                appearance="themed"
                                mode="primary"
                                size="large"
                                className="w-full"
                                iconAfter={<ChevronRight className="w-4 h-4" />}
                            >
                                Перейти
                            </Button>
                        </a>
                    )}
                </div>
            </div>
        );
    }
);

export default JobsCard;
