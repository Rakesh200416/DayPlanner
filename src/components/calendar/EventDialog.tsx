import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface Event {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  color: string;
  reminder_minutes: number;
  recurrence_pattern: string;
}

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, "id">) => void;
  onDelete?: (id: string) => void;
  event?: Event;
  initialDate?: Date;
  initialHour?: number;
}

const eventColors = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#ef4444", label: "Red" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Orange" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
];

export const EventDialog = ({
  open,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
  initialHour,
}: EventDialogProps) => {
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    color: "#3b82f6",
    reminder_minutes: 10,
    recurrence_pattern: "none",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location || "",
        color: event.color,
        reminder_minutes: event.reminder_minutes,
        recurrence_pattern: event.recurrence_pattern,
      });
    } else if (initialDate) {
      const startDate = new Date(initialDate);
      if (initialHour !== undefined) {
        startDate.setHours(initialHour, 0, 0, 0);
      }
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);

      setFormData({
        title: "",
        description: "",
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        location: "",
        color: "#3b82f6",
        reminder_minutes: 10,
        recurrence_pattern: "none",
      });
    }
  }, [event, initialDate, initialHour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formatDateTimeLocal(formData.start_time)}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: new Date(e.target.value).toISOString() })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formatDateTimeLocal(formData.end_time)}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: new Date(e.target.value).toISOString() })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Event location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger id="color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder</Label>
              <Select
                value={formData.reminder_minutes.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, reminder_minutes: parseInt(value) })
                }
              >
                <SelectTrigger id="reminder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                  <SelectItem value="43200">1 month before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence">Repeat</Label>
            <Select
              value={formData.recurrence_pattern}
              onValueChange={(value) => setFormData({ ...formData, recurrence_pattern: value })}
            >
              <SelectTrigger id="recurrence">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(event.id!);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
