import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import Rating from '@mui/material/Rating';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './style.css';

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className='control-btn' onClick={onClick}>
      <button className='next'>
        <i className='fa fa-long-arrow-alt-right'></i>
      </button>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className='control-btn' onClick={onClick}>
      <button className='prev'>
        <i className='fa fa-long-arrow-alt-left'></i>
      </button>
    </div>
  );
};

const FlashCard = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(3);
  const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
  const productsApi = process.env.REACT_APP_BASEURL_API;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(productsApi + '/products/search?nama_barang=');
        const productsData = response.data.data.map(item => ({
          id: item.id,
          name: item.nama_barang,
          description: item.deskripsi,
          image: item.gambar,
          price: item.harga,
          discount: item.discount || 0,
          bahan: item.bahan,
          size: item.ukuran,
          tags: item.tags,
          rating: Math.random() * 2 + 3
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const increment = () => {
    setCount(count + 1);
  };

  const truncateName = (name, maxLength) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 473,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...settings}>
        {products.map((product) => (
          <div className='box' key={product.id}>
            <div className='product-flash mtop'>
              <div className='img flash-img-container'>
                <span className='discount'>{product.discount}% Off</span>
                <img className="flash-img" src={`${urlImage}/${product.image}`} alt={product.name} />
                <div className='product-like'>
                  <label>{count}</label> <br />
                  <i className='fa-regular fa-heart' onClick={increment}></i>
                </div>
              </div>
              <div className='product-details'>
                <div className="product-title">
                  <h3>{truncateName(product.name, 25)}</h3>
                </div>
                <Rating name="product-rating" defaultValue={product.rating} precision={0.5} readOnly />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default FlashCard;
