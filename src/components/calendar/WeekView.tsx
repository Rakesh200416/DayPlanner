import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
  description?: string;
}

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

export const WeekView = ({ currentDate, events, onEventClick, onTimeSlotClick }: WeekViewProps) => {
  const startDate = startOfWeek(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start_time);
      return isSameDay(eventStart, day) && eventStart.getHours() === hour;
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="sticky top-0 z-10 grid grid-cols-[60px_repeat(7,1fr)] border-b border-calendar-grid bg-background">
        <div className="border-r border-calendar-grid" />
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "border-r border-calendar-grid py-2 text-center",
              isToday(day) && "bg-calendar-today"
            )}
          >
            <div className="text-xs font-medium text-muted-foreground">
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-2xl font-semibold",
                isToday(day) && "text-primary"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      <div className="relative">
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-calendar-grid"
            style={{ height: "60px" }}
          >
            <div className="border-r border-calendar-grid px-2 py-1 text-xs text-muted-foreground">
              {format(new Date().setHours(hour, 0, 0, 0), "h a")}
            </div>
            {days.map((day) => {
              const dayEvents = getEventsForDayAndHour(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className="relative border-r border-calendar-grid cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onTimeSlotClick(day, hour)}
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 m-0.5 rounded p-1 text-xs font-medium text-white cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                      style={{
                        backgroundColor: event.color,
                        height: "calc(100% - 4px)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="truncate font-semibold">{event.title}</div>
                      <div className="truncate text-[10px] opacity-90">
                        {format(new Date(event.start_time), "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
