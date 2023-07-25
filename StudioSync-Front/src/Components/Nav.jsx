import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Nav() {

    const [isActive, setIsActive] = useState('Dashboard')
    const location = useLocation()

    useEffect(() => {
        setIsActive(location.pathname)
    }, [location.pathname])

    return (
        <div className="nav">
            <div className="pages">
                <Link to="/dashboard" className={`nav-item ${isActive === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/calendar" className={`nav-item ${isActive === '/calendar' ? 'active' : ''}`}>Calendar</Link>
                <Link to="/prospects" className={`nav-item ${isActive === '/prospects' ? 'active' : ''}`}>Prospects</Link>
            </div>
            <div className="options">
                <Link to="/settings" className={`nav-item ${isActive === '/settings' ? 'active' : ''}`}>Settings</Link>
                <Link to="/login" className="nav-item">Log Out</Link>
            </div>
        </div>
    )
}