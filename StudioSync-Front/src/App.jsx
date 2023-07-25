import './App.css'
import React, { useEffect, useState, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import Dashboard from './Components/Dashboard'
import Prospects from './Components/Prospects'
import Settings from './Components/Settings'
import Calendar from './Components/Calendar'
import axios from 'axios'

export const UserContext = React.createContext(null)
export const BASE_URL = `https://studiosync-backend-production.up.railway.app/api/`

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const navigate = useNavigate()

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser
      }}
    >
    <div className='App'>
      <Routes>
        <Route exact path="/login" element={<Login />}/>
        <Route exact path="/signup" element={<SignUp />}/>
        <Route exact path="/dashboard" element={<Dashboard />}/>
        <Route exact path="/calendar" element={<Calendar />}/>
        <Route exact path="/prospects" element={<Prospects />}/>
        <Route exact path="/settings" element={<Settings />}/>
        <Route
            path="/*"
            element={<h1>404: Page Not Found</h1>}
        />
      </Routes>
    </div>
    </UserContext.Provider>
  )
}

export default App
