import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import ProductPopup from "../ProductPopup";

const ShopCart = ({ addToCart }) => {
  const [count, setCount] = useState(0);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
  const productsApi = process.env.REACT_APP_BASEURL_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(productsApi + '/products/search?nama_barang=');
        const productsData = response.data.data
          .filter(item => item.id_kategori === 3)
          .map(item => ({
            id: item.id,
            title: item.nama_barang,
            description: item.deskripsi,
            image: item.gambar,
            price: item.harga,
            bahan: item.bahan,
            size: item.ukuran,
            tags: item.tags
          }));

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [productsApi]);

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
  };

  const shuffledProducts = [...products].sort(() => Math.random() - 0.5);

  const filteredProducts = shuffledProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <path clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fillRule="evenodd"></path>
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
    </>
  );
};

export default ShopCart;
