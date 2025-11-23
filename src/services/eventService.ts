const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import authService from './authService';

export interface Event {
  id?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  color: string;
  reminderMinutes: number;
  recurrencePattern: string;
  recurrenceEndDate?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

class EventService {
  // Get all events for user
  async getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: authService.getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }

    return data;
  }

  // Get event by ID
  async getEventById(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: authService.getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event');
    }

    return data;
  }

  // Create event
  async createEvent(eventData: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(eventData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create event');
    }

    return data;
  }

  // Update event
  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(eventData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update event');
    }

    return data;
  }

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete event');
    }
  }
}

export default new EventService();