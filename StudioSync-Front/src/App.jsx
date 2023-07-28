import './App.css'
import React, { useEffect, useState, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import Dashboard from './Components/Dashboard'
import Prospects from './Components/Prospects'
import Settings from './Components/Settings'
import Calendar from './Components/Calendar'
import ProspectItem from './Components/ProspectItem'
import NewProspect from './Components/NewProspect'
import axios from 'axios'

export const UserContext = React.createContext(null)
export const BASE_URL = `https://studiosync-backend-production.up.railway.app/api/`

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState(null)
  const [userProspects, setUserProspects] = useState([])
  const [allProspects, setAllProspects] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        let response = await axios.get(`${BASE_URL}/users/get/all`)
        setUsers(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    checkAuthentication()
    getAllUsers()
  }, [])

  const checkAuthentication = () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      // Fetch the currentUser from sessionStorage and set it in the state
      const storedUser = sessionStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  // Clear session storage and reset states
  const handleClearSessionStorage = () => {
    sessionStorage.clear()
    setIsLoggedIn(false)
    setCurrentUser(null)
    checkAuthentication()
  }

  // Fetch the current user from the server based on the stored email
  const getUser = async () => {
    try {
      let username = sessionStorage.getItem("currentUser")
      const response = await axios.get(`${BASE_URL}users/get/username/${username}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <UserContext.Provider
      value={{
        users,
        userProspects,
        setUserProspects,
        allProspects,
        setAllProspects,
        setUsers,
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
        <Route exact path="/prospects/:id" element={<ProspectItem />}/>
        <Route exact path="/prospects/newprospect" element={<NewProspect />}/>
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
