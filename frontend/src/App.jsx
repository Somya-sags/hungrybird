import { useState } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Admin from './pages/Admin'
import AdminMenu from './pages/AdminMenu'
import OtpVerify from './pages/OtpVerify'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { Routes,Route } from 'react-router-dom'
import AdminRoute from './components/AdminRoutes'
import CurrentMonthOrders from './pages/CurrentMonthOrders'
import AdminMonthlyOrders from './pages/AdminMonthlyOrders'
import './App.css'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/admin' element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
        } />
        <Route path='/admin/menu' element={
          <AdminRoute>
            <AdminMenu />
          </AdminRoute>
          }/>
        <Route path='/otpverify' element={<OtpVerify/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/monthly-orders" element={<CurrentMonthOrders />} />
        <Route path="/admin/month-orders" element={
          <AdminRoute>
            <AdminMonthlyOrders />
          </AdminRoute>
        } />
      </Routes>
    </>
  )
}

export default App
