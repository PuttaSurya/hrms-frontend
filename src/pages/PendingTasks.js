import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { ApiRequestService } from '../services/api-request.service.ts';
import { toast } from 'react-toastify';

const PendingTasks = () => {
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetchEmployeeLeaves();
  }, []);

  const fetchEmployeeLeaves = async () => {
    try {
      const response = await ApiRequestService.getManagerEmployeeLeaves();
      setEmployeeLeaves(response);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching employee leaves:', error);
      setDataLoaded(true); 
    }
  };

  const handleLeaveAction = async (leaveId, action) => {
    try {
      await ApiRequestService.managerLeaveAction({ leaveId, action });
      toast.success(`Leave ${action}ed successfully`);
      
      // Update the local state to reflect the change
      setEmployeeLeaves(prevLeaves => 
        prevLeaves.map(leave => 
          leave._id === leaveId 
            ? { ...leave, status: action === 'approve' ? 'approved' : 'rejected' }
            : leave
        )
      );
    } catch (error) {
      toast.error(`Failed to ${action} leave`);
    }
  };

  if (!dataLoaded) {
    return <div>Loading...</div>;
  }

  if (employeeLeaves.length === 0) {
    return (
      <Container>
        <h1 className="my-4">Pending Leave Requests</h1>
        <p>No data found</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="my-4">Pending Leave Requests</h1>
      <Row>
        {employeeLeaves.map((leave) => (
          <Col md={12} key={leave._id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{leave.userId.fullName}</h5>
                  <p className="mb-1"><strong>Leave Type:</strong> {leave.LeaveType}</p>
                  <p className="mb-1">
                    <strong>Date:</strong>{' '}
                    {new Date(leave.start).toLocaleDateString()} - {new Date(leave.end).toLocaleDateString()}
                    </p>
                  <p className="mb-1"><strong>Description:</strong> {leave.description}</p>
                  <p className='mb-1'><strong>Status:</strong> {leave.status}</p>
                </div>
                {leave.status === 'pending' && (
                  <div>
                    <Button 
                      variant="outline-success" 
                      className="me-2" 
                      onClick={() => handleLeaveAction(leave._id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => handleLeaveAction(leave._id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {leave.status !== 'pending' && (
                  <div>
                    <span className={`badge bg-${leave.status === 'approved' ? 'success' : 'danger'}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PendingTasks;