import React, { useState } from 'react';
import "../History.css";
import { FaRegUser } from "react-icons/fa";
import { PiNotePencil } from "react-icons/pi";
import { IoIosCheckboxOutline } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import { GiReceiveMoney } from "react-icons/gi";
import { CiCircleCheck } from "react-icons/ci";
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: <FaRegUser />, label: "Semua", link: "/history-checkout" },
  { icon: <PiNotePencil />, label: "Dibuat", link: "/history-checkout/created" },
  { icon: <IoIosCheckboxOutline />, label: "Dikonfirmasi", link: "/history-checkout/confirmed" },
  { icon: <CiDeliveryTruck />, label: "Dikirim", link: "/history-checkout/shipped" },
  { icon: <GiReceiveMoney />, label: "Diterima", link: "/history-checkout/received" },
  { icon: <CiCircleCheck />, label: "Selesai", link: "/history-checkout/completed" },
];

const MenuHistory = () => {
  return (
    <div className="history-menu">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className={`value ${item.label === "Dibuat" ? 'active' : ''}`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default MenuHistory;