import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ItineraryList from './pages/ItineraryList.jsx'
import ItineraryDetail from './pages/ItineraryDetail.jsx'
import NewItinerary from './pages/NewItinerary.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import useBarba from './hooks/useBarba.js'


export default function App(){
const location = useLocation()
useBarba(location.pathname)
return (
<div id="barba-wrapper" data-barba="wrapper">
<NavBar />
<main className="container mt-6" data-barba="container" data-barba-namespace={location.pathname}>
<Routes location={location} key={location.pathname}>
<Route index element={<Landing/>} />
<Route path="/login" element={<Login/>} />
<Route path="/signup" element={<Signup/>} />
<Route element={<ProtectedRoute/>}>
<Route path="/dashboard" element={<Dashboard/>} />
<Route path="/itineraries" element={<ItineraryList/>} />
<Route path="/itineraries/new" element={<NewItinerary/>} />
<Route path="/itineraries/:id" element={<ItineraryDetail/>} />
<Route path="/profile" element={<Profile/>} />
</Route>
<Route path="*" element={<Landing/>} />
</Routes>
</main>
</div>
)
}