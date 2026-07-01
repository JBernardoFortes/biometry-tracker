import { useState } from "react";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface CalendarProps {
  value: string;
  onChange: (dateString: string) => void;
  highlightedDates?: string[];
}

export default function Calendar({
  value,
  onChange,
  highlightedDates = [],
}: CalendarProps) {
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<number | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  function goToPreviousMonth() {
    setVisibleMonth(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setVisibleMonth(new Date(year, month + 1, 1));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 w-full max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
        >
          ‹
        </button>

        <span className="text-sm font-semibold text-slate-800">
          {MESES[month]} {year}
        </span>

        <button
          onClick={goToNextMonth}
          className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DIAS_SEMANA.map((dia, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-slate-400"
          >
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;

          const dateKey = toDateKey(new Date(year, month, day));
          const isSelected = dateKey === value;
          const hasData = highlightedDates.includes(dateKey);

          return (
            <button
              key={dateKey}
              onClick={() => onChange(dateKey)}
              className={`relative h-8 w-8 text-xs rounded-md flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {day}
              {hasData && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
