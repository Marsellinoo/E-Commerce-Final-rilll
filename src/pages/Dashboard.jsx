import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { TbLogout } from 'react-icons/tb';
import { FaCartArrowDown, FaUserCircle } from "react-icons/fa";
import { DiAngularSimple } from "react-icons/di";
import { RiImageAddLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { FaBoxArchive, FaArrowRightArrowLeft } from "react-icons/fa6";
import Stack from '@mui/material/Stack';
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import Chart from './Chart';
import Log from './Log';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FaBoxes } from "react-icons/fa";
import { PiUsersThreeFill } from "react-icons/pi";
import Users from './Users';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [productData, setProductData] = useState({
        id_kategori: '',
        id_subkategori: '',
        nama_barang: '',
        deskripsi: '',
        harga: '',
        diskon: '',
        bahan: '',
        tags: '',
        sku: '',
        ukuran: '',
        warna: '',
        gambar: null
    });

    const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
    const baseApi = process.env.REACT_APP_BASEURL_API;
    const [products, setProducts] = useState([]);
    const history = useHistory();
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

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
        const isAdminLoggedIn = localStorage.getItem('admin');
        if (!isAdminLoggedIn) {
            history.push('/login');
        } else {
            toast.success("Anda berada pada dashboard admin!", toastConfig);
        }
        setActiveSection('Dashboard');
    }, [history]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApi}/products`, {
                    params: {
                        search: searchQuery
                    }
                });
                if (response.status !== 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = response.data;
                const products = data.data.map(item => ({
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

                setProducts([...products]);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, [baseApi + '/products', searchQuery]);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const categories = [
        { value: '1', label: 'Shoes' },
        { value: '2', label: 'Pants' },
        { value: '3', label: 'Jacket' },
        { value: '4', label: 'T-Shirt' },
        { value: '5', label: 'Hoodie' },
    ];

    const categoryLabels = {
        '1': 'Shoes(1)',
        '2': 'Pants(2)',
        '3': 'Jacket(3)',
        '4': 'T-Shirt(4)',
        '5': 'Hoodie(5)'
    };

    const productsWithCategoryLabel = products.map(product => ({
        ...product,
        category: categoryLabels[product.category] || product.category
    }));

    const filteredProducts = productsWithCategoryLabel.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const productsWithSequentialIds = filteredProducts.map((product, index) => ({
        ...product,
        sequentialId: index + 1,
    }));

    const handleAdminLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout as admin?');
        if (confirmLogout) {
            localStorage.removeItem('admin');
            history.push('/login');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('admin');
        const tokenObject = JSON.parse(accessToken);
        const token = tokenObject.access_token;

        const formData = new FormData();
        formData.append('id_kategori', productData.id_kategori);
        formData.append('id_subkategori', productData.id_subkategori);
        formData.append('nama_barang', productData.nama_barang);
        formData.append('gambar', file);
        formData.append('deskripsi', productData.deskripsi);
        formData.append('harga', productData.harga);
        formData.append('diskon', productData.diskon);
        formData.append('bahan', productData.bahan);
        formData.append('tags', productData.tags);
        formData.append('sku', productData.sku);
        formData.append('ukuran', productData.ukuran);
        formData.append('warna', productData.warna);

        console.log(file)
        try {
            const response = await axios.post(baseApi + '/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Product uploaded:', response.data);
            toast.success('Product uploaded successfully', toastConfig);
            setProductData({
                id_kategori: '',
                id_subkategori: '',
                nama_barang: '',
                deskripsi: '',
                harga: '',
                diskon: '',
                bahan: '',
                tags: '',
                sku: '',
                ukuran: '',
                warna: ''
            });
            setFile(null);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.warn('Session expired. Please log in again.', toastConfig);
                localStorage.removeItem('admin');
                history.push('/login');
            } else {
                console.error('Error uploading product:', error);
                toast.error('Gagal upload, coba lagi', toastConfig);
            }
        }
    };


    const handleDeleteProduct = async (productId) => {
        const accessToken = localStorage.getItem('admin');
        const tokenObject = JSON.parse(accessToken);
        const token = tokenObject.access_token;

        try {
            await axios.delete(`${baseApi}/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
        <div className='dashboard-container'>
            <ToastContainer {...toastConfig} />
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
                        <div className={`menu-item ${activeSection === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('Dashboard')}>
                            {activeSection === 'Dashboard' && <div className="indicator"></div>}
                            <MdDashboard />
                            <h3>Dashboard</h3>
                        </div>
                        <div className={`menu-item ${activeSection === 'Checkout-log' ? 'active' : ''}`} onClick={() => setActiveSection('Checkout-log')}>
                            {activeSection === 'Checkout-log' && <div className="indicator"></div>}
                            <FaArrowRightArrowLeft />
                            <h3>Checkout Data</h3>
                        </div>
                        <div className={`menu-item ${activeSection === 'Overview' ? 'active' : ''}`} onClick={() => setActiveSection('Overview')}>
                            {activeSection === 'Overview' && <div className="indicator"></div>}
                            <FaBoxArchive />
                            <h3>Overview Product</h3>
                        </div>
                        <div className={`menu-item ${activeSection === 'addProduct' ? 'active' : ''}`} onClick={() => setActiveSection('addProduct')}>
                            {activeSection === 'addProduct' && <div className="indicator"></div>}
                            <FaCartArrowDown />
                            <h3>Add Product</h3>
                        </div>
                        <div className={`menu-item ${activeSection === 'Users' ? 'active' : ''}`} onClick={() => setActiveSection('Users')}>
                            {activeSection === 'Users' && <div className="indicator"></div>}
                            <PiUsersThreeFill />
                            <h3>Users</h3>
                        </div>
                    </div>
                </div>
            )}
            <div className='main-dashboard'>
                {activeSection === 'Overview' && (
                    <div className='overview-container'>
                        {/* SECTION DASHBOARD */}
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
                                {productsWithSequentialIds.map(product => (
                                    <tr key={product.id}>
                                        <td style={{ textAlign: 'center' }}>{product.sequentialId}</td>
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
                )}
                {activeSection === 'addProduct' && (
                    <div className='card-add'>
                        <h1>Product Additions</h1>

                        <div>
                            <p>Product Category</p>
                            <select
                                required
                                name='id_kategori'
                                value={productData.id_kategori}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Product Subcategory</p>
                            <select
                                required
                                name='id_subkategori'
                                value={productData.id_subkategori}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Product Title</p>
                            <input
                                required
                                placeholder='Your product title...'
                                type='text'
                                name='nama_barang'
                                value={productData.nama_barang}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product Image</p>
                            {!file && (
                                <>
                                    <label htmlFor="image-upload" className="image-upload-label">
                                        <RiImageAddLine /><br />
                                        <small>Upload Your Image</small>
                                    </label>
                                    <input
                                        required
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </>
                            )}
                            {file && (
                                <div className="image-uploaded">
                                    <img src={URL.createObjectURL(file)} alt="Uploaded Product" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p>Product Description</p>
                            <input
                                required
                                placeholder='Your product description...'
                                type='text'
                                name='deskripsi'
                                value={productData.deskripsi}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product Price</p>
                            <input
                                required
                                placeholder='Your product price...'
                                type='text'
                                name='harga'
                                value={productData.harga}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product Material</p>
                            <input
                                required
                                placeholder='Your product material...'
                                type='text'
                                name='bahan'
                                value={productData.bahan}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product Size</p>
                            <input
                                required
                                placeholder='Your product size...'
                                type='text'
                                name='ukuran'
                                value={productData.ukuran}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product Tags</p>
                            <input
                                required
                                placeholder='Your product tags...'
                                type='text'
                                name='tags'
                                value={productData.tags}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product SKU</p>
                            <input
                                required
                                placeholder='Your product SKU...'
                                type='text'
                                name='sku'
                                value={productData.sku}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product Discount</p>
                            <input
                                required
                                placeholder='Your product discount...'
                                type='text'
                                name='diskon'
                                value={productData.diskon}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <p>Product Color</p>
                            <input
                                required
                                placeholder='Your product color...'
                                type='text'
                                name='warna'
                                value={productData.warna}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button className='button-dashboard' onClick={handleSubmit}>Send!</button>
                    </div>
                )}
                {activeSection === 'Dashboard' && (
                    <div className='card-add'>
                        <h1>Dashboard</h1>
                        <Chart />
                        <div className='button-dashboard-chart'>
                            <Stack spacing={4} direction="row">
                                <Button variant="contained" className={`menu-item ${activeSection === 'Overview' ? 'active' : ''}`} onClick={() => setActiveSection('Overview')}>Overview Product</Button>
                                <Button variant="contained" className={`menu-item ${activeSection === 'Checkout-log' ? 'active' : ''}`} onClick={() => setActiveSection('Checkout-log')}>Checkout Data</Button>
                            </Stack>
                        </div>
                    </div>
                )}
                {activeSection === 'Checkout-log' && (
                    <div className='card-add'>
                        <h1>Data Checkout</h1>
                        <Log />
                    </div>
                )}
                {activeSection === 'Users' && (
                    <div className='card-add'>
                        <h1>Users</h1>
                        <Users />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
