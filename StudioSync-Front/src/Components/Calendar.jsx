import Nav from './Nav'
import { useState, useEffect, useContext } from 'react'
import { UserContext, BASE_URL } from '../App'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export default function Calendar() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, userProspects, setUserProspects, allProspects, setAllProspects } = useContext(UserContext)

    const navigate = useNavigate()

    //ChatGPT constructed function to populate days of week with date using Moment.js
    const getNextWeekDates = () => {
        const dates = [];
        const today = moment();
        let currentDay = today.clone().startOf('week').add(1, 'day');
        for (let i = 0; i < 7; i++) {
          dates.push(currentDay.format('LL'));
          currentDay.add(1, 'day');
        }
        return dates;
      };
   
    const daysOfWeek = getNextWeekDates();
    const todayFormatted = moment().format('LL');

    const formattedAllProspects = allProspects.map((prospect) => ({
        ...prospect,
        next_follow_up: moment(prospect.next_follow_up).format('LL'),
    }));

    const filterProspectsByDate = (date) => {
        return formattedAllProspects.filter((prospect) => prospect.next_follow_up === date);
    };

    const handleSelection = (prospect) => {
        navigate(`/prospects/${prospect._id}`)
    }

    return (
        <div>
            <h1 className='page-title'>Calendar</h1>
            <Nav />
            <div className="dashboard-page">
                <div className="prospect-headers page-header">
                    <div className="prospect-name">
                        <h2>Calendar</h2>
                    </div>
                </div>
                {<h1 className='current-date'>Today: {moment().format('dddd, MMMM Do, YYYY')}</h1>}
                <h2 className='follow-up-title'>Follow Ups this week:</h2>
                <div className="calendar-days-container">
                    <div className="days-grid">
                        {daysOfWeek.map((date, index) => (
                            <div className={`day ${date === todayFormatted ? 'today' : ''}`} key={index}>
                                <div className="day-title">
                                    <h2 className="date">{date}</h2>
                                    <hr />
                                    <h2>{moment().day(index + 1).format('dddd')}</h2>
                                </div>
                                {filterProspectsByDate(date).map((prospect) => (
                                    <div className="day-items">
                                        <div key={prospect.id} onClick={() => handleSelection(prospect)}>
                                            <p>{prospect.contact_name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}         
                    </div>
                </div>
            </div>
        </div>
    )
}