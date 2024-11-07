'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import google from '../../../../public/google.png';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email').nonempty('Email is required'),
});

const Login = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        setErrors({}); 
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse({ email });
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors); 
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">InvestorFyre</h1>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Login</h2>

                <button className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 rounded-md hover:bg-gray-100">
                    <a className='flex' href="http://localhost:5000/api/auth/google">
                        <Image src={google} alt="Google logo" width={20} height={20} className="mr-2" />
                        <span className="text-sm font-medium text-gray-700">Login with Google</span>
                    </a>

                </button>

                <div className="relative flex items-center justify-center mb-4">
                    
                    <span className="relative px-4 text-sm text-gray-500 bg-white">OR</span>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <button type="submit" className="w-full py-2 mt-6 text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Login
                    </button>
                </form>

                {message && <p className="mt-4 text-sm text-center text-gray-500">{message}</p>}

                <p className="mt-4 text-sm text-center text-gray-500">
                    Don't have an account? <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
