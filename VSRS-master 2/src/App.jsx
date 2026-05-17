import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AddVehicle from './pages/AddVehicle';
import BookService from './pages/BookService';
import ServiceHistory from './pages/ServiceHistory';
import ServiceCenterDashboard from './pages/ServiceCenterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ErrorBoundary from './components/Common/ErrorBoundary';

function App() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <AuthProvider>
        <DataProvider>
          <Router>
            <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<Layout />}>
                <Route 
                  path="/customer/dashboard" 
                  element={
                    <ProtectedRoute role="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/add-vehicle" 
                  element={
                    <ProtectedRoute role="customer">
                      <AddVehicle />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/book-service" 
                  element={
                    <ProtectedRoute role="customer">
                      <BookService />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/service-history" 
                  element={
                    <ProtectedRoute role="customer">
                      <ServiceHistory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/service-center/dashboard" 
                  element={
                    <ProtectedRoute role="service-center">
                      <ServiceCenterDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            </ErrorBoundary>
          </Router>
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
