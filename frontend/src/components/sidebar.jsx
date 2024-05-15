import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './sidebar.css';
const Sidebar = () => {
  return (
    <Menu>
    <a id="home" className="menu-item" href="/">Profile</a>
    <a id="about" className="menu-item" href="/about">Saved Trips</a>
    <a id="contact" className="menu-item" href="/contact">Memories</a>
  </Menu>
  );
};

export default Sidebar;