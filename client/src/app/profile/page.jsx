'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiSearch, FiUser } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { RiTwitterXFill } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        country: '',
        company_website: '',
        social1: '',
        social2: '',
        profile_picture: null,
    });

    useEffect(() => {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            const parsedUser = JSON.parse(storedUser);
            setForm((prev) => ({ ...prev, email: parsedUser.email }));
        } else {

            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/user/get-profile', { withCredentials: true });
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    setForm((prev) => ({ ...prev, email: response.data.email }));
                } catch (error) {
                    console.log('Error fetching user data:', error);
                    // router.push('/login');  
                }
            };

            fetchUserData();
        }
    }, [router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
            credentials: 'include',
        });

        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            console.error('Failed to update profile');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setForm((prev) => ({ ...prev, profile_picture: reader.result })); 
            };
            reader.readAsDataURL(file); 
        }
    };

    // if (!user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <div className="text-xl font-bold">InvestorFyre</div>
                <div className="flex items-center space-x-4 relative w-1/3">
                    <input
                        type="text"
                        placeholder="Search"
                        className="p-2 pl-4 pr-10 rounded-3xl w-full"
                    />
                    <FiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <CgProfile size={25} />

            </div>
            <div className="p-3 bg-white flex justify-center items-center mt-0 text-xl text-bold text-gray-900">
                Complete Profile
            </div>

            {/* Profile Section */}
            <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex justify-center">
                        <label className="relative">
                            <div
                                className="w-32 h-32 rounded-full border border-gray-200 border-b-2 flex items-center justify-center cursor-pointer"
                                style={{
                                    backgroundImage: form.profile_picture
                                        ? `url(${form.profile_picture})`
                                        : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {!form.profile_picture && (
                                    <span className="text-white">+</span>
                                )}
                            </div>
                            <div className='absolute bottom-3 right-4'><FaCamera /></div>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0"
                                accept="image/jpeg, image/png"
                            />
                        </label>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-6 ">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={form.first_name}
                                placeholder='Jane'
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-50 border rounded-md"
                                required
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder='Doe'
                                value={form.last_name}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-50 border rounded-md"
                                required
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                placeholder=''
                                disabled
                                className="w-full p-2 bg-gray-50 border rounded-md  cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium">Country</label>
                            <input
                                type="text"
                                name="country"
                                placeholder='India'
                                value={form.country}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-50 border rounded-md"
                                required
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium">
                                Startup Website
                            </label>
                            <input
                                type="url"
                                name="company_website"
                                placeholder='https://janedoe.com'
                                value={form.company_website}
                                onChange={handleChange}
                                className="w-full p-2  bg-gray-50 border rounded-md"
                            />
                        </div>
                        <div></div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium">
                                Social Website
                            </label>
                            <div className='flex'>
                                <PiLinkedinLogoBold className='p-0 my-3 mx-2' size={25} />

                                <input
                                    type="url"
                                    name="social1"
                                    placeholder='https://instagram.com'
                                    value={form.social1}
                                    onChange={handleChange}
                                    className="w-full p-1 bg-gray-50 border rounded-md"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 w-full mt-7">


                            <div className='flex'>
                                <RiTwitterXFill className='p-0 my-3 mx-2' size={25} />
                                <input
                                    type="url"
                                    name="social2"
                                    placeholder='https://twitter.com'
                                    value={form.social2}
                                    onChange={handleChange}
                                    className="w-full p-1 bg-gray-50 border rounded-md"
                                />
                            </div>

                        </div>
                    </div>




                    {/* Save Profile Button */}
                    <div className='flex justify-center'>
                        <button
                            type="submit"
                            className="px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-indigo-700"
                        >
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
