
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation';

const Verify = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = new URLSearchParams(window.location.search).get('token');
            console.log('my token', token)
            
                try {
                    console.log('my token', token)
                    console.log('my mess')
                    const response = await axios.get(`http://localhost:5000/api/auth/verify?token=${token}`);
                    setMessage(response.data.message);
                    console.log('my mess',response.data.message)
                    
                    setTimeout(() => {
                        redirect('/profile'); 
                    }, 2000);
                } catch (error) {
                    setMessage(error.response?.data?.message || 'An error occurred');
                    setTimeout(() => {
                        redirect('/'); 
                    }, 2000);
                }
            
        };

        verifyEmail();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Verification</h2>
                <p className="text-center text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default Verify;
