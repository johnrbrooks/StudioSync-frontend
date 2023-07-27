import Nav from './Nav'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_URL, UserContext } from '../App'
import axios from 'axios'
import moment from 'moment'

export default function NewProspect() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const [formData, setFormData] = useState({
        user_pipeline: currentUser._id,
        contact_name: '',
        email: '',
        phone: '',
        stage: 'Unqualified',
        probability: 0,
        projected_value: '',
        interested_services: [],
        next_follow_up: '',
        notes: '',
    })

    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if(type === 'checkbox') {
            if(checked) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    interested_services_services: [...prevFormData.interested_services, value]
                }))
            } else {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    interested_services: prevFormData.interested_services.filter((service) => service !== value),
                }))
            }
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }))
        }
    }

    const createProspect = (e) => {
        e.preventDefault()
        setErrorMessage('')
        console.log(formData)

        const requiredFields = ['contact_name', 'email', 'phone', 'stage', 'probability', 'projected_value']

        const missingFields = requiredFields.filter((field) => !formData[field])

        if (missingFields.length > 0) {
            setErrorMessage(`Please fill in all required fields: ${missingFields.join(', ')}`)
        } else {
            const addProspect = async() => {
                try {
                    let prospect = await axios.post(`${BASE_URL}/prospects/create`, formData)
                    console.log(prospect)
                } catch (error) {
                    console.error('Error creating prospect:', error)
                }
            }
        }
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
                        <form action="" onSubmit={createProspect} className="information-form">
                            <div className="new-data-grid">
                                <h3 className="data-title">Name:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='John Doe' onChange={handleChange}/>
                                <h3 className="data-title">Email:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='John@johndoe.com' onChange={handleChange}/>
                                <h3 className="data-title">Phone:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='111-111-1111' onChange={handleChange}/>
                                <h3 className="data-title">Stage:<span className='required'> *</span></h3>
                                <select name="stage" id="stage" className='option-box' onChange={handleChange}>
                                    <option value="Unqualified">Unqualified</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Proposal">Proposal</option>
                                    <option value="Negotiation">Negotiation</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                <h3 className="data-title">Probability:<span className='required'> *</span></h3>
                                <select name="stage" id="stage" className='option-box' onChange={handleChange}>
                                    <option value="Unqualified">0</option>
                                    <option value="Qualified">30</option>
                                    <option value="Proposal">50</option>
                                    <option value="Negotiation">80</option>
                                    <option value="Closed">100</option>
                                </select>
                                <h3 className="data-title">Projected Value:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='500' onChange={handleChange}/>
                                <h3 className="data-title">Interested Services:</h3>
                                <div className="check-boxes-container">
                                    <p className='check-box-title'>Check all that apply:</p>
                                    <div className="check-boxes-grid">
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Pre-Production' value='Pre-Production' onChange={handleChange}/>
                                            <label className='check-box-label'>Pre-Production</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Production' value='Production' onChange={handleChange}/>
                                            <label className='check-box-label'>Production</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Studio Musician' value='Studio Musician' onChange={handleChange}/>
                                            <label className='check-box-label'>Studio Musician</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Recording' value='Recording' onChange={handleChange}/>
                                            <label className='check-box-label'>Recording</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Mixing' value='Mixing' onChange={handleChange}/>
                                            <label className='check-box-label'>Mixing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Mastering' value='Mastering' onChange={handleChange}/>
                                            <label className='check-box-label'>Mastering</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Vocal Editing' value='Vocal Editing' onChange={handleChange}/>
                                            <label className='check-box-label'>Vocal Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Vocal Tuning' value='Vocal Tuning' onChange={handleChange}/>
                                            <label className='check-box-label'>Vocal Tuning</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Instrument Editing' value='Instrument Editing' onChange={handleChange}/>
                                            <label className='check-box-label'>Instrument Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Drum Editing' value='Drum Editing' onChange={handleChange}/>
                                            <label className='check-box-label'>Drum Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Midi Editing' value='Midi Editing' onChange={handleChange}/>
                                            <label className='check-box-label'>Midi Editing</label>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="data-title">Next Follow-Up</h3>
                                <input type="date" className='new-data-value' onChange={handleChange}/>
                                <h3 className="data-title">Notes:</h3>
                                <textarea name="" id="" cols="30" rows="10" className='notes-field' onChange={handleChange}></textarea>
                            </div>
                            {errorMessage && <p className='error-message'>{errorMessage}</p>}
                            <button className="create-prospect prospect-form" type='submit'>Create New Prospect</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}