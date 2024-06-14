import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TbLogout, TbLogin } from 'react-icons/tb';
import { DiAngularSimple } from "react-icons/di";
import axios from 'axios';
import './Header.css';
import { IoHome } from "react-icons/io5";
import { GiMonclerJacket } from "react-icons/gi";
import { GiArmoredPants } from "react-icons/gi";
import { FaTshirt } from "react-icons/fa";
import { GiHoodie } from "react-icons/gi";
import { GiBallerinaShoes } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = ({ CartItem }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const [MobileMenu, setMobileMenu] = useState(false);
  const baseApi = process.env.REACT_APP_BASEURL_API;

  useEffect(() => {
    const token = localStorage.getItem('data');
    setIsLoggedIn(!!token);

    if (token) {
      axios.get(baseApi + '/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setProfile(response.data.fullname);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('data');
      localStorage.removeItem('memberId');
      localStorage.removeItem('memberEmail');
      setIsLoggedIn(false);
    }
  };

  const handleAdminLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout as admin?');
    if (confirmLogout) {
      localStorage.removeItem('admin'); // Remove admin token from local storage
      window.location.href = '/admin/login'; // Redirect to admin login page
    }
  };

  return (
    <header className='header'>
      <div className='container d_flex'>
        <Link to={isLoggedIn ? '/' : '/login'}>
          <button
            className={`button-login ${isLoggedIn ? 'logged-in' : ''}`}
            onClick={isLoggedIn ? handleLogout : null}
          >
            <p>
              {isLoggedIn ? (
                <>
                  {profile && profile} <TbLogout style={{ marginLeft: '5px', transform: 'TranslateY(3px)' }} />
                </>
              ) : (
                <>
                  Login <TbLogin style={{ marginLeft: '5px', transform: 'TranslateY(3px)' }} />
                </>
              )}
            </p>
          </button>
        </Link>
        <div className='navlink'>
          <ul className={MobileMenu ? 'nav-links-MobileMenu' : 'link f_flex capitalize'} onClick={() => setMobileMenu(false)}>
            <li>
              <Link to='/' style={{ borderBottom: location.pathname === '/' ? '2px solid black' : 'none' }} >
                <IoHome />Home
              </Link>
            </li>
            <li><Link to='/jackets' style={{ borderBottom: location.pathname === '/jackets' ? '2px solid black' : 'none' }}><GiMonclerJacket />Jacket</Link></li>
            <li><Link to='/pants' style={{ borderBottom: location.pathname === '/pants' ? '2px solid black' : 'none' }}><GiArmoredPants />Pants</Link></li>
            <li><Link to='/shirt' style={{ borderBottom: location.pathname === '/shirt' ? '2px solid black' : 'none' }}><FaTshirt />T-Shirt</Link></li>
            <li><Link to='/hoodie' style={{ borderBottom: location.pathname === '/hoodie' ? '2px solid black' : 'none' }}><GiHoodie />Hoodie</Link></li>
            <li><Link to='/shoes' style={{ borderBottom: location.pathname === '/shoes' ? '2px solid black' : 'none' }}><GiBallerinaShoes />Shoes</Link></li>
            <li className='hide'>
              <Link to="/profile" onClick={(event) => {
                if (!localStorage.getItem("data")) {
                  event.preventDefault();
                  alert("Please login to view profile!");
                }
              }}>
                <FaUser />User Profile
              </Link>
            </li>
            <li className='hide'>
              <Link to="/cart" onClick={(event) => {
                // Assuming CartItem is passed as a prop to Navbar component
                if (!CartItem || CartItem.length === 0) {
                  event.preventDefault();
                  alert("Your cart is empty!");
                }
              }}>
                <FaShoppingCart />Cart
                {/* Display cart item count if available */}
                {CartItem && CartItem.length > 0 && <span>{CartItem.length}</span>}
              </Link>
            </li>
          </ul>
          <button className='toggle' onClick={() => setMobileMenu(!MobileMenu)}>
            {MobileMenu ? <i className='fas fa-times close home-btn'></i> : <i className='fas fa-bars open'></i>}
          </button>
        </div>
        {location.pathname === '/dashboard' && localStorage.getItem('admin') && (
          <button className="button-login" onClick={handleAdminLogout}>
            Logout as Admin <TbLogout style={{ marginLeft: '5px', transform: 'TranslateY(3px)' }} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
