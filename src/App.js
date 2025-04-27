// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import EventCalendar from './pages/EventCalendar';
import Layout from './layout/Layout';
import Login from './Login/Login';
import Register from './Login/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/UserManagement';
import PendingTasks from './pages/PendingTasks';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/leave-management"
          element={
            <ProtectedRoute>
              <Layout>
                <EventCalendar />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/pending-tasks"
  element={
    <ProtectedRoute>
      <Layout>
        <PendingTasks />
      </Layout>
    </ProtectedRoute>
  }
/>
         <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;