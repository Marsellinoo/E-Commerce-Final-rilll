import React, { useState } from 'react';
import axios from 'axios';
import { RiImageAddLine } from "react-icons/ri";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

const AddProduct = ({ baseApi, toastConfig, categories }) => {
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
        warna: ''
    });

    const history = useHistory();

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
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });
        formData.append('gambar', file);

        try {
            const response = await axios.post(baseApi + '/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
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

    return (
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
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <form className='form-add' onSubmit={handleSubmit}>
                <div>
                    <label>Product Title</label>
                    <input
                        type='text'
                        name='nama_barang'
                        value={productData.nama_barang}
                        onChange={handleInputChange}
                        placeholder='Enter product name'
                        required
                    />
                </div>
                <div>
                    <label>Product Description</label>
                    <textarea
                        name='deskripsi'
                        value={productData.deskripsi}
                        onChange={handleInputChange}
                        placeholder='Enter product description'
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Product Price</label>
                    <input
                        type='text'
                        name='harga'
                        value={productData.harga}
                        onChange={handleInputChange}
                        placeholder='Enter product price'
                        required
                    />
                </div>
                <div>
                    <label>Product Discount</label>
                    <input
                        type='text'
                        name='diskon'
                        value={productData.diskon}
                        onChange={handleInputChange}
                        placeholder='Enter product discount'
                    />
                </div>
                <div>
                    <label>Product Material</label>
                    <input
                        type='text'
                        name='bahan'
                        value={productData.bahan}
                        onChange={handleInputChange}
                        placeholder='Enter product material'
                    />
                </div>
                <div>
                    <label>Product Tags</label>
                    <input
                        type='text'
                        name='tags'
                        value={productData.tags}
                        onChange={handleInputChange}
                        placeholder='Enter product tags'
                    />
                </div>
                <div>
                    <label>Product SKU</label>
                    <input
                        type='text'
                        name='sku'
                        value={productData.sku}
                        onChange={handleInputChange}
                        placeholder='Enter product SKU'
                    />
                </div>
                <div>
                    <label>Product Size</label>
                    <input
                        type='text'
                        name='ukuran'
                        value={productData.ukuran}
                        onChange={handleInputChange}
                        placeholder='Enter product size'
                    />
                </div>
                <div>
                    <label>Product Color</label>
                    <input
                        type='text'
                        name='warna'
                        value={productData.warna}
                        onChange={handleInputChange}
                        placeholder='Enter product color'
                    />
                </div>
                <div className='file-upload'>
                    <label>Product Image</label>
                    <input
                        type='file'
                        name='gambar'
                        onChange={handleFileChange}
                        required
                    />
                    {file && <img src={URL.createObjectURL(file)} alt='Preview' />}
                </div>
                <button type='submit'>Add Product</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddProduct;
