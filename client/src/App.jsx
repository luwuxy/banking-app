import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router";
import axios from 'axios';
import './App.css'
import AdminDashboard from './AdminDashboard.jsx'
import CreateCustomer from './CreateCustomer.jsx';
import CustomerDashboard from './CustomerDashboard.jsx';
import Login from './Login.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/admin",
    element: <AdminDashboard />
  },
  {
    path: "/admin/create",
    element: <CreateCustomer />
  },
  {
    path: "/customer",
    element: <CustomerDashboard />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
