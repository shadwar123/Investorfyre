'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      
      {user ? (
        <div>
          <h1>Welcome to InvestorFyre</h1>
          <h2>Hello, {user.first_name} {user.last_name}!</h2>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Page Not Found</p>
      )}
    </div>
  );
}
