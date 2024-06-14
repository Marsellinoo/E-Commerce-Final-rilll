import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutLog = ({ baseApi, toastConfig }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${baseApi}/checkout-logs`);
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching checkout logs:', error);
                toast.error('Gagal memuat riwayat checkout, coba lagi', toastConfig);
            }
        };

        fetchLogs();
    }, [baseApi, toastConfig]);

    return (
        <div className='checkout-log'>
            <h1>Checkout Log</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.productName}</td>
                            <td>{log.userName}</td>
                            <td>{log.date}</td>
                            <td>{log.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default CheckoutLog;
