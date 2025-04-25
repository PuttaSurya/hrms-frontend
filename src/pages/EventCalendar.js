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
  const [eventLeaveType, setEventLeaveType] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const leaveTypes = [
    "Annual Leave",
    "Volunteering Leave",
    "Paternity Leave",
    "Sabbatical Leave",
    "Relocation Leave",
    "Family Care Leave",
    "Compassionate Leave",
    "Marriage Leave"
  ];

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await ApiRequestService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const formatEvents = (events) => {
    return events.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      end.setDate(end.getDate() + 1); // Add one day to include the end date
      return {
        ...event,
        title: event.LeaveType,
        start: start,
        end: end,
        allDay: true,
      };
    });
  };

  const handleDateClick = (arg) => {
    const clickedDate = arg.date;
    const existingEvent = events.find(event => 
      new Date(event.start).toDateString() === clickedDate.toDateString()
    );
  
    if (existingEvent) {
      setCurrentEvent(existingEvent);
      setEventLeaveType(existingEvent.LeaveType);
      setEventDescription(existingEvent.description || '');
      setSelectedDate({
        start: new Date(existingEvent.start),
        end: new Date(existingEvent.end)
      });
    } else {
      const endDate = new Date(clickedDate);
      endDate.setDate(endDate.getDate()); 
      setCurrentEvent(null);
      setEventLeaveType('');
      setEventDescription('');
      setSelectedDate({
        start: clickedDate,
        end: endDate
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
    setEventLeaveType('');
    setEventDescription('');
  };

  const handleSaveOrUpdateEvent = async () => {
    if (!eventLeaveType.trim()) {
      alert('Please select a leave type');
      return;
    }
    const eventData = {
      LeaveType: eventLeaveType,
      start: selectedDate.start.toISOString(),
      end: selectedDate.end.toISOString(),
      description: eventDescription,
      display: 'block'
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
      await fetchEvents();
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
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
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
        events={formatEvents(events)}
        eventContent={renderEventContent}
        eventDisplay="block"
        displayEventTime={false}
      />

      {modalOpen && selectedDate && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentEvent ? 'Edit Leave' : 'Apply for New Leave'}</h2>
              <span className="close" onClick={closeModal}>&times;</span>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="leaveType">Leave Type:</label>
              <select 
                id="leaveType" 
                name="leaveType" 
                value={eventLeaveType}
                onChange={(e) => setEventLeaveType(e.target.value)}
                required 
                className="form-control"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>

              <label htmlFor="start">Start:</label>
              <input 
                type="date" 
                id="start" 
                name="start" 
                value={formatDateForInput(selectedDate.start)} 
                onChange={(e) => setSelectedDate({...selectedDate, start: new Date(e.target.value)})}
                required 
              />

              <label htmlFor="end">End:</label>
              <input 
                type="date" 
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

const renderEventContent = (eventInfo) => {
  return (
    <>
      <b>{eventInfo.event.title}</b>
    </>
  );
};

export default EventCalendar;