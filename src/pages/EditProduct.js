import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useHistory } from 'react-router-dom';
import { TbLogout } from 'react-icons/tb';
import { FaCartArrowDown, FaUserCircle } from "react-icons/fa";
import { DiAngularSimple } from "react-icons/di";
import { RiImageAddLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { FaBoxArchive, FaArrowRightArrowLeft } from "react-icons/fa6";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({
        id_kategori: '',
        id_subkategori: '',
        gambar: '',
        nama_barang: '',
        harga: '',
        deskripsi: '',
        diskon: '',
        bahan: '',
        tags: '',
        sku: '',
        ukuran: '',
        warna: ''
    });
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const baseUrl = process.env.REACT_APP_BASEURL_API;
    const imageUrl = process.env.REACT_APP_API1_IMAGE_URL;
    const adminToken = localStorage.getItem('admin');
    const history = useHistory();
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeSection, setActiveSection] = useState('editProduct');
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        const isAdminLoggedIn = localStorage.getItem('admin');
        if (!isAdminLoggedIn) {
            history.push('/login');
        } else {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        setActiveSection('EditProduct');
    }, [history]);

    useEffect(() => {
        const getProduct = async () => {
            try {
                if (!adminToken) {
                    setError('Unauthorized: tidak ada token, login ulang');
                    return;
                }

                const tokenObject = JSON.parse(adminToken);
                const token = tokenObject.access_token;

                const response = await axios.get(`${baseUrl}/products/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    const { id_kategori, id_subkategori, gambar, nama_barang, harga, deskripsi, diskon, bahan, tags, sku, ukuran, warna } = response.data.data;
                    setProduct({ id_kategori, id_subkategori, gambar, nama_barang, harga, deskripsi, diskon, bahan, tags, sku, ukuran, warna });
                    setPreviewImage(`${imageUrl}/${gambar}`);
                } else {
                    setError('Failed to fetch product data');
                }
            } catch (error) {
                console.log('Error: ' + (error.response?.data?.message || error.message));
                setError('Failed to fetch product data');
            }
        };

        getProduct();
    }, [baseUrl, id, adminToken, imageUrl]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if ((name === 'harga' || name === 'diskon') && value.length > 10) {
            return;
        }
        if (name === 'gambar' && files.length > 0) {
            const file = files[0];
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setError('Invalid image format. Only JPG, PNG, and WEBP are allowed.');
                return;
            }
            setProduct({ ...product, [name]: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('id_kategori', parseInt(product.id_kategori));
            formData.append('id_subkategori', parseInt(product.id_subkategori));
            formData.append('nama_barang', product.nama_barang);
            if (product.gambar instanceof File) {
                formData.append('gambar', product.gambar);
            }
            formData.append('deskripsi', product.deskripsi);
            formData.append('harga', parseInt(product.harga));
            formData.append('diskon', parseInt(product.diskon));
            formData.append('bahan', product.bahan);
            formData.append('tags', product.tags);
            formData.append('sku', product.sku);
            formData.append('ukuran', product.ukuran);
            formData.append('warna', product.warna);
            formData.append('_method', 'PUT');

            const tokenObject = JSON.parse(adminToken);
            const token = tokenObject.access_token;

            const response = await axios.post(`${baseUrl}/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('Product updated Successfully');
                setTimeout(() => {
                    window.location.href = '/login/dashboard';
                }, 1500)
            } else {
                alert('Failed to update product');
            }
        } catch (error) {
            console.error('Error:', error.message);
            setError('Failed to update product');
        }
    };

    const handleAdminLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout as admin?');
        if (confirmLogout) {
            localStorage.removeItem('admin');
            history.push('/login');
        }
    };

    const handleSidebarClick = () => {
        history.push('/login/dashboard');
    };

    if (error) {
        return <div className="update-product-error">{error}</div>;
    }

    const categories = [
        { value: '1', label: 'Shoes' },
        { value: '2', label: 'Pants' },
        { value: '3', label: 'Jacket' },
        { value: '4', label: 'T-Shirt' },
        { value: '5', label: 'Hoodie' },
    ];

    return (
        <div className='dashboard-container'>
            <div className='navbar-dashboard'>
                <div>
                    <button className='button-login-dashboard' onClick={handleAdminLogout}>
                        <p>Logout from Admin <TbLogout style={{ marginLeft: '5px', transform: 'TranslateY(3px)' }} /></p>
                    </button>
                </div>
            </div>
            {showSidebar && (
                <div className='sidebar-dashboard'>
                    <div className='logo'>
                        <DiAngularSimple />
                        <h2>Adi'st<br /> Store</h2>
                    </div>
                    <div className="sidebar-menu">
                        <div className={`menu-item ${activeSection === 'Dashboard' ? 'active' : ''}`} onClick={handleSidebarClick}>
                            {activeSection === 'Dashboard' && <div className="indicator"></div>}
                            <MdDashboard />
                            <h3>Dashboard</h3>
                        </div>
                        <div className={`menu-item ${activeSection === 'Checkout-log' ? 'active' : ''}`} onClick={handleSidebarClick}>
                            {activeSection === 'Checkout-log' && <div className="indicator"></div>}
                            <FaArrowRightArrowLeft />
                            <h3>Checkout Data</h3>
                        </div>
                        <div className={`menu-item ${activeSection === 'Overview' ? 'active' : ''}`} onClick={handleSidebarClick}>
                            {activeSection === 'Overview' && <div className="indicator"></div>}
                            <FaBoxArchive />
                            <h3>Overview Product</h3>
                        </div>
                        <div className={`menu-item ${activeSection === 'addProduct' ? 'active' : ''}`} onClick={handleSidebarClick}>
                            {activeSection === 'addProduct' && <div className="indicator"></div>}
                            <FaCartArrowDown />
                            <h3>Add Product</h3>
                        </div>
                    </div>
                </div>
            )}
            <div className='main-dashboard'>
                {showAlert && (
                    <Stack sx={{ width: '100%' }} spacing={2} className="alert-container">
                        <Alert variant="outlined" severity="success">
                            Welcome to the Dashboard!
                        </Alert>
                    </Stack>
                )}
                <div className='card-add'>
                    <h1>Edit Product</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <p>Product Category</p>
                            <select
                                required
                                name="id_kategori"
                                value={product.id_kategori}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Product Subcategory</p>
                            <input
                                type="text"
                                name="id_subkategori"
                                value={product.id_subkategori}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product Image</p>
                            <input
                                type="file"
                                name="gambar"
                                onChange={handleChange}
                                accept="image/*"
                            />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />
                            )}
                        </div>
                        <div>
                            <p>Product Name</p>
                            <input
                                type="text"
                                name="nama_barang"
                                value={product.nama_barang}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product Description</p>
                            <input
                                name="deskripsi"
                                value={product.deskripsi}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product Price</p>
                            <input
                                type="number"
                                name="harga"
                                value={product.harga}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product Discount</p>
                            <input
                                type="number"
                                name="diskon"
                                value={product.diskon}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <p>Product Material</p>
                            <input
                                type="text"
                                name="bahan"
                                value={product.bahan}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product Tags</p>
                            <input
                                type="text"
                                name="tags"
                                value={product.tags}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product SKU</p>
                            <input
                                type="text"
                                name="sku"
                                value={product.sku}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product Size</p>
                            <input
                                type="text"
                                name="ukuran"
                                value={product.ukuran}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <p>Product Color</p>
                            <input
                                type="text"
                                name="warna"
                                value={product.warna}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button type="submit" variant="contained" color="primary">
                            Update Product
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
