import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ProductPopup from "./ProductPopup";

const ShopCart = ({ addToCart }) => {
  const [count, setCount] = useState(0);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const history = useHistory();

  const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
  const productsApi = process.env.REACT_APP_BASEURL_API;

  const fetchData = async (page = 1, search = searchQuery) => {
    try {
      const response = await axios.get(`${productsApi}/products`, {
        params: {
          page: page,
          per_page: perPage,
          nama_barang: search
        }
      });

      const { data } = response.data;
      const current_page = data.current_page;
      const last_page = data.last_page;
      const productsData = data.data;

      const mappedProducts = productsData.map(item => ({
        id: item.id,
        title: item.nama_barang,
        description: item.deskripsi,
        image: item.gambar,
        price: item.harga,
        bahan: item.bahan,
        size: item.ukuran,
        tags: item.tags
      }));

      setProducts(mappedProducts);
      setCurrentPage(current_page);
      setTotalPages(last_page);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, perPage, productsApi, searchQuery]);

  useEffect(() => {
    const selectedProduct = products.find(product => product.id === parseInt(id));
    setSelectedProduct(selectedProduct);
  }, [id, products]);

  const increment = () => {
    setCount(count + 1);
  };

  const toggleDescription = (productId) => {
    setExpandedProductId(productId === expandedProductId ? null : productId);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
    document.body.style.overflow = 'hidden';
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    } else {
      return description;
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    document.body.style.overflow = 'auto';
  };

  const filteredProducts = [...products].filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Update query parameter in URL
    history.push(`/?page=${value}&search=${searchQuery}`);
  };

  // Function to parse query parameters from URL
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const search = params.get('search');
    return { page, search };
  };

  useEffect(() => {
    // Get query parameters from URL
    const { page, search } = getUrlParams();
    setCurrentPage(page ? parseInt(page) : 1);
    setSearchQuery(search || '');
  }, []);

  return (
    <>
      <div>
        <form className="search-product">
          <label htmlFor="search">
            <input
              required
              autoComplete="off"
              placeholder="Search products"
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <div className="icon">
              <svg strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="swap-on">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
              <svg strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="swap-off">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinejoin="round" strokeLinecap="round"></path>
              </svg>
            </div>
            <button type="reset" className="close-btn">
              <svg viewBox="0 0 20 20" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fillRule="evenodd"></path>
              </svg>
            </button>
          </label>
        </form>
      </div>
      <div className="flex-wrap-product">
        {filteredProducts.map((product) => (
          <div className='box ' key={product.id}>
            <div className='product-container mtop' onClick={() => handleProductClick(product)}>
              <div className='img'>
                <div className="img-container">
                  <img src={`${urlImage}/${product.image}`} alt='' />
                </div>
                <div className='product-like'>
                  <label>{count}</label> <br />
                  <i className='fa-regular fa-heart' onClick={increment}></i>
                </div>
              </div>
              <div className='product-details'>
                <h3>{product.title.length > 40 ? product.title.substring(0, 40) + '...' : product.title}</h3>
                <p>{expandedProductId === product.id ? product.description : truncateDescription(product.description, 100)}</p>
                {product.description.length > 100 && (
                  <button onClick={() => toggleDescription(product.id)}>Learn More</button>
                )}
                <div className='price'>
                  <h4>Rp. {product.price.toLocaleString()} </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
        {showPopup && (
          <ProductPopup
            selectedProduct={selectedProduct}
            handleClosePopup={handleClosePopup}
            addToCart={addToCart}
          />
        )}
      </div>
      <Stack spacing={2} alignItems="center">
        <Pagination 
          count={totalPages} 
          page={currentPage || 1} 
          onChange={handlePageChange} 
          color="primary" 
          showFirstButton 
          showLastButton 
        />
      </Stack>
    </>
  );
};

export default ShopCart;
