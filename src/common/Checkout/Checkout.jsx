import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { useCart } from '../Cart/CartContext';
import { useHistory } from 'react-router-dom';

const Checkout = ({ memberId }) => {
    const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
    const baseApi = process.env.REACT_APP_BASEURL_API;

    const { cartItems } = useCart();
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [showThanksPopup, setShowThanksPopup] = useState(false);

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [no_hp, setNoHp] = useState('');
    const [kode_pos, setKodePos] = useState('');
    const [detail, setDetail] = useState('');
    const [detail_lainnya, setDetailLainnya] = useState('');
    const [payment_method, setPaymentMethod] = useState('');
    const [delivery, setDeliveryMethod] = useState('');

    const [isFullnameFilled, setIsFullnameFilled] = useState(false);
    const [isNoHpFilled, setIsNoHpFilled] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState('');
    const [kota_kabupaten, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [kecamatan, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const [idMember, setIdMember] = useState(null);

    const totalPrice = cartItems.reduce((price, item) => price + item.qty * item.harga, 0);
    const adminFee = totalPrice * 0.01;
    const totalPriceWithAdminFee = totalPrice + adminFee;

    const history = useHistory();

    useEffect(() => {
        // Set email from localStorage
        const storedEmail = localStorage.getItem('memberEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }

        // Fetch provinces
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then(response => response.json())
            .then(data => setProvinces(data))
            .catch(error => console.error('Error fetching provinces:', error));

        // Fetch idMember
        const fetchMemberId = async () => {
            try {
                const token = localStorage.getItem('data');
                if (token) {
                    const response = await axios.get(baseApi + '/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    console.log(response.data.id)
                    setIdMember(response.data.id);
                }
            } catch (error) {
                console.error('Error fetching member ID:', error);
            }
        };

        fetchMemberId();
    }, []);

    useEffect(() => {
        if (selectedProvinceId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`)
                .then(response => response.json())
                .then(data => setCities(data))
                .catch(error => console.error('Error fetching cities:', error));
        }
    }, [selectedProvinceId]);

    useEffect(() => {
        if (selectedCity) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCity}.json`)
                .then(response => response.json())
                .then(data => setDistricts(data))
                .catch(error => console.error('Error fetching districts:', error));
        }
    }, [selectedCity]);

    const handleProvinceChange = (event) => {
        const { value } = event.target;
        setSelectedProvinceId(value);
        setSelectedCity('');
        setSelectedDistrict('');
    };

    const handleCityChange = (event) => {
        const { value } = event.target;
        setSelectedCity(value);
        setSelectedDistrict('');
    };

    const handleDistrictChange = (event) => {
        const { value } = event.target;
        setSelectedDistrict(value);
    };

    const handleDeliveryMethodChange = (event) => {
        const { value } = event.target;
        setDeliveryMethod(value);
        switch (value) {
            case 'Reguler':
                setDeliveryCost(10000);
                break;
            case 'Cargo':
                setDeliveryCost(30000);
                break;
            case 'Economy':
                setDeliveryCost(50000);
                break;
            default:
                setDeliveryCost(0);
                break;
        }
    };

    const handleInputBlur = (fieldName, value) => {
        switch (fieldName) {
            case 'fullname':
                setIsFullnameFilled(!!value);
                break;
            case 'no_hp':
                setIsNoHpFilled(!!value);
                break;
            default:
                break;
        }
    };

    const handleFinishCheckout = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('data');
    
        if (!token) {
            console.error('Token not found');
            return;
        }
    
        const checkoutData = {
            id_member: idMember,
            fullname,
            email,
            no_hp,
            provinsi: provinces.find(province => province.id === selectedProvinceId)?.name,
            kota_kabupaten: kota_kabupaten.find(city => city.id === selectedCity)?.name,
            kecamatan: kecamatan.find(district => district.id === selectedDistrict)?.name,
            kode_pos,
            detail,
            detail_lainnya,
            payment_method,
            delivery,
            ringkasan_belanja: cartItems.map(item => ({
                id_produk: item.id_produk,
                nama_barang: item.nama_barang,
                jumlah: item.qty
            })),
            biaya_pengiriman: deliveryCost,
            biaya_admin: adminFee,
            total_harga: (totalPriceWithAdminFee + deliveryCost),
            status: "dibuat",
        };
    
        try {
            const response = await axios.post(baseApi + '/checkout_informations', checkoutData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            console.log('Checkout successful:', response.data);
            setShowThanksPopup(true);
            document.body.style.overflow = 'hidden';
    
            setTimeout(() => {
                setShowThanksPopup(false);
                document.body.style.overflow = 'auto';
                history.push('/');
            }, 5000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthenticated error:', error.response.data);
            } else {
                console.error('Error during checkout:', error.response ? error.response.data : error.message);
            }
        }
    };
    

    return (
        <section className='cart-items'>
            <div className="data-container">
                <h3>Contact Information</h3>
                <div>
                    <input
                        required
                        placeholder="Full Name"
                        type="text"
                        value={fullname}
                        onBlur={(e) => handleInputBlur('fullname', e.target.value)}
                        className={!isFullnameFilled ? 'required-field' : ''}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    {!isFullnameFilled && <small className="error-message">This field is required</small>}
                </div>
                <div>
                    <input
                        required
                        placeholder="Email"
                        type="email"
                        value={email}
                        readOnly
                    />
                </div>
                <div>
                    <input
                        required
                        placeholder="Phone Number"
                        type="text"
                        value={no_hp}
                        onBlur={(e) => handleInputBlur('no_hp', e.target.value)}
                        className={!isNoHpFilled ? 'required-field' : ''}
                        onChange={(e) => setNoHp(e.target.value)}
                    />
                    {!isNoHpFilled && <small className="error-message">This field is required</small>}
                </div>
                <h3>Shipping</h3>
                <div className='column'>
                    <div>
                        <select name="province" className='select-province' onChange={handleProvinceChange}>
                            <option value="" disabled selected>Select Province</option>
                            {provinces.map((province, index) => (
                                <option key={index} value={province.id}>{province.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select name="city" className='select-city' value={selectedCity} onChange={handleCityChange} required>
                            <option value="">Select City</option>
                            {kota_kabupaten.map((city, index) => (
                                <option key={index} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='column'>
                    <div>
                        <select name="district" className='select-district' value={selectedDistrict} onChange={handleDistrictChange} required>
                            <option value="">Select District</option>
                            {kecamatan.map((district, index) => (
                                <option key={index} value={district.id}>{district.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            required
                            placeholder="Postal code"
                            type="text"
                            value={kode_pos}
                            onChange={(e) => setKodePos(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <input
                        required
                        placeholder="Street, Suite, Apartment, etc (optional)"
                        type="text"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        required
                        placeholder="Other details (Exp: Block/Unit No., Benchmark)"
                        type="text"
                        value={detail_lainnya}
                        onChange={(e) => setDetailLainnya(e.target.value)}
                    />
                </div>
                <h3>Payment Method</h3>
                <div className="payment-method">
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>COD</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="E-Wallet"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>E-Wallet</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Bank"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>Bank Transfer</span>
                    </label>
                </div>
                <h3>Delivery</h3>
                <div className="delivery-method">
                    <label>
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value="Reguler"
                            onChange={handleDeliveryMethodChange}
                        />
                        <span>Reguler</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value="Cargo"
                            onChange={handleDeliveryMethodChange}
                        />
                        <span>Cargo</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value="Economy"
                            onChange={handleDeliveryMethodChange}
                        />
                        <span>Economy</span>
                    </label>
                </div>
                <div className="button-container">
                    <button className="button-checkout" onClick={handleFinishCheckout}>
                        Finish
                        <div className="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </button>
                </div>

                {showThanksPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-popup" onClick={() => setShowThanksPopup(false)}>&times;</span>
                            <h2>TERIMAKASIH SUDAH BERBELANJA DISINI</h2>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div className="data-summary">
                    <h3>Ringkasan Belanja</h3>
                    <div className='cart-details'>
                        {cartItems.length === 0 && <h1 className='no-items product'>No Items are added in Cart</h1>}
                        {cartItems.map((item) => (
                                <div className='checkout-list product' key={item.id_produk}>
                                    <div className='img-checkout'>
                                        <img src={`${urlImage}/${item.gambar}`} alt={item.nama_barang} />
                                    </div>
                                    <div className='checkout-details'>
                                        <h3>{item.nama_barang}</h3>
                                        <p>Jumlah : {item.qty}</p>
                                        <span>Rp. {item.harga.toLocaleString()}</span>
                                    </div>
                                    <div className='cart-item-price'></div>
                                </div>
                        ))}
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Ringkasan Pembayaran</h3>
                    <div className="summary-details">
                        <p><span>Biaya Pengiriman:</span> <span>Rp. {deliveryCost.toLocaleString()}</span></p>
                        <p><span>Biaya Admin:</span> <span>Rp. {adminFee.toLocaleString()}</span></p>
                        <p><span>Total Harga:</span> <span>Rp. {(totalPriceWithAdminFee + deliveryCost).toLocaleString()}</span></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
