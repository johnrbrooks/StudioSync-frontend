import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserContext, BASE_URL } from '../App'
import axios from 'axios'
import ReactLoading from 'react-loading'

export default function SignUp() {

    const { users, setUsers, isLoggedIn, setIsLoggedIn, setCurrentUser } = useContext(UserContext)

    let initialState = {
        name: '',
        username: '',
        password: '',
        confirmpassword: '',
    }

    const [formState, setFormState] = useState(initialState)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormState({...formState, [e.target.id]: e.target.value })
        setMessage('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formState.name === '' || formState.username === '' || formState.password === '' || formState.confirmpassword === '') {
            setMessage('All fields are required.')
            return;
        }
        if(users.filter((user) => user.username === formState.username.toLowerCase()).length > 0) {
            setMessage('Account with that username already exists!')
        } else if (formState.password === formState.confirmpassword) {
            try {
                let newUser = await createUser()
                console.log(newUser)
                setSuccess(true)
                setIsLoggedIn(true)
                setCurrentUser(newUser)
                sessionStorage.setItem("currentUser", JSON.stringify(newUser))
                sessionStorage.setItem("isLoggedIn", "true")
                setTimeout(() => {
                    navigate('/dashboard')
                }, 2000)
            } catch (error) {
                console.log(error)
            }
        } else {
            setMessage('Passwords do not match.')
        }
    }

    const createUser = async() => {
        let user = await axios.post(`${BASE_URL}/users/create`, {
            name: formState.name,
            username: formState.username.toLowerCase(),
            password: formState.password,
            pipeline: [],
            mode: true,
        })
        return user.data
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
                <h3 className='form-subtitle'>Create an Account below</h3>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder='Name' className='name-input' id='name' onChange={handleChange} value={formState.name}/>
                    <input type="text" placeholder='Username' className='username-input' id='username' onChange={handleChange} value={formState.username}/>
                    <input type="password" placeholder='Password' className='password-input' id='password' onChange={handleChange} value={formState.password}/>
                    <input type="password" placeholder='Confirm Password' className='password-input2' id='confirmpassword' onChange={handleChange} value={formState.confirmpassword}/>
                    {message !== '' ? <p className="error-message">{message}</p> : null}
                    <div className='sign-up-buttons-container'>
                        <button className="login-button" type='submit'>Create Account</button>
                        <Link to="/login" className='back-button'>Back to login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}