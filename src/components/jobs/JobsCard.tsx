import { forwardRef } from "react";
import type { Vacancy } from "../api/service/VacanciesService.ts";

const formatText = (text?: string) =>
    text
        ?.split(";")
        .map((p) => p.trim())
        .filter(Boolean)
        .join("\n")
        .trim() ?? "";

const formatSalary = (salaryFrom?: number, salaryTo?: number) => {
    if (!salaryFrom && !salaryTo) return "";
    const formatter = new Intl.NumberFormat("ru-RU");
    if (salaryFrom && salaryTo && salaryFrom !== salaryTo) {
        return `${formatter.format(salaryFrom)} – ${formatter.format(salaryTo)} ₽`;
    }
    const value = salaryFrom ?? salaryTo;
    return value ? `${formatter.format(value)} ₽` : "";
};

const buildDetails = (job: Vacancy) =>
    [
        formatText(job.requirements),
        formatText(job.responsibilities),
        formatText(job.work_conditions),
        formatText(job.additional_info)
    ]
        .filter(Boolean)
        .join("\n\n");

type JobsCardProps = {
    job: Vacancy;
    expanded: boolean;
    onToggle: () => void;
};

const JobsCard = forwardRef<HTMLDivElement, JobsCardProps>(
    ({ job, expanded, onToggle }, ref) => {
        const experience =
            job.work_experience?.trim() && job.work_experience !== "—"
                ? job.work_experience
                : "не требуется";

        const employmentLine = [job.employment, job.schedule]
            .filter(Boolean)
            .join(", ");

        const salary = formatSalary(job.salary_from, job.salary_to);
        const details = buildDetails(job);
        const canExpand = Boolean(details);

        return (
            <article
                ref={ref}
                className="mx-auto w-full max-w-[343px] rounded-[15px] border border-[#ECECF5]
                    bg-white p-5 shadow-[0_18px_40px_rgba(10,18,61,0.04)] transition-shadow
                    hover:shadow-[0_20px_45px_rgba(10,18,61,0.08)]"
            >
                <div className="flex flex-col gap-2 text-sm text-[#6F6F7B]">
                    <h3 className="text-base font-semibold text-[#1B1B29] leading-tight">
                        {job.name}
                    </h3>

                    <p className="text-sm">
                        Опыт работы:{" "}
                        <span className="text-[#1B1B29] font-medium">{experience}</span>
                    </p>

                    {employmentLine && (
                        <p className="text-sm text-[#6F6F7B]">{employmentLine}</p>
                    )}

                    {salary && (
                        <p className="text-lg font-semibold text-[#1B1B29]">{salary}</p>
                    )}
                </div>

                <div className="my-4 h-px w-full bg-[#1B1B29]/20" />

                <div className="flex flex-col gap-3">
                    {canExpand && expanded && (
                        <p className="text-sm leading-relaxed text-[#6F6F7B] whitespace-pre-line">
                            {details}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        {job.site && expanded && (
                            <a
                                href={job.site}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-transparent bg-[#7848FF]
                                    px-4 py-1.5 text-xs font-semibold text-white transition
                                    hover:bg-[#6a3de4]"
                            >
                                Перейти к вакансии
                            </a>
                        )}

                        {canExpand && (
                            <button
                                type="button"
                                onClick={onToggle}
                                className="text-sm font-semibold text-[#7848FF] hover:underline"
                            >
                                {expanded ? "Скрыть" : "Подробнее..."}
                            </button>
                        )}
                    </div>
                </div>
            </article>
        );
    }
);

export default JobsCard;
