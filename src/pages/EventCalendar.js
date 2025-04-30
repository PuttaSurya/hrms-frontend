import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiRequestService } from '../services/api-request.service.ts';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventLeaveType, setEventLeaveType] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [managers, setManagers] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEventEditable, setIsEventEditable] = useState(false);
  const [isHolidayModal, setIsHolidayModal] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [backendError, setBackendError] = useState('');
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  



  const leaveTypes = [
    "Annual Leave", "Volunteering Leave", "Paternity Leave", "Sabbatical Leave",
    "Relocation Leave", "Family Care Leave", "Compassionate Leave", "Marriage Leave", "Work From Home"
  ];

  useEffect(() => {
    fetchEvents();
    fetchHolidays();
    fetchManagers();
  }, []);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await ApiRequestService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const fetchedHolidays = await ApiRequestService.getAllHolidays();
      setHolidays(fetchedHolidays);
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await ApiRequestService.getManagers();
      setManagers(response.managers || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
    }
  };

  const fetchLeaveBalances = async (leaveType) => {
    try {
      const userId = localStorage.getItem('userId'); 
      const balance = await ApiRequestService.getUserLeaveBalances(userId, leaveType);
      setLeaveBalances(prevBalances => ({...prevBalances, [leaveType]: balance}));
    } catch (error) {
      console.error('Failed to fetch leave balances:', error);
    }
  };

 const handleDateClick = (arg) => {
  const clickedDate = arg.date;
  clickedDate.setHours(0, 0, 0, 0);

  // Check if the clicked date is a holiday
  const clickedHoliday = holidays.find(holiday => {
    const holidayDate = new Date(holiday.date);
    holidayDate.setHours(0, 0, 0, 0);
    return holidayDate.getTime() === clickedDate.getTime();
  });

  if (clickedHoliday) {
    setSelectedHoliday(clickedHoliday);
    setIsHolidayModalOpen(true);
    
  } else {
    const existingEvent = events.find(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999); 
      
      return clickedDate >= eventStart && clickedDate <= eventEnd;
    });

    setIsHolidayModal(false);

    if (existingEvent) {
      setCurrentEvent(existingEvent);
      setEventLeaveType(existingEvent.LeaveType);
      setEventDescription(existingEvent.description || '');
      setSelectedDate({ 
        start: new Date(existingEvent.start),
        end: new Date(existingEvent.end)
      });
      fetchLeaveBalances(existingEvent.LeaveType);
    } else {
      // No existing event -> New leave
      setCurrentEvent(null);
      setEventLeaveType('');
      setEventDescription('');
      setSelectedDate({ start: clickedDate, end: clickedDate });
      setIsEventEditable(true);
    }

    setErrors({});
    setModalOpen(true);
  }
};

  

  const closeModal = () => {
    setModalOpen(false);
    setErrors({});
    setBackendError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventLeaveType) newErrors.eventLeaveType = 'Please select a Leave Type';
    if (!selectedDate?.start) newErrors.startDate = 'Please select Start Date';
    if (!selectedDate?.end) newErrors.endDate = 'Please select End Date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrUpdateEvent = async () => {
    if (!validateForm()) return;

    const eventData = {
      LeaveType: eventLeaveType,
      start: formatDateForInput(selectedDate.start),
      end: formatDateForInput(selectedDate.end),      
      description: eventDescription,
      display: 'block',
    };

    try {
      if (currentEvent) {
        await ApiRequestService.updateEvent({ ...eventData, id: currentEvent._id });
      } else {
        await ApiRequestService.createEvent(eventData);
      }
      closeModal();
      await fetchEvents();
      setBackendError('');
    } catch (error) {
      console.error('Failed to save/update event:', error);
      setBackendError(error.response?.data?.message || 'An error occurred while saving the event');
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
      }
    }
  };

  const renderLegend = () => {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          width: '12px', 
          height: '12px', 
          backgroundColor: '#ffebee',  
          marginRight: '8px' 
        }}></div>
        <span style={{ fontSize: '1.1em' }}>Current Date</span>  
      </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'blue', marginRight: '10px' }}></div>
          <span style={{ fontSize: '1.1em' }}>Pending</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'green', marginRight: '8px' }}></div>
          <span style={{ fontSize: '1.1em' }}>Approved</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'lightgreen', marginRight: '8px' }}></div>
          <span style={{ fontSize: '1.1em' }}>Holiday</span>
        </div>
      </div>
    );
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
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
        dayHeaderClassNames={(arg) => {
          const day = arg.date.getDay();
          return day === 0 || day === 6 ? 'is-weekend' : '';
        }}
        dayHeaderContent={(arg) => arg.text}
      
        events={[
          ...events.map(event => ({
            ...event,
            title: event.LeaveType,
            start: event.start,
            end: new Date(new Date(event.end).setDate(new Date(event.end).getDate() + 1)),
            allDay: true,
            backgroundColor: event.status === 'approved' ? '#28a745' : '#007bff',
            borderColor: event.status === 'approved' ? '#28a745' : '#007bff'
          })),
          ...holidays.map(holiday => ({
            title: holiday.name,
            start: holiday.date,
            end: holiday.date, 
            allDay: true,
            backgroundColor: '#90ee90', 
            borderColor: '#90ee90',
            textColor: '#000', 
          }))
        ]}
        displayEventTime={false}
      />
      {renderLegend()}

      <Modal show={modalOpen} onHide={closeModal} centered size="md">
  <Modal.Header closeButton>
  <Modal.Title>
  {isHolidayModal ? 'Holiday Details' : currentEvent ? 'Edit Leave' : 'Apply for New Leave'}
</Modal.Title>

  </Modal.Header>
  
  <Modal.Body style={{ backgroundColor: '#ffffff' }}>
    <Form>
      <Row className="g-3">
         <Col md={6}>
    <Form.Group>
      <Form.Label>Leave Type</Form.Label>
      <Form.Select
        value={eventLeaveType}
        onChange={(e) => {
          const leaveType = e.target.value;
          setEventLeaveType(leaveType);
          fetchLeaveBalances(leaveType);
        }}
        disabled={currentEvent?.status === 'approved'}
      >
        <option value="">Select Leave Type</option>
        {leaveTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </Form.Select>
      {errors.eventLeaveType && <div className="text-danger">{errors.eventLeaveType}</div>}
    </Form.Group>
  </Col>

 {/* Leave Balance Field */}
<Col md={6}>
  <Form.Group style={{ textAlign: 'center' }}>
    <Form.Label>Available Leaves</Form.Label>
    <div
      style={{
        fontSize: '1rem',
        fontWeight: 'bold',
        color: currentEvent?.status === 'approved' ? 'rgba(0, 0, 0, 0.3)' : 'rgb(0, 178, 15)',
        marginTop: '6px',
      }}
    >
      {leaveBalances[eventLeaveType]?.availableLeave ?? 0}
    </div>
  </Form.Group>
</Col>

  {/* Start Date Field */}
  <Col md={6}>
    <Form.Group>
      <Form.Label>Start Date</Form.Label>
      <Form.Control
        type="date"
        value={formatDateForInput(selectedDate?.start)}
        onChange={(e) => setSelectedDate({ ...selectedDate, start: new Date(e.target.value) })}
        disabled={currentEvent?.status === 'approved'}
      />
      {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
    </Form.Group>
  </Col>

  {/* End Date Field */}
  <Col md={6}>
    <Form.Group>
      <Form.Label>End Date</Form.Label>
      <Form.Control
        type="date"
        value={formatDateForInput(selectedDate?.end)}
        onChange={(e) => setSelectedDate({ ...selectedDate, end: new Date(e.target.value) })}
        disabled={currentEvent?.status === 'approved'}
      />
      {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
    </Form.Group>
  </Col>

  {/* Description Field */}
  <Col md={12}>
    <Form.Group>
      <Form.Label>Description</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        placeholder="Enter description (optional)"
        disabled={currentEvent?.status === 'approved'}
      />
    </Form.Group>
  </Col>

  {/* Backend Error Message */}
{backendError && (
  <Col md={12}>
    <div className="text-danger mt-3">{backendError}</div>
  </Col>
)}
      </Row>
    </Form>
  </Modal.Body>

  {!isHolidayModal && (
    <Modal.Footer style={{ backgroundColor: '#ffffff' }}>
      <Button variant="secondary" onClick={closeModal}>Cancel</Button>

      {currentEvent && (
        <Button
          variant="danger"
          onClick={handleDeleteEvent}
          disabled={currentEvent?.status === 'approved'}
        >
          Delete
        </Button>
      )}

      <Button
        variant="primary"
        onClick={handleSaveOrUpdateEvent}
        disabled={currentEvent?.status === 'approved'}
      >
        {currentEvent ? 'Update' : 'Save'}
      </Button>
    </Modal.Footer>
  )}
</Modal>

    </>
  );
};

export default EventCalendar;
