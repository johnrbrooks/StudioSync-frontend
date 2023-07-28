import Nav from './Nav'
import DeleteModal from './DeleteModal'
import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, UserContext } from '../App'
import axios from 'axios'
import moment from 'moment'
import ReactLoading from 'react-loading'


export default function Settings() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [formData, setFormData] = useState({
        name: currentUser.name,
        username: currentUser.username,
        password: currentUser.password,
        mode: currentUser.mode,
    })
    const [isEditMode, setIsEditMode] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const formRef = useRef(null)
    const navigate = useNavigate()

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

    return (
        <div>
            <h1 className='page-title'>User Settings</h1>
            <Nav />
            <div className="prospect-settings-page">
                <h2 className="prospect-settings-title">User Information</h2>
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
                                <input type="text" className='new-data-value' placeholder='John Doe' name='name' disabled={!isEditMode} value={formData.name} onChange={handleChange}/>
                                <h3 className="data-title">Username:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' placeholder='John@johndoe.com' name='username' disabled={!isEditMode} value={formData.username} onChange={handleChange}/>
                                <h3 className="data-title">Password:<span className='required'> *</span></h3>
                                <input type="password" className='new-data-value' placeholder='111-111-1111' name='password' disabled={!isEditMode} value={formData.password} onChange={handleChange}/>
                                <h3 className="data-title">Mode:<span className='required'> *</span></h3>
                                <select name="mode" className='option-box' disabled={!isEditMode} value={formData.mode} onChange={handleChange}>
                                    <option>True</option>
                                    <option>False</option>
                                </select>
                            </div>
                            {errorMessage && <p className='error-message2'>{errorMessage}</p>}
                            {success && <p className='success-message'>{successMessage}</p>}
                            {success ? (
                                <ReactLoading type="bars" color="#0400D9" height={50} width={50} />
                            ) : (
                                isEditMode && <button className="create-prospect prospect-form" type='submit'>Update User</button> 
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}