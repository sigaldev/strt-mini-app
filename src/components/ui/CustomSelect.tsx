import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
    value: number | string;
    label: string;
}

interface CustomSelectProps {
    placeholder?: string;
    options: Option[];
    value: Option | null;
    onChange: (option: Option) => void;
    searchable?: boolean;
    onSearch?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       placeholder = "Выберите значение",
                                                       options,
                                                       value,
                                                       onChange,
                                                       onSearch,
                                                       searchable = true,
                                                   }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full flex justify-between items-center px-4 py-3 bg-[#f5f5f5] text-gray-900 rounded-2xl shadow-sm hover:bg-gray-200 transition-all"
            >
                <span className={!value ? "text-[#878788] font-light" : ""}>
                    {value?.label || placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-2 shadow-lg max-h-64 overflow-auto z-20">
                    {searchable && (
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                onSearch?.(e.target.value)
                            }}
                            className="w-full px-3 py-2 border-b border-gray-200 text-gray-900 outline-none"
                        />
                    )}

                    <div>
                        {filtered.length ? (
                            filtered.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt);
                                        setQuery("");
                                        setOpen(false);
                                    }}
                                    className="px-4 py-2 text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-400 text-sm text-center">Ничего не найдено</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;