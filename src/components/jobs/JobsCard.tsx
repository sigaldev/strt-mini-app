import { forwardRef } from "react";
import type { Vacancy } from "../api/service/VacanciesService.ts";
import { Button } from "@maxhub/max-ui";

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

const getContactButton = (job: Vacancy) => {
    if (job.site) return { label: "Откликнуться", url: job.site };
    if (job.vk) return { label: "Откликнуться", url: job.vk };
    if (job.instagram) return { label: "Откликнуться", url: job.instagram };
    if (job.telegram) return { label: "Откликнуться", url: job.telegram };
    if (job.whatsapp) return { label: "Откликнуться", url: job.whatsapp };
    if (job.email) return { label: "Откликнуться", url: `mailto:${job.email}` };
    if (job.phone) return { label: "Откликнуться", url: `tel:${job.phone}` };
    return null;
};

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

        const contact = getContactButton(job);

        return (
            <article
                ref={ref}
                className="mx-auto w-full rounded-[15px] border border-[#ECECF5]
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
                        {contact && expanded && (
                            <Button
                                size="medium"
                                onClick={() => window.open(contact.url, "_blank", "noopener,noreferrer")}
                            >
                                {contact.label}
                            </Button>
                        )}

                        {canExpand && (
                            <button
                                type="button"
                                onClick={onToggle}
                                className="text-sm font-semibold text-[#007AFF] hover:underline"
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
