import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../App'
import HamburgerMenu from './HamburgerMenu'
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
        setShowMenu(!showMenu);
      };

    const regularMenuItems = (
    <ul className="navbar-items">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
        {/* Add more menu items as needed */}
    </ul>
    );

    const handleLogOut = () => {
        setIsLoggingOut(true)
        setIsLoggedIn(false)
        setCurrentUser(null)
        setUserProspects([])
        setAllProspects([])
        sessionStorage.removeItem("currentUser")
        sessionStorage.setItem("isLoggedIn", "false")
        setTimeout(() => {
            navigate('/login')
        }, 2000)
    }

    return (
        <div className="nav">
            <button class="hamburger">
                <div class="bar"></div>
            </button>
            {showMenu ? <HamburgerMenu /> : (
                <>
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
                </>
            )}
        </div>
    )
}