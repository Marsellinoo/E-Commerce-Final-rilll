import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Mendapatkan cartItems dari localStorage saat komponen dimuat
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    // Menyimpan cartItems ke localStorage setiap kali terjadi perubahan
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (item) => {
    setCartItems((prevItems) => prevItems.filter(i => i.id_produk !== item.id_produk));
  };

  const increaseQty = (item) => {
    setCartItems((prevItems) =>
      prevItems.map(i => i.id_produk === item.id_produk ? { ...i, qty: i.qty + 1 } : i)
    );
  };

  const decreaseQty = (item) => {
    setCartItems((prevItems) =>
      prevItems.map(i => i.id_produk === item.id_produk ? { ...i, qty: i.qty - 1 } : i)
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, increaseQty, decreaseQty }}>
      {children}
    </CartContext.Provider>
  );
};
