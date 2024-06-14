import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import "./style.css";
import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPopup = ({ selectedProduct, handleClosePopup, addToCart }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const baseApi = `${process.env.REACT_APP_BASEURL_API}/carts`;
    const [memberId, setMemberId] = useState(null);
    const toastConfig = {
        position: "top-center",
        autoClose: 5000,
        limit: 2,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      };

    useEffect(() => {
        const token = localStorage.getItem('memberId');
        if (token) {
            const idMember = token
            setMemberId(idMember);
            setIsLoggedIn(true);
        }
    }, []);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const renderDescription = () => {
        if (showFullDescription) {
            return selectedProduct.description;
        } else {
            return selectedProduct.description.slice(0, 400) + "...";
        }
    };

    const renderToggleButton = () => {
        if (showFullDescription) {
            return <button onClick={toggleDescription}>Show Less</button>;
        } else {
            return <button onClick={toggleDescription}>Show More</button>;
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            window.location.href = "/login";
            return;
        }

        try {
            const token = localStorage.getItem("data");
            console.log(token)

            const response = await axios.post(
                baseApi,
                {
                    nama_barang: selectedProduct.title,
                    harga: selectedProduct.price,
                    id_produk: parseInt(selectedProduct.id),
                    id_member: memberId,
                    gambar: selectedProduct.image || null
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            addToCart(selectedProduct);
            toast.success('Product added to cart successfully!', toastConfig);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            toast.error('Failed to add product to cart', toastConfig);
        }
    };

    return (
        <div className='popup' onClick={handleClosePopup}>
                  <ToastContainer {...toastConfig} />
            <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                <button className='close-button' onClick={handleClosePopup}><IoCloseSharp /></button>
                <div className='productdisplay'>
                    <div className="productdisplay-left">
                        <div className="productdisplay-img">
                            <img className='productdisplay-main-img' src={`${urlImage}/${selectedProduct.image}`} alt="" />
                        </div>
                    </div>
                    <div className="productdisplay-right">
                        <h1>{selectedProduct.title}</h1>
                        <div className="productdisplay-right-prices">
                            <div className="productdisplay-right-price-old">{selectedProduct.bahan}</div>
                            <div className="productdisplay-right-price-new">Rp. {selectedProduct.price.toLocaleString()}</div>
                        </div>
                        <div className="productdisplay-right-description">
                            {renderDescription()}
                            {selectedProduct.description.length > 400 && renderToggleButton()}
                        </div>
                        <div className="productdisplay-right-size">
                            <h2>Select Size</h2>
                            <div className="radio-button-container">
                                {/* Radio buttons */}
                            </div>
                        </div>
                        <div className='buton-category-tag'>
                            <button className="button-cart" onClick={handleAddToCart}>ADD TO CART</button>
                            <p className='productdisplay-right-category'> <span>Tags :</span> #{selectedProduct.tags}</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer {...toastConfig} />
        </div>
    );
};

export default ProductPopup;
