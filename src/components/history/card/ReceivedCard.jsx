import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../History.css';
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
                const idMember = localStorage.getItem('memberId'); // Ambil id_member dari local storage

                const [checkoutResponse, productsResponse] = await Promise.all([
                    axios.get(`${baseApi}/checkout_histories?id_member=${idMember}&status=diterima`, {
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
        console.log(id_produk)
        const product = products.find(p => p.id === id_produk);
        return product ? { price: product.harga, image: product.gambar } : { price: 'N/A', image: 'default.png' };
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const renderProductCard = (history) => {
        const { ringkasan_belanja, status } = history;

        return ringkasan_belanja.map(product => {
            const { id_produk, jumlah } = product;
            const { price, image } = getProductDetails(id_produk);
            const totalProductPrice = price !== 'N/A' ? price * jumlah : 'N/A';
            const capitalizedStatus = capitalizeFirstLetter(status);

            return (
                <div key={id_produk} className='card-history-container'>
                    <div className={`status-pesanan`}>Pesanan {capitalizedStatus}</div>
                    <Link to={`/history-checkout/details/${history.id}`}>
                        <div className='des-card-history'>
                            <div className='img-history-container'>
                                <img src={`${urlImage}/${image}`} alt={product.nama_barang} />
                            </div>
                            <div>
                                <span>{product.nama_barang}</span>
                                <p>Jumlah: {jumlah}</p>
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
        });
    };

    return (
        <div className="card-history-position">
            {checkoutHistories.flatMap(history =>
                renderProductCard(history)
            )}
        </div>
    );
};

export default CardHistory;
