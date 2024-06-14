import React from 'react';
import { DiAngularSimple } from "react-icons/di";
import { MdDashboard } from "react-icons/md";
import { FaArrowRightArrowLeft, FaBoxArchive, FaCartArrowDown } from "react-icons/fa6";
import { PiUsersThreeFill } from "react-icons/pi";

const Sidebar = ({ activeSection, setActiveSection }) => {
    return (
        <div className='sidebar-dashboard'>
            <div className='logo'>
                <DiAngularSimple />
                <h2>Adi'st<br /> Store</h2>
            </div>
            <div className="sidebar-menu">
                {['Dashboard', 'Checkout-log', 'Overview', 'addProduct', 'Users'].map(section => (
                    <div
                        key={section}
                        className={`menu-item ${activeSection === section ? 'active' : ''}`}
                        onClick={() => setActiveSection(section)}
                    >
                        {activeSection === section && <div className="indicator"></div>}
                        {section === 'Dashboard' && <MdDashboard />}
                        {section === 'Checkout-log' && <FaArrowRightArrowLeft />}
                        {section === 'Overview' && <FaBoxArchive />}
                        {section === 'addProduct' && <FaCartArrowDown />}
                        {section === 'Users' && <PiUsersThreeFill />}
                        <h3>{section.replace('-', ' ')}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
