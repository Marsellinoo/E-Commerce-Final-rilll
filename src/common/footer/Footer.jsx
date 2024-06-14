import React from "react"
import "./style.css"
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import appImg from './image/app.png'
import playImg from './image/play.jpg'
import payImg from './image/pay.png'

const Footer = () => {
  return (
    <div className='footer-container'>
      <div className="col-footer">
        <h4>Contact</h4>
        <p><strong>Address:</strong> Jl. Ampel No.23, Demangan Baru, Caturtunggal, Kec. Depok,<br /> Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281</p>
        <p><strong>Phone:</strong> 0851-7107-1069</p>
        <p><strong>Gmail:</strong> nugraha.cahya@gmail.com</p>
        <p><strong>Hours:</strong> 09.00-17.00 Monday - Friday</p>
        <div className="flex-footer">
          <div className="follow-footer">
            <h4>Follow Us</h4>
            <div className="social-media">
              <a href="https://www.instagram.com/thenorthface/"><FaInstagram /></a>
              <a href="https://twitter.com/thenorthface"><FaTwitter /></a>
              <a href="https://id.pinterest.com/thenorthface/"><FaPinterest /></a>
              <a href="https://www.youtube.com/c/TheNorthFace"><FaYoutube /></a>
            </div>
          </div>
          <div className="subs-footer">
            <h4>Subscribe</h4>
            <p>Receive product news and updates in your inbox.</p>
            <input type="email" placeholder="Enter your email"/>
          </div>
        </div>
      </div>
      <div className="col-footer">
        <h4>About</h4>
        <a href="#">About us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Delivery Information</a>
        <a href="#">Contact us</a>
        <a href="#">Terms & Conditions</a>
      </div>
      <div className="col-footer">
        <h4>My Account</h4>
        <a href="#">Sign In</a>
        <a href="#">View Cart</a>
        <a href="#">My Wishlist</a>
        <a href="#">Track My Order</a>
        <a href="#">Help</a>
      </div>
      <div className="col-install-footer">
        <h4>Install Apps</h4>
        <p>From App Store or Goole Play</p>
        <div className="row-footer">
          <img src={appImg} alt="" />
          <img src={playImg} alt="" />
        </div>
        <p>Secured Payment Gateways</p>
        <img src={payImg} alt="" />
      </div>
      <div className="copyright-footer">
        <p>Copyright &copy;2024; Designed by Marsellinoo</p>
      </div>
    </div>
  )
}

export default Footer
