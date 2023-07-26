import Nav from './Nav'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_URL, UserContext } from '../App'
import axios from 'axios'
import moment from 'moment'


export default function NewProspect() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const createProspect = () => {
        e.preventDefault()
        console.log('created')
    }

    return (
        <div>
            <h1 className='page-title'>New Prospect</h1>
            <Nav />
            <div className="prospect-settings-page">
                <h2 className="prospect-settings-title">Prospect Information</h2>
                <div className="prospect-settings-container">
                    <div className="prospect-settings-form">
                        <div className="prospect-settings-headers">
                            <h2 className="prospect-settings-header">Customer Information</h2>
                        </div>
                        <form action="" onSubmit={createProspect}className="information-form">
                            <div className="new-data-grid">
                                <h3 className="data-title">Name:</h3>
                                <input type="text" className='new-data-value' placeholder='John Doe'/>
                                <h3 className="data-title">Email:</h3>
                                <input type="text" className='new-data-value' placeholder='John@johndoe.com'/>
                                <h3 className="data-title">Phone:</h3>
                                <input type="text" className='new-data-value' placeholder='111-111-1111'/>
                                <h3 className="data-title">Stage:</h3>
                                <select name="stage" id="stage" className='option-box'>
                                    <option value="Unqualified">Unqualified</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Proposal">Proposal</option>
                                    <option value="Negotiation">Negotiation</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                <h3 className="data-title">Projected Value:</h3>
                                <input type="text" className='new-data-value' placeholder='500'/>
                                <h3 className="data-title">Interested Services:</h3>
                                <div className="check-boxes-container">
                                    <p className='check-box-title'>Check all that apply:</p>
                                    <div className="check-boxes-grid">
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Pre-Production' value='Pre-Production'/>
                                            <label className='check-box-label'>Pre-Production</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Production' value='Production'/>
                                            <label className='check-box-label'>Production</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Studio Musician' value='Studio Musician'/>
                                            <label className='check-box-label'>Studio Musician</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Recording' value='Recording'/>
                                            <label className='check-box-label'>Recording</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Mixing' value='Mixing'/>
                                            <label className='check-box-label'>Mixing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Mastering' value='Mastering'/>
                                            <label className='check-box-label'>Mastering</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Vocal Editing' value='Vocal Editing'/>
                                            <label className='check-box-label'>Vocal Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Vocal Tuning' value='Vocal Tuning'/>
                                            <label className='check-box-label'>Vocal Tuning</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Instrument Editing' value='Instrument Editing'/>
                                            <label className='check-box-label'>Instrument Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Drum Editing' value='Drum Editing'/>
                                            <label className='check-box-label'>Drum Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Midi Editing' value='Midi Editing'/>
                                            <label className='check-box-label'>Midi Editing</label>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="data-title">Next Follow-Up</h3>
                                <input type="date" className='new-data-value'/>
                                <h3 className="data-title">Notes:</h3>
                                <textarea name="" id="" cols="30" rows="10" className='notes-field'></textarea>
                            </div>
                            <button className="create-prospect prospect-form" type='submit'>Create New Prospect</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}