import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  onNavigate: (direction: "prev" | "next" | "today") => void;
  onCreateEvent: () => void;
}

export const CalendarHeader = ({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onCreateEvent,
}: CalendarHeaderProps) => {
  const formatTitle = () => {
    if (view === "day") {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    } else if (view === "week") {
      return format(currentDate, "MMMM yyyy");
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Day Planner</h1>
        </div>
        <Button onClick={() => onNavigate("today")} variant="outline" size="sm">
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => onNavigate("prev")}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onNavigate("next")}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-medium">{formatTitle()}</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-border">
          <Button
            onClick={() => onViewChange("day")}
            variant={view === "day" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-r-none"
          >
            Day
          </Button>
          <Button
            onClick={() => onViewChange("week")}
            variant={view === "week" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none border-x border-border"
          >
            Week
          </Button>
          <Button
            onClick={() => onViewChange("month")}
            variant={view === "month" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-l-none"
          >
            Month
          </Button>
        </div>
        <Button onClick={onCreateEvent} className="ml-2">
          Create Event
        </Button>
      </div>
    </header>
  );
};
