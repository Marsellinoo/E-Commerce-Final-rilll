import React, { useState } from "react";
import ShoesCart from "./ShoesCart";
import '../style.css';

const Shop = ({ addToCart, shopItems }) => {

  return (
    <>
      <section className='shop background'>
        <div className='container d_flex'>
          <div className='contentWidth'>
            <div className='heading d_flex'>
              <div className='heading-left row f_flex product-title'>
                <h1>Shoes</h1>
              </div>
            </div>
            <div className='flex-wrap-product'>
              <ShoesCart addToCart={addToCart} shopItems={shopItems}/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
