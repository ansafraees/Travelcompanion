import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './sidebar.css';
import { useNavigate } from "react-router-dom"

const Sidebar = () => {
  const history = useNavigate();

  const logout = async () => {
    try {
      // Make a request to your logout endpoint (/logout)
      const response = await fetch('http://localhost:5000/api/v1/users/logout', {
        method: 'get', // Or 'GET', depending on your server setup
        credentials: 'include', // Important if you're dealing with cookies
      });

      if (response.ok) {
        // Assuming successful logout, redirect to home or login page
        history('/'); // Redirect to login page after logout
      } else {
        // Handle logout failure or errors
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Menu>
      <a className="menu-item" onClick={logout} href="/">Logout</a>
      <a className="menu-item" href="/chat">ChatBot</a>
    </Menu>
  );
};

export default Sidebar;
