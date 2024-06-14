import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';
import { Link } from 'react-router-dom';

const CardHistory = () => {
    const [checkoutHistories, setCheckoutHistories] = useState([]);
    const [products, setProducts] = useState([]);
    const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
    const baseApi = process.env.REACT_APP_BASEURL_API;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('data');
                const [checkoutResponse, productsResponse] = await Promise.all([
                    axios.get(`${baseApi}/checkout_histories`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseApi}/products`)
                ]);
                setCheckoutHistories(checkoutResponse.data.data);
                setProducts(productsResponse.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [baseApi]);

    const getProductDetails = (id_produk) => {
        const product = products.find(p => p.id === id_produk);
        return product ? { price: product.harga, image: product.gambar } : { price: 'N/A', image: 'default.png' };
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const renderProductCard = (product, status) => {
        const { price, image } = getProductDetails(product.id_produk);
        const totalProductPrice = price !== 'N/A' ? price * product.jumlah : 'N/A';
        const capitalizedStatus = capitalizeFirstLetter(status);

        // let statusClass = '';
        // if (status === 'dibuat') {
        //     statusClass = 'pending-status'; // Font abu-abu untuk status 'dibuat'
        // } else if (status === 'dikonfirmasi' || status === 'dikirim') {
        //     statusClass = 'process-status'; // Font kuning untuk status 'dikonfirmasi', 'dikirim'
        // } else if (status === 'diterima' || status === 'selesai') {
        //     statusClass = 'complete-status'; // Font hijau untuk status 'diterima', 'selesai'
        // }

        return (
            <div key={product.id_produk} className='card-history-container'>
                {/* <div className={`status-pesanan ${statusClass}`}>Pesanan {capitalizedStatus}</div> */}
                <div className={`status-pesanan`}>Pesanan {capitalizedStatus}</div>
                <Link to='/history-checkout/details'>
                    <div className='des-card-history'>
                        <div className='img-history-container'>
                            <img src={`${urlImage}/${image}`} alt={product.nama_barang} />
                        </div>
                        <div>
                            <span>{product.nama_barang}</span>
                            <p>Jumlah: {product.jumlah}</p>
                            <p>Rp. {price.toLocaleString()}</p>
                        </div>
                    </div>
                </Link>
                <div className='summary-card-history'>
                    <div>
                        <button className="button-history">Beli Lagi</button>
                        <button className="button-history">Hubungi Saya</button>
                    </div>
                    <p>Total Pesanan: <b>{totalProductPrice.toLocaleString()}</b></p>
                </div>
            </div>
        );
    };

    return (
        <div className="card-history-position">
            {checkoutHistories.flatMap(history =>
                history.ringkasan_belanja.map(product => renderProductCard(product, history.status))
            )}
        </div>
    );
};

export default CardHistory;
