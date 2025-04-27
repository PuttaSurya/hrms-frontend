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
  const [roleType, setRoleType] = useState('');
  const [managerId, setManagerId] = useState('');
  const [managers, setManagers] = useState([]);

  const [errors, setErrors] = useState({});

  const leaveTypes = [
    "Annual Leave", "Volunteering Leave", "Paternity Leave", "Sabbatical Leave",
    "Relocation Leave", "Family Care Leave", "Compassionate Leave", "Marriage Leave",  "Work From Home"
  ];

  useEffect(() => {
    fetchEvents();
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

  const fetchManagers = async () => {
    try {
      const response = await ApiRequestService.getManagers();
      setManagers(response.managers || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
    }
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
      setRoleType(existingEvent.roleType || '');
      setManagerId(existingEvent.managerId || '');
    } else {
      setCurrentEvent(null);
      setEventLeaveType('');
      setEventDescription('');
      setSelectedDate({ start: clickedDate, end: clickedDate });
      setRoleType('');
      setManagerId('');
    }
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventLeaveType) newErrors.eventLeaveType = 'Please select a Leave Type';
    if (!selectedDate?.start) newErrors.startDate = 'Please select Start Date';
    if (!selectedDate?.end) newErrors.endDate = 'Please select End Date';
    if (!roleType) newErrors.roleType = 'Please select a Role Type';
    if (roleType === 'employee' && !managerId) newErrors.managerId = 'Please select a Manager';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrUpdateEvent = async () => {
    if (!validateForm()) return;

    const eventData = {
      LeaveType: eventLeaveType,
      start: selectedDate.start.toISOString(),
      end: selectedDate.end.toISOString(),
      description: eventDescription,
      display: 'block',
      roleType: roleType,
      managerId: managerId
    };

    try {
      if (currentEvent) {
        await ApiRequestService.updateEvent({ ...eventData, id: currentEvent._id });
      } else {
        await ApiRequestService.createEvent(eventData);
      }
      closeModal();
      await fetchEvents();
    } catch (error) {
      console.error('Failed to save/update event:', error);
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
        events={events.map(event => ({
          ...event,
          title: event.LeaveType,
          start: event.start,
          end: new Date(new Date(event.end).setDate(new Date(event.end).getDate() + 1)),
          allDay: true,
          backgroundColor: event.status === 'approved' ? '#28a745' : '#007bff',
          borderColor: event.status === 'approved' ? '#28a745' : '#007bff',
        }))}
        displayEventTime={false}
      />

      <Modal show={modalOpen} onHide={closeModal} centered size="md">
      <Modal.Header closeButton>
          <Modal.Title>{currentEvent ? 'Edit Leave' : 'Apply for New Leave'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#ffffff' }}>
  <Form>
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Leave Type</Form.Label>
          <Form.Select
            value={eventLeaveType}
            onChange={(e) => setEventLeaveType(e.target.value)}
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </Form.Select>
          {errors.eventLeaveType && <div className="text-danger">{errors.eventLeaveType}</div>}
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={formatDateForInput(selectedDate?.start)}
            onChange={(e) => setSelectedDate({ ...selectedDate, start: new Date(e.target.value) })}
          />
          {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={formatDateForInput(selectedDate?.end)}
            onChange={(e) => setSelectedDate({ ...selectedDate, end: new Date(e.target.value) })}
          />
          {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Role Type</Form.Label>
          <Form.Select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
          >
            <option value="">Select Role Type</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </Form.Select>
          {errors.roleType && <div className="text-danger">{errors.roleType}</div>}
        </Form.Group>
      </Col>

      {roleType === 'employee' && (
        <Col md={12}>
          <Form.Group>
            <Form.Label>Manager</Form.Label>
            <Form.Select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            >
              <option value="">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.fullName}
                </option>
              ))}
            </Form.Select>
            {errors.managerId && <div className="text-danger">{errors.managerId}</div>}
          </Form.Group>
        </Col>
      )}

      <Col md={12}>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Enter description (optional)"
          />
        </Form.Group>
      </Col>
    </Row>
  </Form>
</Modal.Body>


        <Modal.Footer style={{ backgroundColor: '#ffffff' }}>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          {currentEvent && (
            <Button variant="danger" onClick={handleDeleteEvent}>Delete</Button>
          )}
          <Button variant="primary" onClick={handleSaveOrUpdateEvent}>
            {currentEvent ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventCalendar;
