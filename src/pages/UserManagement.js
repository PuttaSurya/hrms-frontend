import React, { useState, useEffect } from 'react';
import { ApiRequestService } from '../services/api-request.service.ts';
import { toast } from 'react-toastify';
import { Edit, Trash2, Plus } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Table, Card, Row, Col } from 'react-bootstrap';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    fullName: '',
    mobile: '',
    password: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await ApiRequestService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const searchUsers = async () => {
    try {
      const payload = {
        search: searchQuery,
        page: currentPage,
        limit: limit
      };
      const searchResults = await ApiRequestService.searchUsers(payload);
      setUsers(searchResults.data || []); 
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      setUsers([]); 
    }
  };



  const handleShowModal = (user = null) => {
    if (user) {
      setCurrentUser({
        _id: user._id,
        fullName: user.fullName,
        mobile: user.mobile,
        role: user.role,
      });
      setIsEditing(true);
    } else {
      setCurrentUser({ fullName: '', mobile: '', password: '', role: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser({ fullName: '', mobile: '', password: '', role: '' });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const validateForm = () => {
    const { fullName, mobile, password, role } = currentUser;
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }
    if (!mobile.match(/^\d{10}$/)) {
      toast.error('Mobile number must be 10 digits');
      return false;
    }
    if (!isEditing && (!password || password.length < 6)) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (!role) {
      toast.error('Role is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await ApiRequestService.updateUser(currentUser);
        toast.success('User updated successfully');
      } else {
        await ApiRequestService.createUser(currentUser);
        toast.success('User created successfully');
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await ApiRequestService.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user. Please try again.');
    }
  };


  return (
    <div className="container-fluid py-4">
      <Card className="custom-card-shadow">
        <Card.Body>
          <div className="row mb-4">
            <div className="col-sm-6">
              <h4 className="card-title mb-0">Users</h4>
            </div>
            <div className="col-sm-6">
              <div className="d-flex justify-content-end align-items-center gap-3">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onInput={searchUsers}
                  placeholder="Search user..."
                  className="form-control search-box"
                />
                <Button variant="primary" onClick={() => handleShowModal()}>
                 Add User
                </Button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="table-centered">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.mobile}</td>
                    <td>{user.role}</td>
                    <td className="text-center">
                      <Button variant="warning" className="btn-icon me-2" size="sm" onClick={() => handleShowModal(user)} title="Update User">
                        <Edit size={16} />
                      </Button>
                      <Button variant="danger" className="btn-icon" size="sm" onClick={() => handleDeleteUser(user._id)} title="Delete User">
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="text-center" colSpan="5">No Records found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered size="md">
  <Modal.Header closeButton>
    <Modal.Title>{isEditing ? 'Edit User' : 'Add User'}</Modal.Title>
  </Modal.Header>

  <Form onSubmit={handleSubmit}>
    <Modal.Body>
      <Form.Group className="mb-3">
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={currentUser.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
          </Col>
          <Col md={6}>
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={currentUser.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
              required
            />
          </Col>

          {!isEditing && (
            <Col md={6}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={currentUser.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </Col>
          )}

          <Col md={6}>
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={currentUser.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button variant="primary" type="submit">
        {isEditing ? 'Update' : 'Create'}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>


    </div>
  );
};

export default UserManagement;
