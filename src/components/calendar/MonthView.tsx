import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
}

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date) => void;
}

export const MonthView = ({ currentDate, events, onEventClick, onDateClick }: MonthViewProps) => {
  const monthStart = startOfMonth(currentDate);
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
      const dayEvents = events.filter((event) =>
        isSameDay(new Date(event.start_time), day)
      );

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "min-h-[120px] border-r border-b border-calendar-grid p-2 cursor-pointer transition-colors hover:bg-accent",
            !isSameMonth(day, monthStart) && "bg-muted text-muted-foreground",
            isToday(day) && "bg-calendar-today"
          )}
          onClick={() => onDateClick(cloneDay)}
        >
          <span
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
              isToday(day) && "bg-primary text-primary-foreground font-semibold"
            )}
          >
            {formattedDate}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="truncate rounded px-1.5 py-0.5 text-xs font-medium text-white cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: event.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {format(new Date(event.start_time), "h:mm a")} {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-muted-foreground px-1.5">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex-1 bg-background">
      <div className="grid grid-cols-7 border-b border-calendar-grid">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="border-r border-calendar-grid py-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="border-t border-calendar-grid">{rows}</div>
    </div>
  );
};
