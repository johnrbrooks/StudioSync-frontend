import Nav from './Nav'
import DeleteUserModal from './DeleteUserModal'
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
    const [formData, setFormData] = useState({})
    const [isEditMode, setIsEditMode] = useState(false)
    const [passwordEdit, setPasswordEdit] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const formRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async() => {
            const response = await axios.get(`${BASE_URL}users/get/id/${currentUser._id}`)
            setFormData({
                name: response.data.name,
                username: response.data.username,
                password: response.data.password,
                confirmPassword: '',
                mode: response.data.mode,
            })
        }
        getUser()
    }, [currentUser])


    const handleChange = (e) => {
        setErrorMessage('')
        const { name, value } = e.target
        if (name === 'password') {
            if (passwordEdit) {
                // Allow editing password field when passwordEdit is true
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    password: value,
                }));
            } 
        } else if (name === 'confirmPassword') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                confirmPassword: value,
            }))
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }))
        }
    }

    const handlePasswordClick = () => {
        setPasswordEdit(true);
    };

    const handleEditClick = () => {
        setIsEditMode((prevIsEditMode) => !prevIsEditMode);
        // Reset the confirmPassword field if the user is not in edit mode
        if (!isEditMode) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            confirmPassword: prevFormData.password,
          }));
        }
      };
    
    const updateUser = async(e) => {
        e.preventDefault()
        if(formData.password === formData.confirmPassword) {
            const formattedData = { ...formData, mode: JSON.parse(formData.mode) }
            try {
                const updateUser = await axios.put(`${BASE_URL}users/update/${currentUser._id}`, formattedData)
                if(updateUser){
                    setPasswordEdit(false)
                    setSuccess(true)
                    setSuccessMessage('Updating User...')
                    setIsEditMode(false)
                    setTimeout(() => {
                        setSuccess(false)
                        setSuccessMessage('')
                    }, 1500)
                }
            } catch (error) {
                setErrorMessage('Error updating user')
                console.error('Error updating user:', error)
            }
        } else {
            setErrorMessage(`Passwords must match.`)
        }
    }

    const handleDelete = async() => {
        try {
            const deleteUser = await axios.delete(`${BASE_URL}users/delete/${currentUser._id}`)
            if(deleteUser){
                navigate('/login')
            }
        } catch (error) {
            setErrorMessage('Error deleting user')
            console.error('Error updating user:', error)
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
                            <DeleteUserModal
                                show={showDeleteModal}
                                onCancel={() => setShowDeleteModal(false)}
                                onConfirm={() => {
                                handleDelete()
                                setShowDeleteModal(false)
                                }}
                            />
                        </div>
                        <form action="" ref={formRef} onSubmit={updateUser} className="information-form">
                            <div className="new-data-grid">
                                <h3 className="data-title">Name:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' name='name' disabled={!isEditMode} value={formData.name} onChange={handleChange}/>
                                <h3 className="data-title">Username:<span className='required'> *</span></h3>
                                <input type="text" className='new-data-value' name='username' disabled={!isEditMode} value={formData.username} onChange={handleChange}/>
                                <h3 className="data-title">Password:<span className='required'> *</span></h3>
                                <input type="password" className='new-data-value' placeholder='New Password' name='password' disabled={!isEditMode} value={formData.password} onClick={handlePasswordClick} onChange={handleChange}/>
                                {passwordEdit && (
                                    <>
                                        <h3 className="data-title">Confirm Password:<span className='required'> *</span></h3>
                                        <input type="password" className='new-data-value' placeholder='Confirm Password' name='confirmPassword' disabled={!isEditMode} onChange={handleChange}/>
                                    </>)}
                                <h3 className="data-title">Mode:<span className='required'> *</span></h3>
                                <select name="mode" className='option-box' disabled={!isEditMode} value={formData.mode} onChange={handleChange}>
                                    <option value='true'>True</option>
                                    <option value='false'>False</option>
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