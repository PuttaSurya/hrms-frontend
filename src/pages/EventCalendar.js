import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiRequestService } from '../services/api-request.service.ts';

const EventCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await ApiRequestService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleDateClick = (arg) => {
    const clickedDate = arg.date;
    const existingEvent = events.find(event => 
      new Date(event.start).toDateString() === clickedDate.toDateString()
    );

    if (existingEvent) {
      setCurrentEvent(existingEvent);
      setEventTitle(existingEvent.title);
      setEventDescription(existingEvent.description || '');
      setSelectedDate({
        start: new Date(existingEvent.start),
        end: new Date(existingEvent.end)
      });
    } else {
      setCurrentEvent(null);
      setEventTitle('');
      setEventDescription('');
      setSelectedDate({
        start: clickedDate,
        end: new Date(clickedDate.getTime() + 60 * 60 * 1000) 
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
    setEventTitle('');
    setEventDescription('');
  };

  const handleSaveOrUpdateEvent = async () => {
    if (!eventTitle.trim()) {
      alert('Please enter an event title');
      return;
    }

    const eventData = {
      title: eventTitle,
      start: selectedDate.start.toISOString(),
      end: selectedDate.end.toISOString(),
      description: eventDescription,
      display: 'block'  // This will make the event appear as a block
    };

    try {
      let updatedEvent;
      if (currentEvent) {
        updatedEvent = await ApiRequestService.updateEvent({ ...eventData, id: currentEvent._id });
        setEvents(events.map(event => event._id === updatedEvent._id ? updatedEvent : event));
      } else {
        updatedEvent = await ApiRequestService.createEvent(eventData);
        setEvents([...events, updatedEvent]);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save/update event:', error);
      alert('Failed to save/update event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    if (currentEvent && currentEvent._id) {
      try {
        await ApiRequestService.deleteEvent(currentEvent._id);
        setEvents(events.filter(event => event._id !== currentEvent._id));
        closeModal();
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const formatDateForInput = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().slice(0, 16);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'today prev,next'
        }}
        titleFormat={{ year: 'numeric', month: 'long' }}
        height="100%"
        dayMaxEvents={true}
        nowIndicator={true}
        dateClick={handleDateClick}
        events={events}
        eventDisplay="block"  
      />

      {modalOpen && selectedDate && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentEvent ? 'Edit Leave' : 'Apply for New Leave'}</h2>
              <span className="close" onClick={closeModal}>&times;</span>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="title">Leave Type:</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required 
              />

              <label htmlFor="start">Start:</label>
              <input 
                type="datetime-local" 
                id="start" 
                name="start" 
                value={formatDateForInput(selectedDate.start)} 
                onChange={(e) => setSelectedDate({...selectedDate, start: new Date(e.target.value)})}
                required 
              />

              <label htmlFor="end">End:</label>
              <input 
                type="datetime-local" 
                id="end" 
                name="end" 
                value={formatDateForInput(selectedDate.end)}
                onChange={(e) => setSelectedDate({...selectedDate, end: new Date(e.target.value)})}
                required 
              />

              <label htmlFor="description">Description:</label>
              <textarea 
                id="description" 
                name="description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              ></textarea>
            </form>
            <div className="modal-footer">
              <button type="button" className="btn-save" onClick={handleSaveOrUpdateEvent}>
                {currentEvent ? 'Update' : 'Save'}
              </button>
              {currentEvent && (
                <button type="button" className="btn-delete" onClick={handleDeleteEvent}>Delete</button>
              )}
              <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCalendar;