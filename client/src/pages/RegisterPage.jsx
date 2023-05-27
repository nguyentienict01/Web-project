import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post('/register', {
                name, email, password
            });
            alert("Successful registration!")
        } catch (error) {
            alert("Registration failed. Please try again")
        }
    }
    return (
        <div className='mt-4 grow flex items-center justify-around'>
            <div className="mb-64">
                <h1 className='text-4xl text-center'>Register Account</h1>
                <form action="" className='max-w-md mx-auto mt-5' onSubmit={registerUser}>
                    <input type="text" placeholder='Name' value={name} onChange={ev => setName(ev.target.value)} />
                    <input type="email" placeholder='Email' value={email} onChange={ev => setEmail(ev.target.value)}/>
                    <input type="password" placeholder='Password' value={password} onChange={ev => setPassword(ev.target.value)}/>
                    <button className='primary'>Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Have an account already <Link className='underline text-black' to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage