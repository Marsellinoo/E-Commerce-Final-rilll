import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Log = () => {
    const [checkoutData, setCheckoutData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({});
    const baseApi = process.env.REACT_APP_BASEURL_API;
    const scrollContainerRef = useRef(null);
    const tableContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async (query = '') => {
            try {
                const responses = await Promise.all([
                    axios.get(`${baseApi}/checkout/search`, { params: { email: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { fullname: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { no_hp: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { provinsi: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { kota_kabupaten: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { kecamatan: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { kode_pos: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { payment_method: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { delivery: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { ringkasan_belanja: query } }),
                    axios.get(`${baseApi}/checkout/search`, { params: { total_harga: query } })
                ]);

                const mergedData = responses
                    .map(response => (Array.isArray(response.data) ? response.data : []))
                    .flat();

                // Remove duplicates based on 'id'
                const uniqueData = [...new Map(mergedData.map(item => [item.id, item])).values()];
                setCheckoutData(uniqueData);

                // Set initial radio button state based on fetched data
                const initialOptions = uniqueData.reduce((acc, data) => {
                    acc[data.id] = data.status;
                    return acc;
                }, {});
                setSelectedOptions(initialOptions);

                // Debugging Logs
                console.log('Merged Data:', mergedData);
                console.log('Unique Data:', uniqueData);
                console.log('Initial Options:', initialOptions);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(searchQuery);
    }, [baseApi, searchQuery]);

    const handleScroll = (e) => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    const syncScroll = () => {
        if (scrollContainerRef.current && tableContainerRef.current) {
            scrollContainerRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
        }
    };

    useEffect(() => {
        if (tableContainerRef.current) {
            tableContainerRef.current.addEventListener('scroll', syncScroll);
        }
        return () => {
            if (tableContainerRef.current) {
                tableContainerRef.current.removeEventListener('scroll', syncScroll);
            }
        };
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleOptionChange = async (id, value) => {
        setSelectedOptions((prev) => ({ ...prev, [id]: value }));

        const selectedData = checkoutData.find(data => data.id === id);

        if (selectedData) {
            try {
                // Parse ringkasan_belanja to an array
                const updatedData = {
                    ...selectedData,
                    ringkasan_belanja: JSON.parse(selectedData.ringkasan_belanja),
                    status: value
                };

                // Use POST with `_method=PUT`
                await axios.post(`http://127.0.0.1:8000/api/checkout_informations/${id}?_method=PUT`, updatedData);

                // Update the local state to reflect the change
                setCheckoutData((prevData) =>
                    prevData.map((data) =>
                        data.id === id ? { ...data, status: value } : data
                    )
                );
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    const renderRingkasanBelanja = (ringkasanBelanja) => {
        const items = JSON.parse(ringkasanBelanja);
        return items.map((item, index) => (
            <div key={index}>
                {item.nama_barang} (Jumlah: {item.jumlah})
            </div>
        ));
    };

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by fullname, email, or other parameters"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            <div className="table-container" ref={tableContainerRef} onScroll={handleScroll}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status Pesanan</th>
                            <th>Fullname</th>
                            <th>Email</th>
                            <th>No. HP</th>
                            <th>Provinsi</th>
                            <th>Kota/Kabupaten</th>
                            <th>Kecamatan</th>
                            <th>Kode Pos</th>
                            <th>Payment Method</th>
                            <th>Delivery</th>
                            <th>Ringkasan Belanja</th>
                            <th>Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkoutData.map((data) => (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>
                                    <div className="radio-input-log">
                                        <label>
                                            <input
                                                type="radio"
                                                name={`value-radio-${data.id}`}
                                                value="dibuat"
                                                checked={selectedOptions[data.id] === 'dibuat'}
                                                onChange={() => handleOptionChange(data.id, 'dibuat')}
                                            />
                                            <span>Dibuat</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`value-radio-${data.id}`}
                                                value="dikonfirmasi"
                                                checked={selectedOptions[data.id] === 'dikonfirmasi'}
                                                onChange={() => handleOptionChange(data.id, 'dikonfirmasi')}
                                            />
                                            <span>Dikonfirmasi</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`value-radio-${data.id}`}
                                                value="dikirim"
                                                checked={selectedOptions[data.id] === 'dikirim'}
                                                onChange={() => handleOptionChange(data.id, 'dikirim')}
                                            />
                                            <span>Dikirim</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`value-radio-${data.id}`}
                                                value="diterima"
                                                checked={selectedOptions[data.id] === 'diterima'}
                                                onChange={() => handleOptionChange(data.id, 'diterima')}
                                            />
                                            <span>Diterima</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`value-radio-${data.id}`}
                                                value="selesai"
                                                checked={selectedOptions[data.id] === 'selesai'}
                                                onChange={() => handleOptionChange(data.id, 'selesai')}
                                            />
                                            <span>Selesai</span>
                                        </label>
                                        <span className="selection"></span>
                                    </div>
                                </td>
                                <td>{data.fullname}</td>
                                <td>{data.email}</td>
                                <td>{data.no_hp}</td>
                                <td>{data.provinsi}</td>
                                <td>{data.kota_kabupaten}</td>
                                <td>{data.kecamatan}</td>
                                <td>{data.kode_pos}</td>
                                <td>{data.payment_method}</td>
                                <td>{data.delivery}</td>
                                <td>{renderRingkasanBelanja(data.ringkasan_belanja)}</td>
                                <td>{data.total_harga}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Log;
