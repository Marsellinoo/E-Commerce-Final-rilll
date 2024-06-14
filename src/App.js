import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./common/header/Header";
import Footer from "./common/footer/Footer";
import Pages from "./pages/Pages";
import Hoodie from "./pages/Hoodie";
import Jacket from "./pages/Jacket";
import Pants from "./pages/Pants";
import Shirt from "./pages/Shirt";
import Shoes from "./pages/Shoes";
import Cart from "./common/Cart/Cart";
import Checkout from "./common/Checkout/Checkout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProduct from "./pages/EditProduct";
import History from "./pages/History";
import HistoryDetail from "./components/history/history-detail/HistoryDetail";
import HistoryCreated from "./components/history/pages/HistoryCreated";
import HistoryConfirmed from "./components/history/pages/HistoryConfirmed"
import HistoryCompleted from "./components/history/pages/HistoryCompleted"
import HistoryReceived from "./components/history/pages/HistoryReceived"
import HistoryShipped from "./components/history/pages/HistoryShipped"

const MainLayout = ({ children, cartItems }) => (
  <>
    <Header CartItem={cartItems} />
    {children}
    <Footer />
  </>
);

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
    setCartItems(
      cartItems.map((item) =>
        item.id === product.id ? { ...productExit, qty: productExit.qty + 1 } : item
      )
    );
  };

  const removeFromCart = (itemToRemove) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemToRemove.id);
    setCartItems(updatedCartItems);
  };

  return (
    <Router>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/login/dashboard" exact component={Dashboard} />
        <Route path="/login/dashboard/editproduct/:id" exact component={EditProduct} />

        <Route path="/" exact>
          <MainLayout cartItems={cartItems}>
            <Pages productItems={productItems} addToCart={addToCart} />
          </MainLayout>
        </Route>

        <Route path="/hoodie" exact>
          <MainLayout cartItems={cartItems}>
            <Hoodie productItems={productItems} addToCart={addToCart} />
          </MainLayout>
        </Route>

        <Route path="/jackets" exact>
          <MainLayout cartItems={cartItems}>
            <Jacket productItems={productItems} addToCart={addToCart} />
          </MainLayout>
        </Route>

        <Route path="/pants" exact>
          <MainLayout cartItems={cartItems}>
            <Pants productItems={productItems} addToCart={addToCart} />
          </MainLayout>
        </Route>

        <Route path="/shirt" exact>
          <MainLayout cartItems={cartItems}>
            <Shirt productItems={productItems} addToCart={addToCart} />
          </MainLayout>
        </Route>

        <Route path="/shoes" exact>
          <MainLayout cartItems={cartItems}>
            <Shoes productItems={productItems} addToCart={addToCart} />
          </MainLayout>
        </Route>

        <Route path="/cart" exact>
          <MainLayout cartItems={cartItems}>
            <Cart
              CartItem={cartItems}
              addToCart={addToCart}
              decreaseQty={decreaseQty}
              increaseQty={increaseQty}
              removeFromCart={removeFromCart}
            />
          </MainLayout>
        </Route>

        <Route path="/checkout" exact>
          <MainLayout cartItems={cartItems}>
            <Checkout CartItem={cartItems} decreaseQty={decreaseQty} />
          </MainLayout>
        </Route>

        <Route path="/profile" exact>
          <MainLayout cartItems={cartItems}>
            <Profile />
          </MainLayout>
        </Route>

        <Route path="/history-checkout" exact>
          <MainLayout cartItems={cartItems}>
            <History />
          </MainLayout>
        </Route>

        <Route path="/history-checkout/details/:id" exact>
          <MainLayout cartItems={cartItems}>
            <HistoryDetail />
          </MainLayout>
        </Route>

        <Route path="/history-checkout/created" exact>
          <MainLayout cartItems={cartItems}>
            <HistoryCreated />
          </MainLayout>
        </Route>
        <Route path="/history-checkout/completed" exact>
          <MainLayout cartItems={cartItems}>
            <HistoryCompleted />
          </MainLayout>
        </Route>
        <Route path="/history-checkout/confirmed" exact>
          <MainLayout cartItems={cartItems}>
            <HistoryConfirmed />
          </MainLayout>
        </Route>
        <Route path="/history-checkout/received" exact>
          <MainLayout cartItems={cartItems}>
            <HistoryReceived />
          </MainLayout>
        </Route>
        <Route path="/history-checkout/shipped" exact>
          <MainLayout cartItems={cartItems}>
            <HistoryShipped />
          </MainLayout>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
