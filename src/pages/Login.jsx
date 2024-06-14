import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const baseApi = process.env.REACT_APP_BASEURL_API;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toastConfig = {
    position: "top-center",
    autoClose: 5000,
    limit: 2,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  };

  const handleLoginAdminSuccess = () => {
    window.location.href = "/login/dashboard";
  };

  const handleLoginSuccess = () => {
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminResponse = await axios.post(baseApi + '/auth/admin', { email, password });
      console.log(adminResponse.data);
      localStorage.setItem("admin", JSON.stringify(adminResponse.data));
      if (adminResponse.status === 200 && email === "admin@admin.com" && password === "admin") {
        handleLoginAdminSuccess();
      } else {
        toast.error("Email atau kata sandi salah", toastConfig);
      }
    } catch (adminError) {
      try {
        const userResponse = await axios.post(baseApi + '/login', { email, password });
        console.log(userResponse.data);
        localStorage.setItem("data", userResponse.data);

        const membersResponse = await axios.get(baseApi + '/members', {
          headers: {
            Authorization: `Bearer ${userResponse.data.access_token}`,
          }
        });

        const member = membersResponse.data.data.find((member) => member.email === email);
        if (member) {
          const memberId = member.id;
          const email = member.email;
          localStorage.setItem("memberId", memberId);
          localStorage.setItem("memberEmail", email);
          handleLoginSuccess();
        } else {
          toast.error("Gagal menemukan member ID, silakan coba lagi.", toastConfig);
        }
      } catch (userError) {
        console.error(userError);
        if (userError.response && userError.response.status === 403) {
          toast.error("Akun Anda telah diblokir oleh admin.", toastConfig);
        } else {
          toast.error("Email atau kata sandi salah", toastConfig);
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='login-section-container'>
      <ToastContainer {...toastConfig} />
      <div className="form-container">
        <p className="title">Login</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Gmail</label>
            <input 
              type="text" 
              name="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="" 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="" 
                required 
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />} 
              </button>
            </div>
          </div>
          <button type="submit" className="sign">Sign in</button>
        </form>
        <div className="social-message">
          <div className="line"></div>
          <p className="message">Login with social accounts</p>
          <div className="line"></div>
        </div>
        <div className="social-icons">
        </div>
        <p className="signup">Don't have an account?
          <Link to="/register" className="">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
