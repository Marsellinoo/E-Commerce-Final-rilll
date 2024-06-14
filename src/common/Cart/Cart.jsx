import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useCart } from './CartContext'
import "./style.css";

const Cart = () => {
  const history = useHistory();
  const { cartItems, setCartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
  const [loading, setLoading] = useState(true);
  const urlImage = process.env.REACT_APP_API1_IMAGE_URL;

  useEffect(() => {
    const fetchCartItems = async () => {
      const baseApi = process.env.REACT_APP_BASEURL_API;
      const token = localStorage.getItem('memberId');
      if (token) {
        const idMember = token;
        try {
          const response = await axios.get(`${baseApi}/carts?id_member=${idMember}`);
          const cartData = response.data.data;
          const aggregatedCartItems = cartData.reduce((acc, item) => {
            const existingItem = acc.find(i => i.id_produk === item.id_produk);
            if (existingItem) {
              existingItem.qty += 1;
            } else {
              acc.push({ ...item, qty: 1 });
            }
            return acc;
          }, []);
          setCartItems(aggregatedCartItems);
        } catch (error) {
          console.error("Failed to fetch cart items:", error);
        } finally {
          setLoading(false);
        }
      } else {
        history.push("/login");
      }
    };

    fetchCartItems();
  }, [history, setCartItems]);

  const decreaseCartItem = async (item) => {
    const baseApi = process.env.REACT_APP_BASEURL_API;
    try {
      await axios.delete(`${baseApi}/carts/${item.id}`);
      decreaseQty(item);
      // Hapus item dari localStorage
      const updatedCartItems = cartItems.filter(i => i.id_produk !== item.id_produk);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error("Gagal mengurangi item keranjang:", error);
      if (error.response && error.response.data.error === "Keranjang tidak ditemukan") {
        setCartItems((prevItems) => {
          return prevItems.filter(cartItem => cartItem.id_produk !== item.id_produk);
        });
        // Hapus item dari localStorage jika tidak ditemukan di server
        const updatedCartItems = cartItems.filter(i => i.id_produk !== item.id_produk);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      }
    }
  };
  
  

  const increaseCartItem = async (item) => {
    const baseApi = process.env.REACT_APP_BASEURL_API;
    const token = localStorage.getItem('memberId');
    if (token) {
      const idMember = token;
      try {
        await axios.post(`${baseApi}/carts`, {
          id_member: idMember,
          id_produk: item.id_produk,
          gambar: item.image,
          nama_barang: item.nama_barang
        });
        increaseQty(item);
      } catch (error) {
        console.error("Failed to increase cart item:", error);
      }
    } else {
      history.push("/login");
    }
  };

  const totalPrice = cartItems.reduce((price, item) => price + item.qty * item.harga, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (cartItems.length === 0) {
    return <h1 className='no-items product'>No Items are added in Cart</h1>;
  }

  return (
    <>
      <section className='cart-items'>
        <div className='container d_flex'>
          <div className='cart-details'>
            {cartItems.map((item) => {
              const productQty = item.harga * item.qty;
              return (
                <div className='cart-list product d_flex' key={item.id}>
                  <div className='img'>
                    <img src={`${urlImage}/${item.gambar}`} alt='' />
                  </div>
                  <div className='cart-details'>
                    <h3>{item.nama_barang}</h3>
                    <h4>Rp. {item.harga.toLocaleString()}</h4>
                    <h2>Jumlah : {item.qty}</h2>
                    <span>Rp. {productQty.toLocaleString()}</span>
                  </div>
                  <div className='cart-items-function'>
                    <div className='removeCart'>
                      <button className='removeCart' onClick={() => decreaseCartItem(item)}>
                        <i className='fa-solid fa-xmark'></i>
                      </button>
                    </div>
                  </div>
                  <div className='cart-item-price'></div>
                </div>
              );
            })}
          </div>

          <div className='cart-total'>
            <h2>Cart Summary</h2>
            <div className='d_flex'>
              <h4>Total Price :</h4>
              <h3>Rp. {totalPrice.toLocaleString()}</h3>
            </div>
            <Link to="/checkout"><button className="button-cart checkout">CHECKOUT</button></Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
