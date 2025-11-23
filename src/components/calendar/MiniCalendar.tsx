import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const MiniCalendar = ({ selectedDate, onDateSelect }: MiniCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const cloneDay = day;

      days.push(
        <button
          key={day.toString()}
          type="button"
          className={cn(
            "h-8 w-8 text-sm rounded-full hover:bg-accent transition-colors",
            !isSameMonth(day, monthStart) && "text-muted-foreground",
            isSameDay(day, selectedDate) && "bg-primary text-primary-foreground font-semibold hover:bg-primary",
            isToday(day) && !isSameDay(day, selectedDate) && "border-2 border-primary"
          )}
          onClick={() => onDateSelect(cloneDay)}
        >
          {formattedDate}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-8 w-8 text-center text-xs font-medium text-muted-foreground flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      <div className="space-y-1">{rows}</div>
    </div>
  );
};
