import React, { useState, useEffect } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import { GoPencil } from "react-icons/go";

const Profile = () => {
    const baseApi = process.env.REACT_APP_BASEURL_API;
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [error, setError] = useState(null);
    const [Data, setData] = useState({
        fullname: '',
        country: '',
        city: '',
        gender: '',
        detail_alamat: '',
        no_hp: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("data");
                const id = localStorage.getItem("memberId")
                const response = await axios.get(`${baseApi}/members/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserData();
    }, [baseApi]);

    const handleEditClick = (label, value) => {
        setEditMode(label);
        setEditValue(value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditValue(value);
        setData({ ...Data, [name]: value });
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const formData = new FormData();
    //         formData.append('fullname', user.fullname);
    //         formData.append('country', user.country);
    //         formData.append('city', user.city);
    //         formData.append('gender', user.gender);
    //         formData.append('detail_alamat', user.detail_alamat);
    //         formData.append('no_hp', user.no_hp);
    //         formData.append('_method', 'PUT');

    //         const token = localStorage.getItem('data');
    //         const id = localStorage.getItem('memberId');

    //         const response = await axios.post(`${baseApi}/members/${id}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (response.status === 200) {
    //             alert('Profile updated successfully');
    //             window.location.href = '/profile';
    //         } else {
    //             alert('Failed to update profile');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error.message);
    //         setError('Failed to update profile');
    //     }
    // };

    const userDetails = [
        { label: 'Full Name', value: user.fullname || '' },
        { label: 'City', value: user.city || '' },
        { label: 'Detail Address', value: user.detail_alamat || '' },
        { label: 'Phone Number', value: user.no_hp || '' },
        { label: 'Country', value: user.country || '' },
        { label: 'Gender', value: user.gender ? capitalizeFirstLetter(user.gender) : '' },
    ];

    return (
        <div>
            <section className='profile-section'>
                <div className='profile-container'>
                    <i><FaCircleUser /></i>
                    <h1>{user.fullname}</h1>
                    {/* <form onSubmit={handleSubmit}> */}
                        <div className='flex'>
                            {userDetails.map((detail, index) => (
                                <div key={index} className='user-detail'>
                                    <span className='detail-profile'>{detail.label}</span>
                                    <div className='detail-profile detail'>
                                        {editMode === detail.label ? (
                                            <input
                                                type="text"
                                                name={detail.label.toLowerCase().replace(' ', '_')}
                                                value={editValue}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{detail.value}</p>
                                        )}
                                        {/* <GoPencil onClick={() => handleEditClick(detail.label, detail.value)} /> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {editMode && <button type="submit">Save</button>}
                    {/* </form> */}
                </div>
            </section>
        </div>
    );
};

export default Profile;
