import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DiAngularSimple } from "react-icons/di";
import './Header.css';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useCart } from '../Cart/CartContext';

const Search = ({ searchTerm, handleSearchInputChange }) => {
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { cartItems, setCartItems } = useCart();
  const baseApi = process.env.REACT_APP_BASEURL_API;

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('memberId');
      if (token) {
        const idMember = token;
        try {
          const response = await axios.get(`${baseApi}/carts?id_member=${idMember}`);
          const cartData = response.data;
          const aggregatedCartItems = cartData.reduce((acc, item) => {
            const existingItem = acc.find(i => i.id_produk === item.id_produk);
            if (existingItem) {
              existingItem.qty += 1;
            } else {
              acc.push({ ...item, qty: 1 });
            }
            return acc;
          }, []);
          setCartItems(aggregatedCartItems);
        } catch (error) {
          console.error("Failed to fetch cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [setCartItems, baseApi]);

  useEffect(() => {
    if (showCartAlert) {
      const timer = setTimeout(() => {
        setShowCartAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showCartAlert]);

  useEffect(() => {
    if (showProfileAlert) {
      const timer = setTimeout(() => {
        setShowProfileAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showProfileAlert]);

  const handleProfileClick = (event) => {
    if (!localStorage.getItem("data")) {
      event.preventDefault();
      setShowProfileAlert(true);
    }
  };

  const handleCartClick = (event) => {
    if (cartItems.length === 0) {
      event.preventDefault();
      setShowCartAlert(true);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <section className="search">
        <Collapse in={showCartAlert}>
          <Stack sx={{ width: '100%' }} spacing={2} className="alert-container">
            <Alert variant="filled" severity="error">
              Your cart is empty.
            </Alert>
          </Stack>
        </Collapse>
        <Collapse in={showProfileAlert}>
          <Stack sx={{ width: '100%' }} spacing={2} className="alert-container">
            <Alert variant="filled" severity="warning">
              Please login to view profile!
            </Alert>
          </Stack>
        </Collapse>
        <div className="navbar-container">
          <div className="logo-container" style={{ transform: 'translateY(17px)' }}>
            <div className="logo width">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', cursor: 'pointer' }}>
                <DiAngularSimple />
                <h1>Adi'st<br /> Store</h1>
              </Link>
            </div>
          </div>
          <div className="f_flex width">
            <Tooltip title="View Cart" arrow>
              <div className="cart hide-mobile">
                <Link to="/cart" onClick={handleCartClick}>
                  <i className="fa fa-shopping-bag icon-circle"></i>
                  {cartItems.length === 0 ? null : <span>{cartItems.reduce((total, item) => total + item.qty, 0)}</span>}
                </Link>
              </div>
            </Tooltip>
            <div className="profile">
              <IconButton onClick={handleMenuClick}>
                <i className="fa fa-user icon-circle"></i>
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link to="profile" onClick={handleProfileClick} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                    View Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/history-checkout" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <FontAwesomeIcon icon={faFilePen} style={{ marginRight: '10px' }} />
                    Your Delivery
                  </Link>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
