import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBoxes, FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useHistory } from 'react-router-dom';

const ProductOverview = ({ baseApi, urlImage, toastConfig }) => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApi}/products`, {
                    params: { search: searchQuery }
                });
                const products = response.data.data.map(item => ({
                    id: item.id,
                    category: item.id_kategori,
                    title: item.nama_barang,
                    description: item.deskripsi,
                    image: item.gambar,
                    price: item.harga,
                    bahan: item.bahan,
                    size: item.ukuran,
                    tags: item.tags,
                    color: item.warna
                }));
                setProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, [baseApi, searchQuery]);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleDeleteProduct = async (productId) => {
        const accessToken = localStorage.getItem('admin');
        const tokenObject = JSON.parse(accessToken);
        const token = tokenObject.access_token;

        try {
            await axios.delete(`${baseApi}/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(products.filter(product => product.id !== productId));
            toast.success('Product deleted successfully', toastConfig);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.warn('Session expired. Please log in again.', toastConfig);
                localStorage.removeItem('admin');
                history.push('/login');
            } else {
                console.error('Error deleting product:', error);
                toast.error('Gagal menghapus produk, coba lagi', toastConfig);
            }
        }
    };

    return (
        <div className='overview-container'>
            <h1>Overview Product</h1>
            <Box sx={{ '& > :not(style)': { m: 2 } }}>
                <TextField
                    id="input-with-sx"
                    label="Search products"
                    variant="standard"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaBoxes />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <table className="table-overview">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Name Product</th>
                        <th>Price</th>
                        <th>Material</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td style={{ textAlign: 'center' }}>{product.category}</td>
                            <td><img src={`${urlImage}/${product.image}`} alt='' /></td>
                            <td>{product.title}</td>
                            <td>{product.price.toLocaleString()}</td>
                            <td>{product.bahan}</td>
                            <td>{product.size}</td>
                            <td>{product.color}</td>
                            <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%' }}>
                                <div className='trash-icon'><FaRegTrashAlt onClick={() => handleDeleteProduct(product.id)} /></div>
                                <Link to={`/login/dashboard/editproduct/${product.id}`}><div className='edit-icon'><FaRegEdit /></div></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductOverview;
