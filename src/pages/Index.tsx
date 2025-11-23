import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addMonths, addWeeks, addDays, startOfMonth, startOfWeek, startOfDay } from "date-fns";
import { LogOut } from "lucide-react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { EventDialog } from "@/components/calendar/EventDialog";
import { MiniCalendar } from "@/components/calendar/MiniCalendar";
import authService from "@/services/authService";
import eventService, { Event } from "@/services/eventService";

// Define the Event interface that matches the components' expectations
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  color: string;
  reminder_minutes: number;
  recurrence_pattern: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate("/auth");
    } else {
      // Get user profile
      authService.getProfile()
        .then(userData => {
          setUser(userData);
          fetchEvents();
        })
        .catch(() => {
          navigate("/auth");
        });
    }

    // No need for auth state change listener with JWT
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const eventsData = await eventService.getEvents();
      // Convert Event to CalendarEvent
      const calendarEvents: CalendarEvent[] = eventsData.map(event => ({
        id: event.id || '',
        title: event.title,
        description: event.description,
        start_time: event.startTime,
        end_time: event.endTime,
        location: event.location,
        color: event.color,
        reminder_minutes: event.reminderMinutes,
        recurrence_pattern: event.recurrencePattern
      }));
      setEvents(calendarEvents);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    authService.logout();
    navigate("/auth");
  };

  const handleNavigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(new Date());
    } else if (direction === "prev") {
      if (view === "month") {
        setCurrentDate(addMonths(currentDate, -1));
      } else if (view === "week") {
        setCurrentDate(addWeeks(currentDate, -1));
      } else {
        setCurrentDate(addDays(currentDate, -1));
      }
    } else {
      if (view === "month") {
        setCurrentDate(addMonths(currentDate, 1));
      } else if (view === "week") {
        setCurrentDate(addWeeks(currentDate, 1));
      } else {
        setCurrentDate(addDays(currentDate, 1));
      }
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setSelectedDate(undefined);
    setSelectedHour(undefined);
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setSelectedHour(undefined);
    setIsEventDialogOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedHour(undefined);
    setSelectedEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setSelectedDate(date);
    setSelectedHour(hour);
    setSelectedEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, "id">) => {
    try {
      // Convert CalendarEvent to Event
      const serviceEventData = {
        title: eventData.title,
        description: eventData.description,
        startTime: eventData.start_time,
        endTime: eventData.end_time,
        location: eventData.location,
        color: eventData.color,
        reminderMinutes: eventData.reminder_minutes,
        recurrencePattern: eventData.recurrence_pattern
      };

      if (selectedEvent && selectedEvent.id) {
        const updatedEvent = await eventService.updateEvent(selectedEvent.id, serviceEventData);
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        fetchEvents(); // Refresh events
      } else {
        const newEvent = await eventService.createEvent(serviceEventData);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        fetchEvents(); // Refresh events
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      fetchEvents(); // Refresh events
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
        onCreateEvent={handleCreateEvent}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border bg-background p-4 space-y-4">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
          <MiniCalendar
            selectedDate={currentDate}
            onDateSelect={(date) => {
              setCurrentDate(date);
              setView("day");
            }}
          />
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">My Calendars</h3>
            <div className="text-sm text-muted-foreground">
              {events.length} {events.length === 1 ? "event" : "events"}
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-hidden">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onTimeSlotClick={handleTimeSlotClick}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onTimeSlotClick={(hour) => handleTimeSlotClick(currentDate, hour)}
            />
          )}
        </main>
      </div>
      <EventDialog
        open={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        initialDate={selectedDate}
        initialHour={selectedHour}
      />
    </div>
  );
};

export default Index;