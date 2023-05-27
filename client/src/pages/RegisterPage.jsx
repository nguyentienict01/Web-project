import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const RegisterPage = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    function registerUser(ev) {
        ev.preventDefault();
        axios.post('/register', {
            name, email, password
        });
    }
    return (
        <div className='mt-4 grow flex items-center justify-around'>
            <div className="mb-64">
                <h1 className='text-4xl text-center'>Login</h1>
                <form action="" className='max-w-md mx-auto' onSubmit={registerUser}>
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