import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoArrowDown } from "react-icons/io5";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [totalMembers, setTotalMembers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseApi = process.env.REACT_APP_BASEURL_API;
    const toastConfig = {
        position: "top-right",
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
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [membersResponse, countResponse] = await Promise.all([
                    axios.get(`${baseApi}/members`),
                    axios.get(`${baseApi}/count_products`)
                ]);

                if (isMounted) {
                    const members = membersResponse.data.data || [];
                    setUsers(members);

                    const totalMembers = countResponse.data.total_members || 0;
                    setTotalMembers(totalMembers);
                }
            } catch (error) {
                if (isMounted) {
                    setError('Error fetching data');
                    console.error('Error fetching data:', error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [baseApi]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        const accessToken = localStorage.getItem('admin');
        const tokenObject = JSON.parse(accessToken);
        const token = tokenObject.access_token;

        try {
            await axios.delete(`${baseApi}/members/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUsers(users.filter(user => user.id !== userId));
            toast.success('User deleted successfully', toastConfig);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.warn('Session expired. Please log in again.', toastConfig);
                localStorage.removeItem('admin');
                // Redirect to login page
                window.location.href = '/login'; // Assuming you have a route for login
            } else {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user, please try again.', toastConfig);
            }
        }
    };

    const handleBlockUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to block this user?");
        if (!confirmed) return;

        const accessToken = localStorage.getItem('admin');
        const tokenObject = JSON.parse(accessToken);
        const token = tokenObject.access_token;
        console.log(token)

        try {
            await axios.post(`${baseApi}/members/block-member/${userId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUsers(users.map(user =>
                user.id === userId ? { ...user, is_active: 0 } : user
            ));
            toast.success('User blocked successfully', toastConfig);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.warn('Session expired. Please log in again.', toastConfig);
                localStorage.removeItem('admin');
                window.location.href = '/login';
            } else {
                console.error('Error blocking user:', error);
                toast.error('Failed to block user, please try again.', toastConfig);
            }
        }
    };

    const handleUnblockUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to unblock this user?");
        if (!confirmed) return;

        const accessToken = localStorage.getItem('admin');
        const tokenObject = JSON.parse(accessToken);
        const token = tokenObject.access_token;

        try {
            await axios.post(`${baseApi}/members/unblock-member/${userId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUsers(users.map(user =>
                user.id === userId ? { ...user, is_active: 1 } : user
            ));
            toast.success('User unblocked successfully', toastConfig);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.warn('Session expired. Please log in again.', toastConfig);
                localStorage.removeItem('admin');
                // Redirect to login page
                window.location.href = '/login'; // Assuming you have a route for login
            } else {
                console.error('Error unblocking user:', error);
                toast.error('Failed to unblock user, please try again.', toastConfig);
            }
        }
    };

    return (
        <div>
            <div className='total-users'>
                <span className='total-number'>{totalMembers}</span><br />Total User
            </div>
            <table className='table-user'>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Fullname</th>
                        <th>Phone</th>
                        <th>Country</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.fullname}</td>
                                <td>{user.no_hp}</td>
                                <td>{user.country}</td>
                                <td>
                                    <div className='status-user'>
                                        <div className={user.is_active === 1 ? 'active' : 'inactive'}>
                                            {user.is_active === 1 ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <span onClick={() => handleDeleteUser(user.id)}>
                                            <FaTrashAlt />
                                        </span>
                                        <i onClick={() => user.is_active === 1 ? handleBlockUser(user.id) : handleUnblockUser(user.id)}>
                                            {user.is_active === 1 ? <FaEye /> : <FaEyeSlash />}
                                        </i>
                                        <i><IoArrowDown /></i>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
