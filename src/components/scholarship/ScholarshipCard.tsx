import { forwardRef, useState } from "react";
import type { Scholarship } from "../api/service/ScholarshipService.ts";
import { Button } from "@maxhub/max-ui";

const formatText = (text?: string) =>
    text
        ?.split(/[\r\n]+/) // разбиваем по переносам строки
        .map((p) => p.trim())
        .filter(Boolean)
        .join("\n")
        .trim() ?? "";

type ScholarshipCardProps = {
    scholarship: Scholarship;
    expanded: boolean;
    onToggle: () => void;
};

const ScholarshipCard = forwardRef<HTMLDivElement, ScholarshipCardProps>(
    ({ scholarship, expanded, onToggle }, ref) => {
        const details = formatText(scholarship.description);
        const canExpand = Boolean(details);

        return (
            <article
                ref={ref}
                className="mx-auto w-full rounded-[15px] border border-[#ECECF5]
                    bg-white p-5 shadow-[0_18px_40px_rgba(10,18,61,0.04)] transition-shadow
                    hover:shadow-[0_20px_45px_rgba(10,18,61,0.08)]"
            >
                <div className="flex flex-col gap-2 text-sm text-[#6F6F7B]">
                    <h3 className="text-base font-semibold text-[#1B1B29] leading-tight">
                        {scholarship.title}
                    </h3>

                    <p className="text-sm">
                        Получатель:{" "}
                        <span className="text-[#1B1B29] font-medium">{scholarship.recipient}</span>
                    </p>

                    <p className="text-sm text-[#6F6F7B]">
                        Сумма: {scholarship.amount}{" "}
                        {scholarship.amount_depends_university ? "(зависит от университета)" : ""}
                    </p>
                </div>

                <div className="my-4 h-px w-full bg-[#1B1B29]/20" />

                <div className="flex flex-col gap-3">
                    {canExpand && expanded && (
                        <p className="text-sm leading-relaxed text-[#6F6F7B] whitespace-pre-line">
                            {details}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        {scholarship.link && expanded && (
                            <Button
                                size="medium"
                                onClick={() => window.open(scholarship.link, "_blank", "noopener,noreferrer")}
                            >
                                Перейти к стипендии
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

export default ScholarshipCard;
