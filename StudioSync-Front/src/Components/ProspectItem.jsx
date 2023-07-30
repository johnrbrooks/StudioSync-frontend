import Nav from './Nav'
import DeleteModal from './DeleteModal'
import { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BASE_URL, UserContext } from '../App'
import axios from 'axios'
import moment from 'moment'
import ReactLoading from 'react-loading'


export default function ProspectItem() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const [prospect, setProspect] = useState()
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [formData, setFormData] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const key = useParams()
    const formRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getProspect = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/prospects/get/${key.id}`)
            setProspect(response.data)  
            setFormData({
              user_pipeline: currentUser._id,
              contact_name: response.data.contact_name,
              email: response.data.email,
              phone: response.data.phone,
              stage: response.data.stage,
              probability: response.data.probability,
              projected_value: response.data.projected_value,
              interested_services: response.data.interested_services,
              next_follow_up: response.data.next_follow_up,
              notes: response.data.notes,
            });
          } catch (error) {
            console.error('Error fetching prospect:', error)
          }
        };
        getProspect();
      }, [key.id, currentUser._id])

    const handleChange = (e) => {
        setErrorMessage('')
        const { name, value, type, checked } = e.target
        if(type === 'checkbox') {
            if(checked) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    interested_services: [...prevFormData.interested_services, value]
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

    const handleEditClick = () => {
        if(isEditMode){
            setIsEditMode(false)
        } else {
            setIsEditMode(true)
        }
    }
    
    const updateProspect = async(e) => {
        e.preventDefault()
        try {
            const updateProspect = await axios.put(`${BASE_URL}/prospects/update/${key.id}`, formData)
            if(updateProspect){
                setSuccess(true)
                setSuccessMessage('Updating prospect...')
                setIsEditMode(false)
                setTimeout(() => {
                    setSuccess(false)
                    setSuccessMessage('')
                }, 1500)
            }
        } catch (error) {
            setErrorMessage('Error updating prospect')
            console.error('Error updating prospect:', error)
        }
    }

    const handleDelete = async() => {
        try {
            const updateCurrentUser = await axios.put(`${BASE_URL}/users/${currentUser._id}/removeProspect/${key.id}`)
            const deleteProspect = await axios.delete(`${BASE_URL}/prospects/delete/${key.id}`)
            if(deleteProspect && updateCurrentUser){
                navigate('/prospects')
            }
        } catch (error) {
            setErrorMessage('Error deleting prospect')
            console.error('Error updating prospect:', error)
        }
    }

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
                        <div className="prospect-buttons">
                            <button className="create-prospect prospect-form" onClick={handleEditClick}>Edit</button>
                            <button className="delete-prospect prospect-form" onClick={() => setShowDeleteModal(true)}>Delete</button>
                            <DeleteModal
                                show={showDeleteModal}
                                onCancel={() => setShowDeleteModal(false)}
                                onConfirm={() => {
                                handleDelete()
                                setShowDeleteModal(false)
                                }}
                            />
                        </div>
                        <form action="" ref={formRef} onSubmit={updateProspect} className="information-form">
                            <div className="new-data-grid">
                                <h3 className="data-title">Name:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='John Doe' name='contact_name' disabled={!isEditMode} value={formData.contact_name} onChange={handleChange}/>
                                <h3 className="data-title">Email:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='John@johndoe.com' name='email' disabled={!isEditMode} value={formData.email} onChange={handleChange}/>
                                <h3 className="data-title">Phone:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='111-111-1111' name='phone' disabled={!isEditMode} value={formData.phone} onChange={handleChange}/>
                                <h3 className="data-title">Stage:<span className='required'> *</span></h3>
                                <select name="stage" id="stage" className='option-box' value={formData.stage} disabled={!isEditMode} onChange={handleChange}>
                                    <option></option>
                                    <option value="Unqualified">Unqualified</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Proposal">Proposal</option>
                                    <option value="Negotiation">Negotiation</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                <h3 className="data-title extension">Probability:<span className='required'> *</span></h3>
                                <select name="probability" id="stage" className='option-box' disabled={!isEditMode} value={formData.probability} onChange={handleChange}>
                                    <option></option>
                                    <option>0</option>
                                    <option>30</option>
                                    <option>50</option>
                                    <option>80</option>
                                    <option>100</option>
                                </select>
                                <h3 className="data-title">Projected Value:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='500' name='projected_value' disabled={!isEditMode} value={formData.projected_value} onChange={handleChange}/>
                                <h3 className="data-title">Interested Services:</h3>
                                <div className="check-boxes-container">
                                    <p className='check-box-title'>Check all that apply:</p>
                                    <div className="check-boxes-grid">
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Pre-Production' value='Pre-Production' disabled={!isEditMode} checked={formData.interested_services.includes("Pre-Production")} onChange={handleChange}/>
                                            <label className='check-box-label'>Pre-Production</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Production' value='Production' disabled={!isEditMode} checked={formData.interested_services.includes("Production")}  onChange={handleChange}/>
                                            <label className='check-box-label'>Production</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Studio Musician' value='Studio Musician' disabled={!isEditMode} checked={formData.interested_services.includes("Studio Musician")} onChange={handleChange}/>
                                            <label className='check-box-label'>Studio Musician</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Recording' value='Recording' disabled={!isEditMode} checked={formData.interested_services.includes("Recording")} onChange={handleChange}/>
                                            <label className='check-box-label'>Recording</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Mixing' value='Mixing' disabled={!isEditMode} checked={formData.interested_services.includes("Mixing")} onChange={handleChange}/>
                                            <label className='check-box-label'>Mixing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Mastering' value='Mastering' disabled={!isEditMode} checked={formData.interested_services.includes("Mastering")} onChange={handleChange}/>
                                            <label className='check-box-label'>Mastering</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Vocal Editing' value='Vocal Editing' disabled={!isEditMode} checked={formData.interested_services.includes("Vocal Editing")} onChange={handleChange}/>
                                            <label className='check-box-label'>Vocal Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Vocal Tuning' value='Vocal Tuning' disabled={!isEditMode} checked={formData.interested_services.includes("Vocal Tuning")} onChange={handleChange}/>
                                            <label className='check-box-label'>Vocal Tuning</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Instrument Editing' value='Instrument Editing' disabled={!isEditMode} checked={formData.interested_services.includes("Instrument Editing")} onChange={handleChange}/>
                                            <label className='check-box-label'>Instrument Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Drum Editing' value='Drum Editing' disabled={!isEditMode} checked={formData.interested_services.includes("Drum Editing")} onChange={handleChange}/>
                                            <label className='check-box-label'>Drum Editing</label>
                                        </div>
                                        <div className="check-box-item">
                                            <input type="checkbox" name='Midi Editing' value='Midi Editing' disabled={!isEditMode} checked={formData.interested_services.includes("Midi Editing")} onChange={handleChange}/>
                                            <label className='check-box-label'>Midi Editing</label>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="data-title">Next Follow-Up:</h3>
                                <input type="date" className='new-data-value' name='next_follow_up' disabled={!isEditMode} value={formData.next_follow_up} onChange={handleChange}/>
                                <h3 className="data-title">Notes:</h3>
                                <textarea id="" cols="30" rows="10" name='notes' className='notes-field' disabled={!isEditMode} value={formData.notes} onChange={handleChange}></textarea>
                            </div>
                            {errorMessage && <p className='error-message2'>{errorMessage}</p>}
                            {success && <p className='success-message'>{successMessage}</p>}
                            {success ? (
                                <ReactLoading type="bars" color="#0400D9" height={50} width={50} />
                            ) : (
                                isEditMode && <button className="create-prospect prospect-form" type='submit'>Update Prospect</button> 
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}