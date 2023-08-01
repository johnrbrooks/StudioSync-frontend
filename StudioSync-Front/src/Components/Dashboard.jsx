import Nav from './Nav'
import { useState, useEffect, useContext } from 'react'
import { UserContext, BASE_URL } from '../App'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default function Dashboard() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, userProspects, setUserProspects, allProspects, setAllProspects } = useContext(UserContext)

    const [closedProspects, setClosedProspects] = useState([])
    const [openProspects, setOpenProspects] = useState([])
    const [sortType, setSortType] = useState('ABC')
    const [sortDirection, setSortDirection] = useState('ascending')

    const navigate = useNavigate()

    //Get the current user's prospect list
    useEffect(() => {
        const getProspects = async() => {
            const response = await axios.get(`${BASE_URL}/prospects/get/userprospects/${currentUser._id}`)
            setUserProspects(response.data)
        }
        getProspects()
    }, [currentUser])

    //Get the details of the current user's prospects
    useEffect(() => {
        const fetchProspectDetails = async () => {
            if (userProspects.length === 0) return

            try {
                const prospectDetails = await Promise.all(userProspects.map((prospectId) => axios.get(`${BASE_URL}/prospects/get/${prospectId}`)))
                const prospectData = prospectDetails.map((response) => response.data)
                setAllProspects(prospectData)
                const openProspects = prospectData.filter((prospect) => prospect.stage !== 'Closed')
                const closedProspects = prospectData.filter((prospect) => prospect.stage === 'Closed')
                setOpenProspects(openProspects)
                setClosedProspects(closedProspects)
            } catch (error) {
                console.error('Error fetching prospect details:', error)
            }
        }
        fetchProspectDetails()
      }, [userProspects, currentUser])

    //Toggle the sort direction of the sort buttons
    const handleSort = (newSortType) => {
        if (newSortType === sortType) {
            setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending')
        } else {
            setSortType(newSortType)
            setSortDirection('ascending')
        }
    }

    //Sort open prospects list based on switch case parameters
    const sortedProspects = openProspects.slice().sort((a, b) => {
        if(openProspects.length < 2) {
            return openProspects
        }
        switch (sortType) {
            case 'ABC':
                return sortDirection === 'ascending' ? a.contact_name.localeCompare(b.contact_name) : b.contact_name.localeCompare(a.contact_name)
            case 'Stage':
                return sortDirection === 'ascending' ? a.stage.localeCompare(b.stage) : b.stage.localeCompare(a.stage)
            case 'Probability':
                return sortDirection === 'ascending' ? a.probability - b.probability : b.probability - a.probability
            case 'Value':
                return sortDirection === 'ascending' ? a.projected_value - b.projected_value : b.projected_value - a.projected_value
            case 'FollowUp':
                const dateA = new Date(a.next_follow_up)
                const dateB = new Date(b.next_follow_up)
                return sortDirection === 'ascending' ? dateA - dateB : dateB - dateA
            default:
                return 0;
        }
    });

    //Sort function for closed prospects
    const sortedClosedProspects = closedProspects.slice().sort((a, b) => {
        if(closedProspects.length < 2) {
            return closedProspects
        }
        switch (sortType) {
            case 'ABC':
                return sortDirection === 'ascending' ? a.contact_name.localeCompare(b.contact_name) : b.contact_name.localeCompare(a.contact_name)
            case 'Value':
                return sortDirection === 'ascending' ? a.projected_value - b.projected_value : b.projected_value - a.projected_value
            case 'FollowUp':
                const dateA = new Date(a.next_follow_up)
                const dateB = new Date(b.next_follow_up)
                return sortDirection === 'ascending' ? dateA - dateB : dateB - dateA            
            default:
                return 0;
        }
    });

    const handleSelection = (prospect) => {
        navigate(`/prospects/${prospect._id}`)
    }

    return (
        <div>
            <h1 className='page-title'>Dashboard</h1>
            <Nav />
            <div className="dashboard-page">
                <div className="utilities-bar">
                    <div className="sort-by">
                        <h4 className='sort-label'>Sort By:</h4>
                    </div>
                    <div className="sort-buttons">
                        <p className='sort-button' onClick={() => handleSort('ABC')}>ABC</p>
                        <p className='sort-button' onClick={() => handleSort('Stage')}>Stage</p>
                        <p className='sort-button' onClick={() => handleSort('Probability')}>Probability</p>
                        <p className='sort-button' onClick={() => handleSort('Value')}>Value</p>
                        <p className='sort-button' onClick={() => handleSort('FollowUp')}>Follow-Up</p>
                    </div>
                </div>
                <div className="prospect-headers">
                    <div className="prospect-name">
                        <h2>Pipeline</h2>
                    </div>
                    <div className='prospect-quick-details-headers'>
                        <p className='quick-email-header'>Email</p>
                        <p className='quick-stage-header'>Stage</p>
                        <p className='quick-probability-header'>Probability</p>
                        <p className='quick-value-header'>Est. Value</p>
                        <p className='quick-created-header'>Follow-Up</p>
                    </div>
                </div>
                {sortedProspects === undefined ? (
                    <div className="prospect-item">
                        <div className="prospect-name">
                            <h2>Loading...</h2>
                        </div>
                    </div>
                ) : sortedProspects.length > 0 ? (
                        sortedProspects.map((prospect) => (
                        <div className={`prospect-item ${prospect.probability === 0 ? 'item-prospect' : prospect.probability === 30 ? 'item-unlikely' : prospect.probability === 50 ? 'item-possible' : prospect.probability === 90 ? 'item-likely' : prospect.probability === 100 ? 'item-closed' : ''}`} key={prospect._id} onClick={() => handleSelection(prospect)}>
                            <div className="prospect-name">
                                <h3>{prospect.contact_name}</h3>
                            </div>
                            <div className='prospect-quick-details'>
                                <p className='quick-email'>
                                    {prospect?.email.slice(0, 15)}
                                    {prospect?.email.length > 15 && '...'}
                                </p>
                                <p className={`quick-stage ${prospect.stage === 'Unqualified' ? 'unqualified' : prospect.stage === 'Qualified' ? 'qualified' : prospect.stage === 'Proposal' ? 'proposal' : prospect.stage === 'Negotiation' ? 'negotiation' : prospect.stage === 'Closed' ? 'won' : ''}`}>
                                    {prospect.stage}</p>
                                <p className={`quick-probability ${prospect.probability === 0 ? 'prospect' : prospect.probability === 30 ? 'unlikely' : prospect.probability === 50 ? 'possible' : prospect.probability === 90 ? 'likely' : prospect.probability === 100 ? 'won' : ''}`}>{prospect.probability}%</p>
                                <p className='quick-value'>{prospect.projected_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                <p className='quick-created'>{moment(prospect.next_follow_up, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).calendar(null, {
                                    sameDay: '[Today]',
                                    nextDay: '[Tomorrow]',
                                    nextWeek: 'dddd',
                                    lastDay: '[Yesterday]',
                                    lastWeek: '[Last] dddd',
                                    sameElse: 'MM/DD/YYYY',
                                })}</p>
                            </div>
                        </div>)
                        )
                    ) : (
                        <div className="prospect-item">
                            <div className="prospect-name">
                                <h2>No prospects found.</h2>
                            </div>
                        </div>
                    )}
            </div>
            <div className="closed-page">
                <div className="utilities-bar">
                    <div className="sort-by">
                        <h4 className='sort-label'>Sort By:</h4>
                    </div>
                    <div className="sort-buttons">
                        <p className='sort-button' onClick={() => handleSort('ABC')}>ABC</p>
                        <p className='sort-button' onClick={() => handleSort('Value')}>Value</p>
                        <p className='sort-button' onClick={() => handleSort('FollowUp')}>Follow-Up</p>
                    </div>
                </div>
                <div className="prospect-headers">
                    <div className="prospect-name">
                        <h2>Closed</h2>
                    </div>
                    <div className='prospect-quick-details-headers'>
                        <p className='quick-email-header'>Email</p>
                        <p className='quick-stage-header'>Stage</p>
                        <p className='quick-probability-header'>Probability</p>
                        <p className='quick-value-header'>Est. Value</p>
                        <p className='quick-created-header'>Follow-Up</p>
                    </div>
                </div>
                {sortedClosedProspects === undefined ? (
                        <div className="prospect-item">
                            <div className="prospect-name">
                                <h2>Loading...</h2>
                            </div>
                        </div>
                    ) : sortedClosedProspects.length > 0 ? (
                        sortedClosedProspects.map((prospect) => (
                        <div className={`prospect-item ${prospect.probability === 0 ? 'item-prospect' : prospect.probability === 30 ? 'item-unlikely' : prospect.probability === 50 ? 'item-possible' : prospect.probability === 90 ? 'item-likely' : prospect.probability === 100 ? 'item-closed' : ''}`} key={prospect.id} onClick={() => handleSelection(prospect)}>
                            <div className="prospect-name">
                                <h3>{prospect.contact_name}</h3>
                            </div>
                            <div className='prospect-quick-details'>
                                <p className='quick-email'>
                                    {prospect?.email.slice(0, 15)}
                                    {prospect?.email.length > 15 && '...'}
                                </p>
                                <p className={`quick-stage ${prospect.stage === 'Unqualified' ? 'unqualified' : prospect.stage === 'Qualified' ? 'qualified' : prospect.stage === 'Proposal' ? 'proposal' : prospect.stage === 'Negotiation' ? 'negotiation' : prospect.stage === 'Closed' ? 'won' : ''}`}>
                                    {prospect.stage}</p>
                                <p className={`quick-probability ${prospect.probability === 0 ? 'prospect' : prospect.probability === 30 ? 'unlikely' : prospect.probability === 50 ? 'possible' : prospect.probability === 90 ? 'likely' : prospect.probability === 100 ? 'won' : ''}`}>{prospect.probability}%</p>
                                <p className='quick-value'>{prospect.projected_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                <p className='quick-created'>{moment(prospect.next_follow_up, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).calendar(null, {
                                    sameDay: '[Today]',
                                    nextDay: '[Tomorrow]',
                                    nextWeek: 'dddd',
                                    lastDay: '[Yesterday]',
                                    lastWeek: '[Last] dddd',
                                    sameElse: 'MM/DD/YYYY',
                                })}</p>
                            </div>
                        </div>)
                        )
                    ) : (
                        <div className="prospect-item">
                            <div className="prospect-name">
                                <h2>No prospects found.</h2>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}