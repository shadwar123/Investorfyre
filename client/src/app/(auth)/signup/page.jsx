'use client';
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import google from '../../../../public/google.png';
import { z } from 'zod';

const signupSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100, 'First name cannot exceed 100 characters'),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name cannot exceed 100 characters'),
    email: z.string().email('Enter a valid email').nonempty('Email is required'),
});

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("sign")
        const result = signupSchema.safeParse(formData);
        const email = formData.email;
        const first_name = formData.firstName;
        const last_name = formData.lastName;
        console.log("sign 2", signupSchema.safeParse(formData))
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            return;
        }
        console.log("sign 3")
        try {
            console.log("sign 4")
            const response = await axios.post('http://localhost:5000/api/auth/signup', { first_name, last_name, email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">InvestorFyre</h1>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Register</h2>

                <button className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 rounded-md hover:bg-gray-100">
                    <a className='flex' href="http://localhost:5000/api/auth/google">
                        <Image src={google} alt="Google logo" width={20} height={20} className="mr-2" />
                        <span className="text-sm font-medium text-gray-700">Login with Google</span>
                    </a>

                </button>


                <div className="relative flex items-center justify-center mb-4">
                    <span className="absolute inset-x-0 w-full h-px bg-gray-300"></span>
                    <span className="relative px-4 text-sm text-gray-500 bg-white">OR</span>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name*</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="First Name"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name*</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Last Name"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <button type="submit" className="w-full py-2 mt-6 text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Sign up
                    </button>
                </form>

                {message && <p className="mt-4 text-sm text-center text-gray-500">{message}</p>}

                <p className="mt-4 text-sm text-center text-gray-500">
                    Already have an account? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
