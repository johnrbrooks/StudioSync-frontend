import Nav from './Nav'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_URL, UserContext } from '../App'
import axios from 'axios'
import moment from 'moment'


export default function ProspectItem() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const [prospect, setProspect] = useState()
    const key = useParams()

    useEffect(() => {
        const getProspect = async() => {
            const response = await axios.get(`${BASE_URL}/prospects/get/${key.id}`)
            setProspect(response.data)
        }
        getProspect()
    }, [])


    return prospect ? (
        <div>
            <h1 className='page-title'>Prospect Settings</h1>
            <Nav />
            <div className="prospect-settings-page">
                <h2 className="prospect-settings-title">Prospect Information</h2>
                <div className="prospect-settings-container">
                    <div className="prospect-settings-form">
                        <div className="prospect-settings-headers">
                            <h2 className="prospect-settings-header">Customer Information</h2>
                        </div>
                        <div className="data-grid">
                            <h3 className="data-title">Name:</h3>
                            <p className="data-value">{prospect.contact_name}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Email:</h3>
                            <p className="data-value">{prospect.email}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Phone:</h3>
                            <p className="data-value">{prospect.phone}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Stage:</h3>
                            <p className="data-value">{prospect.stage}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Probability</h3>
                            <p className="data-value">{prospect.probability}%</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Projected Value:</h3>
                            <p className="data-value">${prospect.projected_value}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Interested Services:</h3>
                            <p className="data-value">{prospect.interested_services.join(', ')}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Next Follow-Up</h3>
                            <p className="data-value">{prospect.next_follow_up}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                            <h3 className="data-title">Notes:</h3>
                            <p className="data-value">{prospect.notes}</p>
                            <div className="edit-button-container">
                                <button className="update-value">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}