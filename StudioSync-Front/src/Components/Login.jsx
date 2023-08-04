import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, UserContext } from '../App'
import axios from 'axios'
import ReactLoading from 'react-loading'

export default function Login() {

    const { users, setUsers, isLoggedIn, setIsLoggedIn, setCurrentUser } = useContext(UserContext)

    let initialState = {
        username: '',
        password: '',
    }

    const [formState, setFormState] = useState(initialState)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/signup')
    }

    const handleChange = (e) => {
        setFormState({...formState, [e.target.id]: e.target.value })
        setMessage('')
    }

    //Attempt to find the user's based on input, if found, run all login functions, otherwise, generate error message
    const handleSubmit = async(e) => {
        e.preventDefault()
        if(formState.username === '' || formState.password === '') {
            setMessage('All fields are required.')
            return
        }
        let foundUser = await getUser()
        if(foundUser && foundUser.password === formState.password) {
            setSuccess(true)
            setIsLoggedIn(true)
            setCurrentUser(foundUser)
            sessionStorage.setItem("currentUser", JSON.stringify(foundUser))
            sessionStorage.setItem("isLoggedIn", "true")
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        } else {
            setMessage('Incorrect username or password.')
        }
    }

    //Axios call to find user based on the username submitted in the form
    const getUser = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users/get/username/${formState.username}`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    return success ? (
        <div className="login-body">
            <div className="login-container loading">
                <ReactLoading type="bars" color="#0400D9" height={100} width={50} />
            </div>
        </div>
    ) : (
        <div className="login-body">
            <div className="login-container">
                <h1 className='form-title'>StudioSync</h1> 
                <h3 className='form-subtitle'>Sign in below</h3>
                <form action="" className="login-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder='Username' className='username-input' id='username' onChange={handleChange} value={formState.username}/>
                    <input type="password" placeholder='Password' className='password-input' id='password' onChange={handleChange} value={formState.password}/>
                    {message !== '' ? <p className="error-message">{message}</p> : null}
                    <button className="login-button" type='submit'>Log in</button>
                </form>
                <p className="inquiry-note">Don't have an account?</p>
                <button className="create-account-button" onClick={() => handleClick()}>Create an Account</button>
            </div>
        </div>
    )
}