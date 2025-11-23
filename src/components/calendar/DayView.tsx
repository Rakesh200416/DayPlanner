import { format, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
  description?: string;
}

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (hour: number) => void;
}

export const DayView = ({ currentDate, events, onEventClick, onTimeSlotClick }: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start_time);
      return isSameDay(eventStart, currentDate) && eventStart.getHours() === hour;
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="min-w-[800px]">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div
              key={hour}
              className="flex border-b border-calendar-grid"
              style={{ height: "80px" }}
            >
              <div className="w-20 flex-shrink-0 border-r border-calendar-grid px-2 py-1 text-xs text-muted-foreground">
                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
              </div>
              <div
                className="relative flex-1 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onTimeSlotClick(hour)}
              >
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="absolute left-0 right-0 m-2 rounded p-2 text-sm font-medium text-white cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: event.color,
                      height: "calc(100% - 16px)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {format(new Date(event.start_time), "h:mm a")} -{" "}
                      {format(new Date(event.end_time), "h:mm a")}
                    </div>
                    {event.description && (
                      <div className="mt-1 text-xs opacity-75 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
