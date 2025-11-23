const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events for user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id })
      .sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      startTime, 
      endTime, 
      location, 
      color, 
      reminderMinutes, 
      recurrencePattern,
      recurrenceEndDate
    } = req.body;
    
    const event = new Event({
      title,
      description,
      startTime,
      endTime,
      location,
      color,
      reminderMinutes,
      recurrencePattern,
      recurrenceEndDate,
      userId: req.user._id
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      startTime, 
      endTime, 
      location, 
      color, 
      reminderMinutes, 
      recurrencePattern,
      recurrenceEndDate
    } = req.body;
    
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        title,
        description,
        startTime,
        endTime,
        location,
        color,
        reminderMinutes,
        recurrencePattern,
        recurrenceEndDate
      },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;