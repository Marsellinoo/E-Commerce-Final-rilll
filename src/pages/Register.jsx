import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const baseApi = process.env.REACT_APP_BASEURL_API;
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        konfirmasi_password: '',
        no_hp: '',
        gender: '',
        detail_alamat: '',
        city: '',
        country: ''
    });
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(baseApi + '/auth/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                history.push('/login');
                alert('Anda berhasil registrasi');
            } else {
                throw new Error('Gagal menyubmit formulir');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className='register-section-container'>
            <section class="container-register">
                <p className="title">Registration Form</p>
                <form class="form-register" action="#">
                    <div class="input-box">
                        <label>Full Name</label>
                        <input required="" placeholder="Enter full name" type="text" name="fullname" value={formData.fullname} onChange={handleChange} />
                    </div>
                    <div class="input-box">
                        <label>Gmail</label>
                        <input required="" placeholder="Enter full name" type="text" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div class="column">
                        <div class="input-box">
                            <label>Password</label>
                            <input required="" placeholder="Enter full name" type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div class="input-box">
                            <label>Confirm Password</label>
                            <input required="" placeholder="Enter full name" type="password" name="konfirmasi_password" value={formData.konfirmasi_password} onChange={handleChange} />
                        </div>
                    </div>
                    <div class="column">
                        <div class="input-box">
                            <label>Phone Number</label>
                            <input required="" placeholder="Enter phone number" type="telephone" name="no_hp" value={formData.no_hp} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="gender-box">
                        <label>Gender</label>
                        <div className="gender-option">
                            <div className="gender">
                                <input
                                    name="gender"
                                    id="check-male"
                                    type="radio"
                                    value="male"
                                    onChange={handleRadioChange}
                                />
                                <label htmlFor="check-male">Male</label>
                            </div>
                            <div className="gender">
                                <input
                                    name="gender"
                                    id="check-female"
                                    type="radio"
                                    value="female"
                                    onChange={handleRadioChange}
                                />
                                <label htmlFor="check-female">Female</label>
                            </div>
                        </div>
                    </div>
                    <div class="input-box address">
                        <label>Address</label>
                        <input required="" placeholder="Enter details address" type="text" name="detail_alamat" value={formData.detail_alamat} onChange={handleChange} />
                        <div class="column">
                            <input
                                type="text"
                                name="country"
                                placeholder='Enter your country'
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                            <input required="" placeholder="Enter your city" type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="button" onClick={handleSubmit}>Submit</button>
                </form>
            </section>
        </div>
    );
};

export default Register;
