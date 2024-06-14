import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./common/header/Header";
import Pages from "./pages/Pages";
import Cart from "./common/Cart/Cart";
import Checkout from "./common/Checkout/Checkout";
import Footer from "./common/footer/Footer";
import Hoodie from "./pages/Hoodie";
import Jacket from "./pages/Jacket";
import Pants from "./pages/Pants";
import Shirt from "./pages/Shirt"
import Shoes from "./pages/Shoes";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProduct from "./pages/EditProduct";
import History from "./pages/History";
import HistoryDetail from "./components/history/history-detail/HistoryDetail";

function App() {
  const [productItems, setProductItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProductItems(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (product) => {
    const productExit = cartItems.find((item) => item.id === product.id);
    if (productExit) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...productExit, qty: productExit.qty + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const decreaseQty = (product) => {
    const productExit = cartItems.find((item) => item.id === product.id);
    if (productExit.qty === 1) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...productExit, qty: productExit.qty - 1 } : item
        )
      );
    }
  };

  const increaseQty = (product) => {
    const productExit = cartItems.find((item) => item.id === product.id);
    if (productExit.qty === 1) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...productExit, qty: productExit.qty + 1 } : item
        )
      );
    }
  };

  const removeFromCart = (itemToRemove) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemToRemove.id);
    setCartItems(updatedCartItems);
  };

  return (
    <>
      <Router>
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/" exact>
            <Header CartItem={cartItems} />
            <Pages productItems={productItems} addToCart={addToCart} />
            <Footer />
          </Route>
          <Route path="/hoodie" exact>
            <Header CartItem={cartItems} />
            <Hoodie productItems={productItems} addToCart={addToCart} />
            <Footer />
          </Route>
          <Route path="/jackets" exact>
            <Header CartItem={cartItems} />
            <Jacket productItems={productItems} addToCart={addToCart} />
            <Footer />
          </Route>
          <Route path="/pants" exact>
            <Header CartItem={cartItems} />
            <Pants productItems={productItems} addToCart={addToCart} />
            <Footer />
          </Route>
          <Route path="/shirt" exact>
            <Header CartItem={cartItems} />
            <Shirt productItems={productItems} addToCart={addToCart} />
            <Footer />
          </Route>
          <Route path="/shoes" exact>
            <Header CartItem={cartItems} />
            <Shoes productItems={productItems} addToCart={addToCart} />
            <Footer />
          </Route>
          <Route path="/cart" exact component={Cart}>
            <Header CartItem={cartItems} />
            <Cart CartItem={cartItems} addToCart={addToCart} decreaseQty={decreaseQty} increaseQty={increaseQty} removeFromCart={removeFromCart} />
            <Footer />
          </Route>
          <Route path="/checkout" exact component={Checkout}>
            <Header CartItem={cartItems} />
            <Checkout CartItem={cartItems} decreaseQty={decreaseQty} />
            <Footer />
          </Route>
          <Route path="/profile" exact>
            <Header CartItem={cartItems} />
            <Profile />
            <Footer />
          </Route>
          <Route path="/history-checkout" exact>
            <Header CartItem={cartItems} />
            <History />
            <Footer />
          </Route>
          <Route path="/login/dashboard" exact>
            {/* <Header CartItem={cartItems}/> */}
            <Dashboard />
          </Route>
          <Route path="/login/dashboard/editproduct/:id" exact>
            <EditProduct />
          </Route>
          <Route path="/history-checkout/details" exact>
            <Header CartItem={cartItems} />
            <HistoryDetail />
            <Footer />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
