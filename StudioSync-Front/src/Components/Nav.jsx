import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../App'
import ReactLoading from 'react-loading'

export default function Nav() {
    const { users, setUsers, isLoggedIn, setIsLoggedIn, setCurrentUser, setUserProspects, setAllProspects } = useContext(UserContext)

    const [isActive, setIsActive] = useState('Dashboard')
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const location = useLocation()
    const [showMenu, setShowMenu] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setIsActive(location.pathname)
    }, [location.pathname])

    const toggleMenu = () => {
        showMenu ? setShowMenu(false) : setShowMenu(true)
    }

    const handleLogOut = () => {
        setIsLoggingOut(true)
        setIsLoggedIn(false)
        setCurrentUser(null)
        setUserProspects([])
        setAllProspects([])
        sessionStorage.removeItem("currentUser")
        sessionStorage.setItem("isLoggedIn", "false")
        setTimeout(() => {
            setShowMenu(false)
            navigate('/login')
        }, 2000)
    }

    return (
        <div className="nav-bar">
            <div className="hamburger-nav">
                <button className={`hamburger ${showMenu ? 'is-active' : ''}`} onClick={toggleMenu}>
                    <div className="bar"></div>
                </button>
            </div>
            <div class={`menu-container ${showMenu ? 'is-active' : ''}`}>
                <Link to="/dashboard" className={`nav-menu-item ${isActive === '/dashboard' ? 'menu-active' : ''}`} onClick={toggleMenu}>Dashboard</Link>
                <Link to="/calendar" className={`nav-menu-item ${isActive === '/calendar' ? 'menu-active' : ''}`} onClick={toggleMenu}>Calendar</Link>
                <Link to="/prospects" className={`nav-menu-item ${isActive === '/prospects' ? 'menu-active' : ''}`} onClick={toggleMenu}>Prospects</Link>
                <Link to="/settings" className={`nav-menu-item ${isActive === '/settings' ? 'menu-active' : ''}`} onClick={toggleMenu}>Settings</Link>
                {isLoggingOut ? (
                                <ReactLoading type="bars" color="#0400D9" height={50} width={50} />
                            ) : (
                                <button to="/login" className="nav-menu-item log-out-menu" onClick={() => handleLogOut()}>Log Out</button>
                            )}
            </div>
                <div className="nav">
                    <div className="pages">
                        <Link to="/dashboard" className={`nav-item ${isActive === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
                        <Link to="/calendar" className={`nav-item ${isActive === '/calendar' ? 'active' : ''}`}>Calendar</Link>
                        <Link to="/prospects" className={`nav-item ${isActive === '/prospects' ? 'active' : ''}`}>Prospects</Link>
                    </div>
                    <div className="options">
                        <Link to="/settings" className={`nav-item ${isActive === '/settings' ? 'active' : ''}`}>Settings</Link>
                        {isLoggingOut ? (
                            <ReactLoading type="bars" color="#0400D9" height={50} width={50} />
                        ) : (
                            <button to="/login" className="nav-item log-out" onClick={() => handleLogOut()}>Log Out</button>
                        )}
                    </div>
                </div>   
        </div>
    )
}