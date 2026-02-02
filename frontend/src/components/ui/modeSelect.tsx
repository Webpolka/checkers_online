import { useState, useRef, useEffect } from "react";

type ModeSelectProps = {
  value: "pvp" | "ai";
  onChange: (value: "pvp" | "ai") => void;
  className?: string; // новая пропса
};

export const ModeSelect = ({ value, onChange, className }: ModeSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { label: string; value: "pvp" | "ai" }[] = [
    { label: "Игра онлайн", value: "pvp" },
    { label: "Против AI", value: "ai" },
  ];

  const handleSelect = (val: "pvp" | "ai") => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative w-36 text-sm ${className || ""}`}>
      {/* выбранное */}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer bg-white border border-gray-300 rounded-lg px-3 flex justify-between items-center shadow-sm hover:ring-1 hover:ring-indigo-400 transition"
        style={{ height: "100%" }}
      >
        <span>{options.find(o => o.value === value)?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* выпадающий список */}
      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="px-3 py-2 hover:bg-indigo-100 cursor-pointer transition"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
